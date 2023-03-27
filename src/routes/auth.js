
const express = require("express")
const router = express.Router()

// const {   signUpUser, loginUser, logOutUser, updateAvatarUser, updateUserName, sendOTPVerify, VerifyOTP, loginKeyer } = require('../controllers/userController');

const UserController = require("../controllers/userController")

router.get("/", (req, res) => {
    res.send('API')
} )
router.post("/signup",UserController.signUpUser);
router.post("/login", UserController.loginUser);
router.post("/logout", UserController.logOutUser);
router.post("/updateavatar",UserController.updateAvatarUser);
router.post("/updatename", UserController.updateUserName);
router.post("/sendOTP", UserController.sendOTPVerify);
router.post("/verifyOTP", UserController.VerifyOTP);

//  keyer handel
router.post("/loginkeyer", UserController.loginKeyer);


module.exports = router;