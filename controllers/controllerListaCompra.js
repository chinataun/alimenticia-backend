const ListCompra = require('../models/modelListaCompra');
const { db } = require('../config');
const ListCompraController = {};

ListCompraController.create = async (req, res) => {
    try {
      console.log('Solicitud recibida:', req.body);
  
      const listaCompras = Array.isArray(req.body) ? req.body : [req.body];
  
      const listaCompraIds = [];
      for (const { usuario_id, producto_id, cantidad } of listaCompras) {
        // Verifica que los datos requeridos estén presentes en cada solicitud
        if (producto_id === undefined || cantidad === undefined) {
          console.log('Error de validación:', { usuario_id, producto_id, cantidad });
          return res.status(400).json({ error: 'Los campos producto_id y cantidad son obligatorios.' });
        }
  
        // Usuario_id puede ser opcional
        const listaCompraId = await ListCompra.create(usuario_id || null, producto_id, cantidad);
        listaCompraIds.push(listaCompraId);
      }
  
      res.status(201).json({ ids: listaCompraIds, message: 'Lista de compras creada exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la lista de compra.' });
    }
  };
  
  


ListCompraController.getListComprasByUserId = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const listCompras = await ListCompra.getAllByUserId(usuario_id);

    res.status(200).json(listCompras);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las listas de compra.' });
  }
};

// Puedes agregar más funciones según tus necesidades



ListCompraController.lista = async (req, res) => {
  try {
      const { usuario_id, supermercado, productos, totalCompra } = req.body;

      const listaCompraUsuarioId = await ListCompra.lista(usuario_id, supermercado, productos, totalCompra);

      res.status(201).json({ id: listaCompraUsuarioId, message: 'Lista de compras de usuario creada exitosamente.' });
  } catch (error) {
      console.error('Error al crear la lista de compras para usuarios:', error);
      res.status(500).json({ error: 'Error al crear la lista de compras para usuarios.' });
  }
};

// Otros métodos si es necesario


ListCompraController.obtenerListaCompra = async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const listas = await ListCompra.obtnerListasCompra(usuarioId);

    if (listas.length > 0) {
      res.json(listas);
    } else {
      res.json([]); // Devuelve un array vacío si no hay listas asociadas al usuario
    }

  } catch (error) {
    console.error('Error al obtener listas de compra:', error);
    res.status(500).json({ error: 'Error al obtener listas de compra' });
  }
};



module.exports = ListCompraController;
