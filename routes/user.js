const express = require("express");
const wrapAsync = require("../ErrorHandle/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const router = express.Router();
const UserController = require("../controllers/user.js");

router
  .route("/signup")
  .get(UserController.RenderSignUp) //Render SignUp
  .post(wrapAsync(UserController.SignUpRoute)); //Signup route

router
  .route("/login")
  .get(UserController.RenderLogin) //Render Login
  .post(
    saveRedirectUrl, //Login Route
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserController.LoginRoute
  );

//Logout Route
router.get("/logout", UserController.LogoutRoute);

module.exports = router;
