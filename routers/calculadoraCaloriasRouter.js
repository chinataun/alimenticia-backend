// routes/calculadoraCaloriasRoutes.js
const express = require('express');

const router = express.Router();
const calculadoraCaloriasController = require('../controllers/controllerCalculadoraCalorias');
function verificarAutenticacion(req, res, next) {
    if (req.session.userId) {
      // El usuario está autenticado, configura req.user con los datos del usuario
      req.user = {
        id: req.session.userId, // Esto es un ejemplo, debes configurarlo según tu aplicación
        // Otros datos del usuario aquí
      };
      next();
    } else {
      // El usuario no está autenticado, redirige o responde con un error
      res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }
  }
router.post('/calcular', calculadoraCaloriasController.calcularCalorias);

router.post('/calcularRegistro', verificarAutenticacion,calculadoraCaloriasController.calcularCaloriasUsuarioRegistrado)

module.exports = router;
