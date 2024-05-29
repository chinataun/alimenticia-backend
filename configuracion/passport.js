const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');
const { compararContrasena } = require('../services/loginService')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {      
      try {
        let user = await User.findOne({ where: { email: email } });
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }
        if (user) {
            compararContrasena(password, user.getDataValue('password'), (compareErr, match) => {
            if (compareErr) {
              return done(compareErr)            
            }      
            if (match) {
              return done(null, user, null); 
            } else {
              // Contraseña incorrecta
              return done(null, false, {message: "Contraseña incorrecta."})
            }
          });
        }
      } catch (error) {
        return done(error);
      }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  loginService.findUserById(id).then((user) => {
    return done(null, user)
  }).catch(error => {
    return done(error, null)
  });
});
