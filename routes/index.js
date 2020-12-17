const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const passport = require("passport");
const Blog = require("../models/blog")
const getLoginController = require("../controllers/get/login");
const getSignupController = require("../controllers/get/signup");
// const postLoginController = require("../controllers/post/login");


router.get("/", isLoggedIn, (req, res, next) => {
  Blog.find({}, (err, result) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    }else{
      res.render("home", {blogs: result});
    }
  })
});

router.get("/login", notLoggedIn, getLoginController);
router.get("/user/profile", isLoggedIn, (req, res, next) => {

  User.findById(req.user.id, function (err, result) { 
          if (err) {
              console.log(err);
              res.redirect("/");
          }else{
              res.render('profile', {customer : result});
          }
   }); 
});
router.get("/sign-up", notLoggedIn, getSignupController );


router.post(
  "/login",
  notLoggedIn,
  passport.authenticate("local-login", {
    successRedirect: "/user/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);


router.post(
  "/sign-up",
  notLoggedIn,
  passport.authenticate("local-signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect("/");
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
