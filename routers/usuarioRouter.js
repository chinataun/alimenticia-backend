const express = require('express');
const multer = require('multer');  // Importa multer
const path = require('path');
const router = express.Router();
const passport = require("passport");

const userController = require('../controllers/controllerUsuarios');

// Resto de tu código
function verificarAutenticacion(req, res, next) {
  if (req.session.userId) {
    // El usuario está autenticado, continúa con la solicitud
    next();
  } else {
    // El usuario no está autenticado, redirige a la página de inicio de sesión o envía un error
    res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }
}
router.get('/ruta-imagen-usuario', userController.obtenerRutaImagenUsuarioController);

router.get('/informacion', userController.obtenerInformacionUsuarioController);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'imagenes/usuario-imagen');  // Reemplaza con tu ruta real
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });



router.post('/logout', (req, res) => {
    req.session.destroy(); // Destruye la sesión en el logout
    res.status(200).json({ mensaje: 'Sesión cerrada exitosamente' });
  });
router.post('/registro', upload.single('imagen'),userController.registrarUsuarioController);

// Ruta para iniciar sesión
/*
router.post('/iniciar-sesion',  passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  successFlash: true,
  failureFlash: true
}), userController.iniciarSesion);
*/
router.post('/iniciar-sesion',  function(req, res, next) {
  
  /* look at the 2nd parameter to the below call */
  passport.authenticate('local', function(err, user, info) {
    
    if (err) { 
      console.log("JASJDASDKsASKDNASK")
      return next(); 
    }
    if (!user) {
      console.log("JASJD")
      req.info = info; 
      return next(); 
    }
    console.log("KDNASK")
    console.log(user)
    req.user = user; 
    return next();
  })(req, res, next)}, userController.iniciarSesion);


// Rutas relacionadas con recetas favoritas
// Agregar una receta a favoritos
router.post('/usuarios/:usuarioId/favoritos/:recetaId', userController.agregarRecetaFavorita);

// Obtener las recetas favoritas de un usuario
router.get('/usuarios/:usuarioId/favoritos',verificarAutenticacion, userController.obtenerRecetasFavoritas);
//router.get('/usuarios/:usuarioId/recetas/:recetaId',verificarAutenticacion,userController.obtenerRecetaFavorita);
//router.post('/usuarios/calcularRegistro', verificarAutenticacion,userController.calcularCaloriasUsuarioRegistrado)

module.exports = router;