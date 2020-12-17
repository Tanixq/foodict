require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const db = require("./config/config");
const Routes = require("./routes/index");
const models = require("./models/user")
const flash = require('connect-flash');
const session = require("express-session")
var MongoStore = require('connect-mongo')(session);


const app = express();
// app.use(flash());

// Making static folder 
app.use(express.static('public'));

// Set view engine to ejs 
app.set('view engine', 'ejs');


app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.use(passport.session());



// database connection
mongoose.Promise = global.Promise;
mongoose.connect(
  db.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.log(err);
    console.log("database is connected");
  }
);
require('./config/passport');


app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//Route handler
app.use("/", Routes);

//The 404 Route
app.get("*", (req, res) => {
  res
    .status(404)
    .send("Looking for something that is not here. Check URL or Method");
});

// listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});