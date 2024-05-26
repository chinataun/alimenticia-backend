const  { Strategy } = require("passport-local")
const  Usuario = require ("../models/modelUsuario")
// passport-config.js
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const bcryptjs = require("bcryptjs");
const {db} = require("../config"); // Ajusta la ruta según tu estructura
const { findUserByEmail, findUserById, comparePasswordUser } = require('../services/loginService')

const User = require('../models/user');

const { compararContrasena } = require('../models/modelUsuario')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password', // Campo del formulario que contiene el email
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

   /* db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
      if (err) return done(err);
      if (!results.length) return done(null, false, { message: "Usuario no encontrado" });

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) return done(null, user);
        return done(null, false, { message: "Contraseña incorrecta" });
      });
    });*/
  })
);
// Define una función asíncrona que maneje la autenticación
/*
passport.use(
  new LocalStrategy(    {
    usernameField: 'email',
    passwordField: 'contrasena', // Campo del formulario que contiene el email
    passReqToCallback: true
  },
  async (email, password, done) => {
    try {
      // Realiza la consulta a la base de datos de forma asíncrona utilizando db
      const [rows, fields] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);

      // Verifica si se encontró un usuario con el correo electrónico dado
      if (!rows || rows.length === 0) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      console.log(email)
      console.log(password)
      console.log(rows)
      console.log(fields)
      // Verifica la contraseña utilizando bcrypt
      const isMatch = await bcryptjs.compare(password, rows[0].password);
      if (!isMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      // Si todo está bien, devuelve el usuario autenticado
      return done(null, rows[0]);
    } catch (error) {
      // Si ocurre algún error, devuelve el error
      return done(error);
    }
  })
);
*/

// Configura la estrategia de autenticación local
/*passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'contrasena' // Campo del formulario que contiene el email
    },
    async (email, password, done) => {
      try {
        
        // Busca al usuario en la base de datos por email
        const user = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        console.log(user)
        if (!user.length) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Compara las contraseñas
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (isMatch) {
          return done(null, user[0]);
        } else {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
      } catch (err) {
        console.log('pedo')
        return done(err);
      }
    }
  )
);
*/
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
