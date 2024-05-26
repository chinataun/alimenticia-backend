// models/modelRecetas.js
const { db } = require('../config');
const path = require('path');
async function buscarProductosPorMarcaYNombre(marca, nombrealimento) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM productos_supermercado WHERE 1 = 1'; // Consulta base
      const queryParams = [];
  
  
      // Si se proporciona tipo_plato, agrega la condición de filtrado por tipo de plato
      if (marca) {
        query += ' AND marca = ?';
        queryParams.push(marca);
      }
  
      // Si se proporciona un nombre, agrega la condición de búsqueda por nombre
      if (nombrealimento) {
        const palabrasClave = nombrealimento.split(' ');
        query += ' AND (';
  
        // Agrega condiciones para cada palabra clave
        palabrasClave.forEach((palabra, index) => {
          query += index > 0 ? ' OR ' : ''; // Añade 'OR' después de la primera palabra clave
          query += 'nombre LIKE ? OR marca LIKE ?';
          queryParams.push(`%${palabra}%`, `%${palabra}%`);
        });
  
        query += ')';
      }
      console.log('Consulta SQL:', query); // Agregamos un registro de consola
  
      db.query(query, queryParams, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Archivo: models.js



// Modelo de Receta
const Receta = {
  crearReceta: async function (titulo, descripcion, supermercado, imagen, id_categoria, comensales,tiempo,id_usuario,id_dificultad) {
    return new Promise((resolve, reject) => {
        
        const query = 'INSERT INTO recetas2023 (titulo, descripcion, supermercado, imagen, id_categoria, comensales,tiempo,id_usuario,id_dificultad) VALUES (?, ?, ?, ?,?, ?, ?,?,?)';
        db.query(query, [titulo, descripcion, supermercado, imagen, id_categoria, comensales,tiempo,id_usuario,id_dificultad], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.insertId);
            }
        });
    });
},

  obtenerRecetaPorId: async function (idReceta) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM recetas2023 WHERE id_receta = ?';
      db.query(query, [idReceta], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  },


  getRecetaImage: async function (recetaId) {
    try {
        const [rows] = await db.promise().query("SELECT imagen FROM recetas2023 WHERE id_receta = ?", [recetaId]);

        if (rows.length === 0) {
            return null; // No se encontró la imagen de la receta
        } else {
            return rows[0].imagen; // Devuelve el nombre de la imagen de la receta
        }
    } catch (err) {
        throw new Error("Error al acceder a la base de datos: " + err.message);
    }
},
 getRecetasByUsuario: async function(id_usuario) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM recetas2023 WHERE id_usuario = ?';
    db.query(query, [id_usuario], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

};

// Modelo de Ingrediente
// Modelo de Ingrediente
const Ingrediente = {
  agregarIngrediente: async function (idReceta, nombreIngrediente, cantidad, idUnidad) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO ingredientes2023 (id_receta, nombre_ingrediente, cantidad, id_unidad_medicion) VALUES (?, ?, ?, ?)';
      db.query(query, [idReceta, nombreIngrediente, cantidad, idUnidad], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.insertId);
        }
      });
    });
  },
  obtenerIngredientesPorReceta: async function (idReceta) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM ingredientes2023 WHERE id_receta = ?';
      db.query(query, [idReceta], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
};


async function obtenerTodasLasRecetas() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM recetas2023';
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });


  
}

const Categoria = {
  obtenerCategorias: async function () {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM categoriasrecetas';
      db.query(query, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // Resuelve un arreglo de objetos con id y nombre de cada categoría
          const categorias = result.map(row => ({ id: row.id_categoria, nombre: row.nombre }));
          resolve(categorias);
        }
      });
    });
  },
};

const Dificultad = {
  obtenerDificultades: async function () {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM dificultad_recetas';
      db.query(query, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // Resuelve un arreglo de objetos con id y nombre de cada dificultad
          const dificultades = result.map(row => ({ id: row.id_dificultad, nombre: row.nombre }));
          resolve(dificultades);
        }
      });
    });
  },
};


const UnidadMedida = {
  obtenerUnidadesMedida: async function () {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM unidades_medicion_recetas';
      db.query(query, (error, result) => {
        if (error) {
          reject(error);
        } else {
          // Resuelve un arreglo de objetos con id y nombre de cada unidad de medida
          const unidadesMedida = result.map(row => ({ id: row.id_unidad, nombre: row.nombre_unidad }));
          resolve(unidadesMedida);
        }
      });
    });
  },
};


