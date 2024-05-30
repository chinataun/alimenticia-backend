const { CategoriaReceta } = require('../models/index');

const getCategoriasReceta = async (req, res) => {
  try {
    const categorias = await CategoriaReceta.findAll();
    res.json(categorias);
  } catch (error) { 
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
    getCategoriasReceta,
};
  