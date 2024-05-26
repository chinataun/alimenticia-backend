// routers/informacionNutricionalRouter.js
const express = require('express');
const router = express.Router();
const informacionNutricionalController = require('../controllers/controllerInformacionNutricional');

// Rutas
router.get('/', informacionNutricionalController.obtenerTodosLosAlimentos);
router.get('/buscar', informacionNutricionalController.buscarAlimentos);


module.exports = router;
