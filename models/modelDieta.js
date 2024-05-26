// models/dieta.js
const { db } = require('../config');

const Dieta = {
  crearDieta: async function (id_semana, fecha) {
      return new Promise((resolve, reject) => {
          const query = 'INSERT INTO Dietas (id_semana, fecha) VALUES (?, ?)';
          db.query(query, [id_semana, fecha], (error, result) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(result.insertId);
              }
          });
      });
  },

  agregarAlimentoSaludable: async function (id_dieta, id_comida_al_dia, id_alimento) {
      return new Promise((resolve, reject) => {
          const query = 'INSERT INTO AlimentosEnDieta (id_dieta, id_comida_al_dia, id_alimento) VALUES (?, ?, ?)';
          db.query(query, [id_dieta, id_comida_al_dia, id_alimento], (error, result) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(result.insertId);
              }
          });
      });
  },

  obtenerResultadosDieta: async function (id_dieta) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                DS.nombre_dia AS dia,
                DATE_FORMAT(D.fecha, '%Y-%m-%d') AS fecha,
                CA.nombre_comida AS comida,
                ASL.nombre_alimento AS alimento
            FROM Dietas D
            JOIN DiasSemanales DS ON D.id_semana = DS.id_dia
            JOIN AlimentosEnDieta AED ON D.id_dieta = AED.id_dieta
            JOIN ComidasAlDia CA ON AED.id_comida_al_dia = CA.id_comida
            JOIN AlimentosSaludables ASL ON AED.id_alimento = ASL.id_alimento
            WHERE D.id_dieta = ?;
        `;
        db.query(query, [id_dieta], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}
};
//metiodo para ir añadiiento alimentos al desayuno cena etc antes de guardar como tal la receta ya que coge la fecha para saber el dia
const ComidaAlDiaAlimento = {
    agregarComidaAlDiaAlimento: async function (id_semana, id_comida_al_dia, id_alimento, cantidad) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO ComidasAlDiaAlimentos (id_semana, id_comida_al_dia, id_alimento, cantidad) VALUES (?, ?, ?, ?)';
            db.query(query, [id_semana, id_comida_al_dia, id_alimento, cantidad], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.insertId);
                }
            });
        });
    },
    // Otros métodos según sea necesario
};
//Se guarda la fecha actual del dia, tabla que se relaciona con comidasAlDiaAliemtos, para saber en que dia se metio ese alimento
const DiaSemanalFecha = {
    agregarDiaSemanalFecha: async function (id_dia_semanal, fecha) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO DiasSemanalesFechas (id_dia_semanal, fecha) VALUES (?, ?)';
            db.query(query, [id_dia_semanal, fecha], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.insertId);
                }
            });
        });
    },
    // Otros métodos según sea necesario
};
const DiasSemanalesModel = {
    obtenerDiasSemanalesOrdenados: async function () {
        return new Promise((resolve, reject) => {
          // Obtener el número del día actual (0 para Domingo, 1 para Lunes, ..., 6 para Sábado)
          const diaActual = new Date().getDay()-1;
    
          // Ajustar la consulta para obtener los días ordenados
          const query = 'SELECT * FROM diassemanales ORDER BY CASE WHEN id_dia >= ? THEN 0 ELSE 1 END, id_dia';
          db.query(query, [diaActual + 1], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });
      },
    // Otros métodos según sea necesario
  };
  const ComidasAlDiaModel = {
    obtenerComidasAlDia: async function () {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM comidasaldia';
        db.query(query, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    },
    // Otros métodos según sea necesario
  };
  const AlimentosSaludablesModel = {
    obtenerAlimentosSaludables: async function () {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM alimentossaludables';
        db.query(query, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    },
    obtenerAlimentoPorNombre: async function (nombre) {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM alimentossaludables WHERE nombre_alimento = ?';
          db.query(query, [nombre], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results.length > 0 ? results[0] : null);
            }
          });
        });
      },
      // Otros métodos según sea necesario
    };
    
 
module.exports={Dieta,ComidaAlDiaAlimento,DiasSemanalesModel,ComidasAlDiaModel,AlimentosSaludablesModel}
