const {db} = require("../config"); // Ajusta la ruta según tu estructura
const bcrypt = require('bcrypt');
const bcryptjs = require("bcryptjs");


const findUserByEmail = (email) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
   
    return new Promise(((resolve, reject) => {
        try {
            console.log(email)
            db.query(query, email, function(error, rows) {
                    if (error) {
                        reject(error)
                    }                    
                    let user = rows[0];
                    resolve(user);
                })
        } catch (error) {
            
            reject(error)
        }
    }));
};

/*
const comparePasswordUser = (user, password) => {
    console.log(user.contrasena)
    console.log(password)
    return new Promise(((resolve, reject) => {
        try {
           let isMatch =  bcrypt.compare(password, user.contrasena);
           let po = compararContrasena(password, user.contrasena, (compareErr, match) => {
            if (compareErr) {
              return res.status(500).json({ mensaje: 'Error al comparar contraseñas' });
            }
      
            if (match) {
              // Inicio de sesión exitoso
              req.session.userId = usuario.id;
              return res.status(200).cookie('sessionCookieName', req.session.userId, { maxAge: 3600000 })
                .json({ mensaje: 'Inicio de sesión exitoso', userId: usuario.id });
            } else {
              // Contraseña incorrecta
              return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
            }
          });
          )
           console.log(po)
           if (isMatch) {
               resolve(true)
           }
           reject("The password that you´ve entered is incorrect");
        } catch (error) {
            reject(error)
        }
    }))
};
*/

const findUserById = (id) => {
    const query = 'SELECT * FROM usuarios WHERE id = ?';
   return new Promise(((resolve, reject) => {
       try {
           db.query(query, id, function(error, rows) {
                if (error) {
                    reject(error)
                }
                let user = rows[0];
                resolve(user);
            })
       } catch (error) {
           reject(error)
       }
   }));
};
  
module.exports = {
    findUserByEmail,
    findUserById
  };