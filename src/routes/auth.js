
const express = require("express")
const router = express.Router()

const {   signUpUser, loginUser, logOutUser, updateAvatarUser, updateUserName, sendOTPVerify, VerifyOTP, loginKeyer } = require('../controllers/userController');



router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/updateavatar", updateAvatarUser);
router.post("/updatename", updateUserName);
router.post("/sendOTP", sendOTPVerify);
router.post("/verifyOTP", VerifyOTP);

//  keyer handel
router.post("/loginkeyer", loginKeyer);


module.exports = router;