const { db } = require('../config');

 
//guarda los datos del usuario registrado

const guardarCalculadoraCalorias=(datosCalculadora) => {
    const { sexo, edad, peso, altura, actividad_fisica } = datosCalculadora;

    const sql = 'INSERT INTO calculadora_calorias (sexo, edad, peso, altura, actividad_fisica) VALUES (?, ?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
     db.execute(sql, [sexo, edad, peso, altura, actividad_fisica], (err, results) => {
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
      db.execute(sql, [usuarioId, calculadoraCaloriasId, caloriasRecomendadas], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }


  module.exports = {
    guardarCalculadoraCalorias,
    guardarCaloriasUsuario,
     // Añade la función calcularCalorias aquí
  };

