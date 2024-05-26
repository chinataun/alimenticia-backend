const { CategoriaAlimento } = require('../models/index');

const getCategoriasAlimento = async (req, res) => {
  try {
    const categorias = await CategoriaAlimento.findAll();
    res.json(categorias);
  } catch (error) { 
    res.status(500).json({ message: 'Error en el servidor' });
  }

};

module.exports = {
  getCategoriasAlimento,
};
  