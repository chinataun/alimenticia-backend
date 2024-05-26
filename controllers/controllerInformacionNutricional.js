// controllers/informacionNutricionalController.js
const InformacionNutricional = require('../models/modelInformacionNutricional');

// Obtener todos los alimentos
const obtenerTodosLosAlimentos = async (req, res) => {
  try {
    const alimentos = await InformacionNutricional.getAllAlimentos();
    res.json(alimentos);
  } catch (error) {
    console.error('Error al obtener alimentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Buscar alimentos por nombre
const buscarAlimentos = async (req, res) => {
  const { nombre } = req.query; // Change from req.params to req.query

  try {
    const alimentosEncontrados = await InformacionNutricional.searchAlimentos(nombre);
    res.json(alimentosEncontrados);
  } catch (error) {
    console.error('Error al buscar alimentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { obtenerTodosLosAlimentos, buscarAlimentos };
