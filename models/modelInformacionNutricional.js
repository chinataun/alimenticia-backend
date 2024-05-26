const { db } = require('../config');

function getAllAlimentos() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM informacion_nutricional';

    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function searchAlimentos(nombre) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM informacion_nutricional WHERE 1 = 1';
    const queryParams = [];

    if (nombre) {
      query += ' AND nombre LIKE ?';
      queryParams.push(`%${nombre}%`);
    }

    console.log('Consulta SQL:', query);

    db.query(query, queryParams, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
    getAllAlimentos,
    searchAlimentos,
   
  };