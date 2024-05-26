// routes/dietaRoutes.js
const express = require('express');
const router = express.Router();
const dietaController = require('../controllers/controllerDieta');

 
  // Ruta para agregar una dieta
  router.post('/agregar-dieta',dietaController.crearDietaConAlimentos);
  router.get('/obtener_resultados_dieta/:id_dieta', dietaController.obtenerResultadosDieta);
  router.get('/dias-semanales', dietaController.obtenerDiasSemanalesOrdenados);
  router.get('/comidas-aldia', dietaController.obtenerComidasAlDia);
  router.get('/alimentos-saludables', dietaController.obtenerAlimentosSaludables);
  module.exports = router;