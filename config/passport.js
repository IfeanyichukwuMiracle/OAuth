const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../schema/user");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

passport.use(
  new LocalStrategy(async (username, pwd, cb) => {
    const user = await User.findOne({ username });

    if (!user) return cb(null, false);
    else {
      const password = user.password;
      bcrypt.compare(pwd, password, (err, isPwd) => {
        if (err) console.log(err);

        if (isPwd) return cb(null, user);

        return cb(null, false);
      });
    }
  }),
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/secrets",
    },
    async function (accessToken, refreshToken, profile, cb) {
      // console.log(profile);

      const user = await User.findOne({ googleId: profile.id });
      if (!user) {
        const newUser = await User.create({
          googleId: profile.id,
          username: profile.displayName,
        });
        return cb(null, newUser);
      }

      return cb(null, user);
    },
  ),
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});
