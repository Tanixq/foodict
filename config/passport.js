const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne(
        {
          email: email,
        },
        (err, user) => {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, {
              message: "Email already Exist ! Please Login",
            });
          }

          var newUser = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            email: email,
            phone_number: req.body.phone_number,
          });

          newUser.password = newUser.encryptPassword(password);

          // saving new user in DB
          newUser.save(function (err, result) {
            if (err) {
              console.log(err);
              return done(err);
            } else {
              return done(null, newUser);
            }
          });
        }
      );
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne(
        {
          email: req.body.email,
        },
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: "Email not Exist ! Please Sign Up",
            });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: "Incorrect Password" });
          }
          if (user.validPassword(password)) {
            return done(null, user);
          }
        }
      );
    }
  )
);
