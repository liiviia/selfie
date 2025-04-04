const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const User = require('../models/User');

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
         const user = await User.findOne({ username });
         if(!user ) {
          return done(null, false, { message: "username o password non corretti" });
         }
  
         const isValidPassword = await bcrypt.compare(password, user.password);
         if(!isValidPassword) {
          return done(null, false, {message: "username o password non corretti"});
         }
  
         return done(null,user);
      } catch(err) {
        return done(err);
      }
    })
);
  
  
passport.serializeUser((user, done) => {
    done(null, user._id); 
});
  
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user); 
    } catch (err) {
      done(err); 
    }
});


module.exports = passport;