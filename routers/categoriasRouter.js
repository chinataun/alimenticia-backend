const express = require('express');
const router = express.Router();
const passport = require("passport");
const { getCategoriasAlimento } = require('../controllers/categoriaAlimento');
const { getCategoriasReceta } = require('../controllers/categoriaReceta');

router.get('/recetas', getCategoriasReceta);
router.get('/alimentos', getCategoriasAlimento);

module.exports = router;