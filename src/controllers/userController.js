const { db } = require("../../db");
const User = require("../models/user");
const config = require("../utils/config");

const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
const app = initializeApp(config);
const auth = getAuth(app);

const { validateSignUpData, validateLoginData } = require("../../validators");
const { json } = require("body-parser");
const { response, request } = require("express");
const client = require("../utils/configtwilio");

// User login
exports.loginUser = async (request, response) => {
  const userrequest = {
    phone: request.body.phone,
    password: request.body.password,
  };

  const { valid, errors } = validateLoginData(userrequest);
  if (!valid) return response.status(400).json(errors);

  db.collection("users")
    .where("phone", "==", userrequest.phone)
    .get()
    .then((data) => {
      if(!data.empty){
        data.forEach((doc) => {
          let userInfor = { ...doc.data() };
          if (userInfor.email !== "") {
            signInWithEmailAndPassword(
              auth,
              userInfor.email,
              userrequest.password
            )
              .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                return response.json({ user: userInfor, status: true });
                // ...
              })
              .catch((error) => {
                console.error(error);
                return response.status(403).json({
                  error: "Đã xảy ra lỗi , vui lòng thử lại",
                  status: false,
                });
              });
          } else {
            return response.status(500).json({
              error: "Đã xảy ra lỗi , vui lòng thử lại",
              status: false,
            });
          }
        });
      }else {
        return response.status(500).json({ error: "Đã có lỗi", status: false });
      }
      
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: "Đã có lỗi !", status: false });
    });
};
// dang ky tk mới
exports.signUpUser = (request, response) => {
  const generateEmail = "user"
    .concat(Date.now().toString())
    .concat("@gmail.com");
  const newUser = {
    phoneNumber: request.body.phoneNumber,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    username: request.body.username,
    email: generateEmail,
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return response.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.phoneNumber}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response.status(400).json({
          error: "Số điện thoại đã tồn tại, vui lòng sử dụng số khác !",
        });
      } else {
        return createUserWithEmailAndPassword(
          auth,
          newUser.email,
          newUser.password
        )
          .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
          })
          .then((idtoken) => {
            token = idtoken;
            const userCredentials = {
              username: newUser.username,
              phone: newUser.phoneNumber,
              createdAt: new Date().toISOString(),
              email: newUser.email,
              avatar:
                "https://firebasestorage.googleapis.com/v0/b/key-fix.appspot.com/o/users%2Favatardf.png?alt=media&token=8b2b7895-5cf4-4d38-aec2-7e6a795cbd2f",
              userId,
              isVerify: false,
              otp: "",
            };
           db.doc(`/users/${newUser.phoneNumber}`).set(userCredentials);
            return response
              .status(201)
              .json({ token, status: true, user: userCredentials });
          })
      }
    })

    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return response
          .status(400)
          .json({ email: "Email already in use", status: false });
      } else {
        return response
          .status(500)
          .json({ error: "Đã xảy ra lỗi, Vui lòng thử lại", status: false });
      }
    });
};
exports.sendOTPVerify = (request, response) => {
  const otp = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
  const datareq = {
    phone: request.body.phone,
  };
  console.log(datareq);

  db.collection("users")
    .doc(datareq.phone)
    .update({
      otp: `${otp}`,
    });

  client.messages
    .create({
      body: `Ma xac thuc OTP la ${otp} `,
      from: "+14346867175",
      to: `+84386200961`,
    })
    .then((messages) => {
      console.log(messages);
      return response.json({ status: true });
    })
    .catch((err) => {
      console.error(err);
      return response
        .status(400)
        .json({ error: "Đã có lỗi xảy ra!", status: false });
    });
};

exports.VerifyOTP = (request, response) => {
  const datareq = {
    phone: request.body.phone,
    otp: request.body.otp,
  };
  console.log(datareq);

  db.doc(`/users/${datareq.phone}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let user = { ...doc.data() };
        console.log(user);
        if (user) {
          if (datareq.otp === user.otp) {
            db.collection("users").doc(datareq.phone).update({
              isVerify: true,
            });
            return response.json({ status: true });
          } else {
            return response
              .status(400)
              .json({ error: "Đã có lỗi xảy ra!", status: false });
          }
        } else {
          return response
            .status(400)
            .json({ error: "Đã có lỗi xảy ra!", status: false });
        }
      }
    });
};

exports.logOutUser = (req, res) => {
  signOut(auth)
    .then(() => {
      return res.json({ status: true });
    })
    .catch((error) => {
      return res.json({ status: false });
    });
};

exports.updateAvatarUser = async (req, res) => {
  const datareq = {
    image: req.body.avatar,
    phone: req.body.phone,
  };
  db.collection("users")
    .doc(datareq.phone)
    .update({
      avatar: datareq.image,
    })
    .then(() => {
      return res.json({ status: true, avatar: datareq.image });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Đã có lỗi xảy ra!", status: false });
    });
};
exports.updateUserName = async (req, res) => {
  const datareq = {
    name: req.body.name,
    phone: req.body.phone,
  };

  db.collection("users")
    .doc(datareq.phone)
    .update({
      username: datareq.name,
    })
    .then(() => {
      return res.json({ status: true, value: datareq.name });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(400)
        .json({ error: "Đã có lỗi xảy ra!", status: false });
    });
};



// Keyer

exports.loginKeyer = async (request, response) => {
  const userrequest = {
    phone: request.body.phone,
    password: request.body.password,
  };

  console.log(userrequest)
  const { valid, errors } = validateLoginData(userrequest);
  if (!valid) return response.status(400).json(errors);

  db.collection("Keyer")
    .where("phone", "==", userrequest.phone)
    .get()
    .then((data) => {
      if(!data.empty){
        data.forEach((doc) => {
          let userInfor = { ...doc.data() };
          if (userInfor.email !== "") {
            signInWithEmailAndPassword(
              auth,
              userInfor.email,
              userrequest.password
            ).then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                return response.json({ user: userInfor, status: true });
                // ...
              })
              .catch((error) => {
                console.error(error);
                return response.status(403).json({
                  error: "Đã xảy ra lỗi , vui lòng thử lại",
                  status: false,
                });
              });
          } else {
            return response.status(500).json({
              error: "Đã xảy ra lỗi , vui lòng thử lại",
              status: false,
            });
          }
        });
      }
      else{
        
        return response.status(500).json({ error: "Đã có lỗi", status: false });
      }
     
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: "Đã có lỗi", status: false });
    });
};
