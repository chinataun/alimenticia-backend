
const bcrypt = require('bcrypt');

const compararContrasena = (contrasena, hash, callback) => {
    bcrypt.compare(contrasena, hash, (compareErr, match) => {
      if (compareErr) {
        callback(compareErr, null);
      } else {
        callback(null, match);
      }
    });
  };

  
module.exports = {
    compararContrasena
  };