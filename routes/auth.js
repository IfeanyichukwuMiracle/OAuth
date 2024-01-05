const express = require("express");
const router = express.Router();
const User = require("../schema/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
require("../config/passport");

// Routes
router.get("/login", (req, res) => {
  return res.render("login.ejs");
});
router.get("/register", (req, res) => {
  return res.render("register.ejs");
});
router.post("/register", (req, res) => {
  const { username, password, email } = req.body;
  if (username && password && email) {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) return console.log(err);
      await User.create({ username, password: hash, email });
      return res.redirect("/auth/login");
    });
  } else {
    console.log(`Enter details!`);
  }
  return;
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    successRedirect: "/dashboard",
  })(req, res, next);
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    return res.redirect("/dashboard");
  },
);

module.exports = router;
