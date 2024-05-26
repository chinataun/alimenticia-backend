const { db } = require('../config');

// Función para obtener todos los meses
const obtenerTodosLosMeses = (callback) => {
    const sql = 'SELECT nombre FROM nombre_mes';
  
    db.query(sql, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
                // Crear un objeto de fecha
    var fecha = new Date();
    let meses = [];

    // Iterar sobre los meses del año
    for (var i = 0; i < 12; i++) {
    fecha.setMonth(i);
    meses.push(fecha.toLocaleString('es-ES', { month: 'long' }));
    //console.log(fecha.toLocaleString('es-ES', { month: 'long' }));
    }
        //const meses = results.map((row) => row.nombre);
        callback(null, meses);
      }
    });

};

// Función para obtener todas las categorías
const obtenerTodasLasCategorias = (callback) => {
    const sql = 'SELECT nombre_categoria FROM nombre_categoria_mes';
  
    db.query(sql, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const categorias = results.map((row) => row.nombre_categoria);
        callback(null, categorias);
      }
    });
};

/*Mapear el nombre del mes*/
const obtenerIdMesPorNombre = (nombreMes, callback) => {
  db.query('SELECT id FROM nombre_mes WHERE nombre = ?', [nombreMes], (error, results) => {
      if (error) {
          callback(error, null);
      } else {
          if (results.length === 0) {
              callback(null, null);
          } else {
              callback(null, results[0].id);
          }
      }
  });
};
/*Mapear el nombre de la categoria*/
const obtenerIdCategoriaPorNombre = (nombreCategoria, callback) => {
  db.query('SELECT id FROM nombre_categoria_mes WHERE nombre_categoria = ?', [nombreCategoria], (error, results) => {
      if (error) {
          callback(error, null);
      } else {
          if (results.length === 0) {
              callback(null, null);
          } else {
              callback(null, results[0].id);
          }
      }
  });
};

// ...

// Función para obtener alimentos por mes y categoría
const obtenerAlimentosPorMesYCategoria = (nombreMes, nombreCategoria, callback) => {
  obtenerIdMesPorNombre(nombreMes, (errorMes, idMes) => {
      if (errorMes) {
          callback(errorMes, null);
      } else {
          obtenerIdCategoriaPorNombre(nombreCategoria, (errorCategoria, idCategoria) => {
              if (errorCategoria) {
                  callback(errorCategoria, null);
              } else {
                  const query = `
                      SELECT f.nombre, f.imagen
                      FROM alimentos_mes am
                      JOIN meses m ON am.mes_id = m.id
                      JOIN foods f ON am.food_id = f.id
                      WHERE m.id_nombre_mes = ? AND m.id_nombre_categoria_mes = ?;
                  `;

                  db.query(query, [idMes, idCategoria], (err, results) => {
                      if (err) {
                          callback(err, null);
                      } else {
                          callback(null, results);
                      }
                  });
              }
          });
      }
  });
};

// Función para obtener detalles del alimento por mes, categoría y nombre
const obtenerDetallesAlimento = (nombreMes, nombreCategoria, nombreAlimento, callback) => {
    obtenerIdMesPorNombre(nombreMes, (errorMes, idMes) => {
        if (errorMes) {
            callback(errorMes, null);
        } else {
            obtenerIdCategoriaPorNombre(nombreCategoria, (errorCategoria, idCategoria) => {
                if (errorCategoria) {
                    callback(errorCategoria, null);
                } else {
                    const sql = `
                        SELECT f.nombre, f.imagen, f.imagen_banner, f.descripcion, f.calorias, f.grasas, f.carbohidratos, f.proteinas,
                        GROUP_CONCAT(DISTINCT al.metodo SEPARATOR '|||') AS metodos_almacenaje,
                        GROUP_CONCAT(DISTINCT al.duracion SEPARATOR '|||') AS duraciones_almacenaje,
                        GROUP_CONCAT(DISTINCT b.beneficio SEPARATOR '|||') AS beneficios,
                        GROUP_CONCAT(DISTINCT s.seleccion SEPARATOR '|||') AS selecciones
                        FROM alimentos_mes am
                        INNER JOIN meses m ON am.mes_id = m.id
                        INNER JOIN foods f ON am.food_id = f.id
                        LEFT JOIN almacenaje al ON f.id = al.food_id
                        LEFT JOIN beneficios b ON f.id = b.food_id
                        LEFT JOIN seleccion s ON f.id = s.food_id
                        WHERE m.id_nombre_mes = ? AND m.id_nombre_categoria_mes = ? AND f.nombre = ?
                    `;
  
                    db.query(sql, [idMes, idCategoria, nombreAlimento], (error, results) => {
                        if (error) {
                            console.error("Error en la consulta SQL:", error);
                            callback(error, null);
                        } else {
                            console.log("Resultados de la consulta:", results);
                            if (results.length === 0) {
                                console.log("No se encontraron detalles para el alimento:", nombreAlimento);
                                callback(null, null);
                            } else {
                                // Divide las cadenas en arrays si están definidas
                                const detalles = results[0];
                                detalles.metodos_almacenaje = detalles.metodos_almacenaje ? detalles.metodos_almacenaje.split('|||') : [];
                                detalles.duraciones_almacenaje = detalles.duraciones_almacenaje ? detalles.duraciones_almacenaje.split('|||') : [];
                                detalles.beneficios = detalles.beneficios ? detalles.beneficios.split('|||') : [];
                                detalles.selecciones = detalles.selecciones ? detalles.selecciones.split('|||') : [];
                                
                                // Agregar imagen_banner al objeto de detalles
                                detalles.imagen_banner = results[0].imagen_banner;
                                
                                callback(null, detalles);
                            }
                        }
                    });
                }
            });
        }
    });
};



// Función para obtener categorías por mes


module.exports = {
  obtenerTodosLosMeses,
  obtenerTodasLasCategorias,
  obtenerAlimentosPorMesYCategoria,
  obtenerDetallesAlimento,
};