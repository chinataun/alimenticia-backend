const { db } = require('../config');
const util = require('util');
const ListCompra = {};

ListCompra.create = async (usuario_id, producto_id, cantidad) => {
    try {
      const [results] = await db.promise().execute(
        'INSERT INTO listas_compra (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [usuario_id, producto_id, cantidad]
      );
  
      return results.insertId;
    } catch (error) {
      console.error('Error al insertar en la base de datos:', error);
      throw new Error('Error al crear la lista de compra.');
    }
  };

  ListCompra.getAllByUserId = async (usuario_id) => {
    try {
      let query;
      let params;
  
      if (usuario_id === null) {
        // Usuario no registrado
        query = 'SELECT lc.*, ps.nombre, ps.precioNormal FROM listas_compra lc JOIN productos_supermercado ps ON lc.producto_id = ps.id WHERE lc.usuario_id IS NULL';
        params = [];
      } else {
        // Usuario registrado
        query = 'SELECT lc.*, ps.nombre, ps.precioNormal FROM listas_compra lc JOIN productos_supermercado ps ON lc.producto_id = ps.id WHERE lc.usuario_id = ?';
        params = [usuario_id];
      }
  
      const [results] = await db.query(query, params);
      return results;
    } catch (error) {
      throw error;
    }
  };
  



  ListCompra.lista = async (usuario_id, supermercado, productos, totalCompra) => {
    try {
      // Verifica que los parámetros no sean undefined
      if (usuario_id === undefined || supermercado === undefined || productos === undefined || totalCompra === undefined) {
        console.error('Error: Los parámetros no pueden ser undefined.', { usuario_id, lista_compra, supermercado, productos, totalCompra });
        throw new Error('Los parámetros no pueden ser undefined.');
      }
  
      console.log('Parámetros:', { usuario_id, supermercado, productos, totalCompra });
  
      const [results] = await db.promise().execute(
        'INSERT INTO lista_compra_usuarios (usuario_id, supermercado, productos, totalCompra) VALUES (?, ?, ?, ?)',
        [usuario_id, supermercado, JSON.stringify(productos), totalCompra]
      );
  
      return results.insertId;
    } catch (error) {
      console.error('Error al insertar en la base de datos:', error);
      throw new Error('Error al crear la lista de compra para usuarios.');
    }
  };
  
  ListCompra.obtnerListasCompra = async (usuarioId) => {
    try {
      const query = util.promisify(db.query).bind(db); // Promisificar la función de consulta
  
      const result = await query(
        'SELECT * FROM lista_compra_usuarios WHERE usuario_id = ?',
        [usuarioId]
      );
  
      // Parsea el campo productos a un objeto JSON
      const listas = result.map(row => {
        return {
          ...row,
          productos: JSON.parse(row.productos || '[]'), // Parsea el campo productos
        };
      });
  
      return listas || [];
    } catch (error) {
      console.error('Error al obtener listas de compra:', error);
      throw error;
    }
  };
  
  // modelListaCompra.js

// ...


  // ...
  
module.exports = ListCompra;