const RecetaModel = {

  obtenerDetallesRecetaCompleta: (idReceta, callback) => {
    const sql = `
      SELECT 
        r.id_receta, r.titulo, r.descripcion, r.supermercado, r.imagen, r.comensales,
        i.nombre_ingrediente, i.cantidad, u.nombre_unidad,
        p.titulo_paso AS titulo_paso, p.descripcion_paso AS descripcion_paso,
        c.nombre AS nombre_categoria
      FROM recetas2023 r
      JOIN ingredientes2023 i ON r.id_receta = i.id_receta
      LEFT JOIN unidades_medicion_recetas u ON i.id_unidad_medicion = u.id_unidad
      LEFT JOIN pasos_recetas p ON r.id_receta = p.id_receta
      JOIN categoriasrecetas c ON r.id_categoria = c.id_categoria
      WHERE r.id_receta = ${idReceta};
    `;
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error al obtener los detalles completos de la receta:', err);
        callback(err, null);
      } else {
        console.log('Resultados de la consulta:', result); // Agregado para depuración
  
        // Organizar la información en un objeto antes de llamar al callback
        const detallesReceta = {
          id_receta: result[0].id_receta,
          titulo: result[0].titulo,
          descripcion: result[0].descripcion,
          supermercado: result[0].supermercado,
          imagen: result[0].imagen,
          comensales: result[0].comensales,
          tiempo:result[0].tiempo,
          categoria: result[0].nombre_categoria,
          ingredientes: result.map((row) => ({
            nombre_ingrediente: row.nombre_ingrediente,
            cantidad: row.cantidad,
            unidad: row.nombre_unidad
          })),
          pasos: result.reduce((pasos, row) => {
            if (row.titulo_paso && row.descripcion_paso) {
              pasos.push({
                titulo_paso: row.titulo_paso,
                descripcion_paso: row.descripcion_paso
              });
            }
            return pasos;
          }, [])
        };
  
        callback(null, detallesReceta);
      }
    });
  }
  
}
const Paso = {
  agregarPaso: async function (idReceta, titulo, descripcion) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO pasos_recetas (id_receta, titulo_paso, descripcion_paso) VALUES (?, ?, ?)';
      db.query(query, [idReceta, titulo, descripcion], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.insertId);
        }
      });
    });
  },
  obtenerPasosPorReceta: async function (idReceta) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM pasos_recetas WHERE id_receta = ?';
      db.query(query, [idReceta], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};
const Voto = {
  verificarVotoUsuario: async function (idUsuario, idReceta) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM votos_recetas_usuarios WHERE id_usuario = ? AND id_receta = ?';
      db.query(query, [idUsuario, idReceta], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0);
        }
      });
    });
  },

  registrarVotoReceta: async function (idUsuario, idReceta, puntuacion, comentario) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO votos_recetas_usuarios (id_usuario, id_receta, puntuacion, comentario) VALUES (?, ?, ?, ?)';
      db.query(query, [idUsuario, idReceta, puntuacion, comentario], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  },
  

  actualizarVotoReceta: async function (idUsuario, idReceta, puntuacion) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE votos_recetas_usuarios SET puntuacion = ? WHERE id_usuario = ? AND id_receta = ?';
      db.query(query, [puntuacion, idUsuario, idReceta], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  },

  quitarVotoReceta: async function (idUsuario, idReceta) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM votos_recetas_usuarios WHERE id_usuario = ? AND id_receta = ?';
      db.query(query, [idUsuario, idReceta], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  },
  obtenerPuntuacionTotalReceta : async function (idReceta) {
    console.log(idReceta);
    return new Promise((resolve, reject) => {
      const query = 'SELECT SUM(puntuacion) as puntuacion_total FROM votos_recetas_usuarios WHERE id_receta = ?';
      db.query(query, [idReceta], (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Devuelve la puntuación total, que puede ser null si no hay votos
          resolve(results[0].puntuacion_total);
        }
      });
    });
 }
  



};
function searchRecetas(titulo, id_categoria, comensales) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM recetas2023 WHERE 1 = 1'; // Consulta base
    const queryParams = [];

    // Si se proporciona un título, agrega la condición de búsqueda por título
    if (titulo) {
      query += ' AND titulo LIKE ?';
      queryParams.push(`%${titulo}%`);
    }

    // Si se proporciona una categoría, agrega la condición de filtrado por categoría
    if (id_categoria) {
      query += ' AND id_categoria IN (SELECT id_categoria FROM categoriasrecetas WHERE nombre = ?)';
      queryParams.push(id_categoria);
    }

    // Si se proporciona la cantidad de comensales, agrega la condición de filtrado por comensales
    if (comensales) {
      query += ' AND comensales = ?';
      queryParams.push(comensales);
    }

    console.log('Consulta SQL:', query); // Agregamos un registro de consola

    db.query(query, queryParams, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


module.exports = { Receta, Ingrediente, buscarProductosPorMarcaYNombre, obtenerTodasLasRecetas, Categoria,Dificultad, searchRecetas, UnidadMedida, RecetaModel, Paso,Voto};


