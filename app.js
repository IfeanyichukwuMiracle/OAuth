const express = require("express");
const mongoose = require("mongoose");
const UserRoute = require("./routes/auth");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const app = express();
start();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", UserRoute);

// Routes
app.get("/", (req, res) => {
  return res.render("home.ejs");
});
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("dashboard.ejs", { username: req.user.username });
  }
  return res.redirect("/auth/login");
});
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.redirect("/");
  });
});

app.all("*", (req, res) => {
  return res.send("<p>Nothing Here</p><a href='/'>Go home</a>");
});
// start server
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(process.env.PORT || 5002, () => console.log(`App Started!`));
  } catch (error) {
    return console.log(error);
  }
}
