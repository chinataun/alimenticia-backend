const express = require('express');
const router = express.Router();
const seasonalFoodsController = require('../controllers/controllerAlimentoTemporada');
const {authenticate, authenticateToken} = require('../configuracion/cookieJwtAuth')

// Ruta para obtener los meses y sus categorías
//router.get('/months-and-categories', seasonalFoodsController.getMonthsAndCategories);
//router.get('/:month/:category', seasonalFoodsController.getFoodsByMonthAndCategory);

//router.get('/alimentoTemporada/:mes', seasonalFoodsController.obtenerMeses);
router.get('/alimentoTemporada/meses',authenticateToken, seasonalFoodsController.obtenerTodosLosMeses);
router.get('/alimentoTemporada/categorias' , seasonalFoodsController.obtenerTodasLasCategorias);
router.get('/alimentoTemporada/:mes/:categoria' ,authenticateToken, seasonalFoodsController.obtenerAlimentosPorMesYCategoria);
router.get('/alimentoTemporada/:mes/:categoria/:nombre' , seasonalFoodsController.obtenerDetallesAlimento);
// router.get('/alimentoTemporada/:mes', seasonalFoodsController.obtenerCategoriasPorMes);
// router.get('/alimentoTemporada/:mes/:categoria', seasonalFoodsController.obtenerAlimentosPorMesYCategoria);
// router.get('/alimentoTemporada/:mes/:categoria/:nombre', seasonalFoodsController.obtenerDetallesAlimento);
module.exports = router;