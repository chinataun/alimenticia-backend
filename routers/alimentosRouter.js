const express = require('express');
const router = express.Router();
const passport = require("passport");
const { getAlimento, getAlimentos, getBusquedaAlimento } = require('../controllers/alimento');
const { update } = require('../models/user');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('../utils/handleUpload')

router.get('/temporada', getAlimentos);
router.get('/:nombre', getAlimento);
router.get('/busqueda/:nombre', getBusquedaAlimento);

module.exports = router;