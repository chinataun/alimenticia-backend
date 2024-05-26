const express = require('express');
const router = express.Router();
const productosController = require('../controllers/ApiFoodsController');

router.get('/', productosController.getProductosApi);

module.exports = router;
