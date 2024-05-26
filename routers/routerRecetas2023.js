const express = require('express');
const router = express.Router();
const recetasController = require('../controllers/controllerRecetas2023');
const RecetaController = require('../controllers/controllerRecetas2023');
const path = require("path");
const multer = require('multer');  // Importa multer



function verificarAutenticacion(req, res, next) {
    console.log('Sesión actual:', req.session);
    if (req.session.userId) {
      // El usuario está autenticado, continúa con la solicitud
      next();
    } else {
      // El usuario no está autenticado, redirige a la página de inicio de sesión o envía un error
      res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }
  }


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'imagenes/recetas-imagen');  // Reemplaza con tu ruta real
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
  
const upload = multer({ storage: storage });
// Ruta para crear receta con ingredientes
router.post('/crearRecetaConIngredientes',upload.single('imagen'), verificarAutenticacion,recetasController.crearRecetaConIngredientes);
router.get('/obtenerRecetas', recetasController.obtenerRecetas);
router.get('/categorias', recetasController.obtenerCategorias);
router.get('/dificultad', recetasController.obtenerDificultades);
router.get('/buscar-recetas', recetasController.buscarRecetas);
router.get('/recetas/misrecetas', verificarAutenticacion,recetasController.getRecetasByUsuario);

// Configura Express para servir imágenes estáticas
//const rutaImagen = path.join(__dirname, "../public/recetas", imagen);

// router.use('/imagenRecetas', express.static(path.join(__dirname, '../public/recetas')));

// router.get('/recetas/imagen/:idReceta', recetasController.sendRecetaImage);
// router.use('/recetas/imagen', express.static(path.join(__dirname, '../public/recetas')));harin

router.get('/unidades-medida', recetasController.obtenerUnidadesMedida);
router.get('/receta/:id', RecetaController.obtenerDetallesRecetaCompleta);
router.post('/recetas/:idReceta/votar',verificarAutenticacion, recetasController.votarReceta);
router.delete('/recetas/:idReceta/quitar-voto', verificarAutenticacion,recetasController.quitarVotoReceta);
router.get('/recetas/:idReceta/puntuacion', recetasController.obtenerPuntuacionTotalReceta);




module.exports = router;