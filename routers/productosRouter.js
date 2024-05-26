const express = require('express');
const router = express.Router();
const passport = require("passport");
const { getProductosXTermino, getProductoSimilar, indexElastic } = require('../controllers/producto');
const { update } = require('../models/user');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = require('../utils/handleUpload')

router.get('/buscar/:termino', getProductosXTermino);


router.get('/similar/', getProductoSimilar);
router.get('/indexElastic', indexElastic);
//(\d+,\d+|\d+)(ml|l|cl|g|kg)
//$1 $2

//unidades, uds, undds etc... con numeros delate ud, 1ud 1 unidades
//

// (pack \d+) de (\d+)

// (?<!pack\s)(\d+\s+x\s+\d+(\.\d+)?)
// pack $1

// (?<!pack\s)(\b\d+\s+x\s+\d+(\.\d+)?\b)

//litros, litro a l
module.exports = router;