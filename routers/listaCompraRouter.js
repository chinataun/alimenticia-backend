const express = require('express');
const router = express.Router();
const ListCompraController = require('../controllers/controllerListaCompra');

router.post('/create', ListCompraController.create);
router.get('/user/:usuario_id', ListCompraController.getListComprasByUserId);
router.get('/getAllByUserId/:usuario_id', ListCompraController.getListComprasByUserId);
router.get('/getAllByUserId', ListCompraController.getListComprasByUserId);
router.post('/crear', ListCompraController.lista);


function verificarAutenticacion(req, res, next) {
    if (req.session.userId) {
      // El usuario está autenticado, continúa con la solicitud
      next();
    } else {
      // El usuario no está autenticado, redirige a la página de inicio de sesión o envía un error
      res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }
  }
router.get('/listasCompra/:usuarioId',verificarAutenticacion, ListCompraController.obtenerListaCompra);
// Puedes agregar más rutas según tus necesidades

module.exports = router;
