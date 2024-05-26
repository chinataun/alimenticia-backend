const { db } = require('../config');
const bcrypt = require('bcrypt');
/**Metodo para realizar el registro de un Usuario */

/* const registrarUsuario = (nombre, email, contrasena, apodo, imagen, callback) => {
  // Generar un salt (valor aleatorio) para el hash
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error('Error al generar salt:', err);
      return callback('Error al crear usuario', null);
    }

    // Usar el salt para generar el hash de la contraseña
    bcrypt.hash(contrasena, salt, (hashErr, hash) => {
      if (hashErr) {
        console.error('Error al generar hash de contraseña:', hashErr);
        return callback('Error al crear usuario', null);
      }

      // Ahora, 'hash' contiene la contraseña encriptada
      const sql = 'INSERT INTO usuarios (nombre, email, contrasena, apodo, imagen) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [nombre, email, hash, apodo, imagen], (dbErr, result) => {
        if (dbErr) {
          console.error('Error al crear usuario:', dbErr);
          callback('Error al crear usuario', null);
        } else {
          callback(null, 'Usuario registrado exitosamente');
        }
      });
    });
  });
};
 */
const consultarExistenciaApodoEmail = (apodo, email, callback) => {
  const sqlCheckApodo = 'SELECT COUNT(*) as apodoCount FROM usuarios WHERE apodo = ?';
  const sqlCheckEmail = 'SELECT COUNT(*) as emailCount FROM usuarios WHERE email = ?';

  db.query(sqlCheckApodo, [apodo], (errApodo, resultApodo) => {
    if (errApodo) {
      return callback(errApodo, null);
    }

    db.query(sqlCheckEmail, [email], (errEmail, resultEmail) => {
      if (errEmail) {
        return callback(errEmail, null);
      }

      const counts = {
        apodoCount: resultApodo[0].apodoCount,
        emailCount: resultEmail[0].emailCount,
      };

      callback(null, counts);
    });
  });
};


const findByEmail = (email, callback) => {
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], (err, rows) => {
    if (err) {
      console.error('Error al buscar usuario por email:', err);
      callback('Error al buscar usuario por email', null);
    } else {
      callback(null, rows);
    }
  });
};

const obtenerRutaImagenUsuario = (userId, callback) => {
  const query = 'SELECT imagen FROM usuarios WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener la ruta de la imagen del usuario:', err);
      callback(err, null);
    } else {
      if (results.length === 0) {
        callback('Usuario no encontrado', null);
      } else {
        const rutaImagen = results[0].imagen;
        callback(null, rutaImagen);
      }
    }
  });
};

const compararContrasena = (contrasena, hash, callback) => {
  bcrypt.compare(contrasena, hash, (compareErr, match) => {
    if (compareErr) {
      callback(compareErr, null);
    } else {
      callback(null, match);
    }
  });
};

const obtenerInformacionUsuario = (userId, callback) => {
  const query = 'SELECT * FROM usuarios WHERE id = ?';
  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error('Error al obtener información del usuario:', err);
      callback('Error al obtener información del usuario', null);
    } else {
      callback(null, rows[0]);
    }
  });
};


const agregarRecetaFavorita = (usuarioId, recetaId, callback) => {
  const sql = 'INSERT IGNORE INTO recetas_favoritas (usuario_id, id_receta) VALUES (?, ?)';
  db.query(sql, [usuarioId, recetaId], (error, resultado) => {
    if (error) {
      console.error('Error al agregar receta a favoritos:', error);
      callback('Error al agregar receta a favoritos', null);
    } else {
      if (resultado.affectedRows === 0) {
        callback(null, 'La receta ya está en favoritos');
      } else {
        callback(null, 'Receta agregada a favoritos exitosamente');
      }
    }
  });
};


const obtenerRecetasFavoritas = (usuarioId, callback) => {
  const sql = 'SELECT recetas2023.titulo FROM recetas_favoritas ' +
              'INNER JOIN recetas2023 ON recetas_favoritas.id_receta = recetas2023.id_receta ' +
              'WHERE recetas_favoritas.usuario_id = ?';

  db.query(sql, [usuarioId], (err, rows) => {
    if (err) {
      console.error('Error al obtener recetas favoritas:', err);
      callback('Error al obtener recetas favoritas', null);
    } else {
      callback(null, rows);
    }
  });
};

const obtenerRecetaFavorita = (usuarioId, recetaId, callback) => {
  const sql = 'SELECT recetas.id ' + // Agrega un espacio en blanco después de 'id'
  'FROM recetas_favoritas ' +
  'INNER JOIN recetas ON recetas_favoritas.receta_id = recetas.id ' +
  'WHERE recetas_favoritas.usuario_id = ? AND recetas_favoritas.id_receta = ?';

  db.query(sql, [usuarioId, recetaId], (err, rows) => {
    if (err) {
      console.error('Error al obtener receta favorita:', err);
      callback('Error al obtener receta favorita', null);
    } else if (rows.length === 0) {
      callback(null, 'La receta no está en favoritos');
    } else {
      const receta = rows[0]; // Obtiene la primera fila (debería haber una sola receta)
      callback(null, receta);
    }
  });
};

const guardarCalculadoraCalorias=(datosCalculadora) => {
  const { sexo, edad, peso, altura, actividad_fisica } = datosCalculadora;

  const sql = 'INSERT INTO calculadora_calorias (sexo, edad, peso, altura, actividad_fisica) VALUES (?, ?, ?, ?, ?)';
  
  return new Promise((resolve, reject) => {
    connection.execute(sql, [sexo, edad, peso, altura, actividad_fisica], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
}


//guarda las calorias del usuario registrado

const guardarCaloriasUsuario = (usuarioId, calculadoraCaloriasId, caloriasRecomendadas) => {
  const sql = 'INSERT INTO calorias_usuario (usuario_id, calculadora_calorias_id, calorias_recomendadas) VALUES (?, ?, ?)';
  
  return new Promise((resolve, reject) => {
    connection.execute(sql, [usuarioId, calculadoraCaloriasId, caloriasRecomendadas], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
}

module.exports = {
 // registrarUsuario,
  consultarExistenciaApodoEmail,
  findByEmail,
  compararContrasena,
  obtenerRutaImagenUsuario,
  obtenerInformacionUsuario,
  obtenerRecetasFavoritas,
  agregarRecetaFavorita,
  obtenerRecetaFavorita,
  guardarCaloriasUsuario,
  guardarCalculadoraCalorias
};
