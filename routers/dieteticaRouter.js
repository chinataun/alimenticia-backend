const express = require('express');
const router = express.Router();
const passport = require("passport");
const { getCaloriasCalculadora } = require('../controllers/dietetica');

router.get('/calculadora', getCaloriasCalculadora);

module.exports = router;