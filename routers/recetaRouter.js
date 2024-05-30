const express = require('express');
const router = express.Router();
const passport = require("passport");
const { getRecetas, getReceta, addReceta, getRecetasByUser,removeReceta, editReceta, getFavorites,getCreated, addRecetaFavorita, removeRecetaFavorita, isVoted, votarReceta } = require('../controllers/receta');
const uploadFields = require('../utils/handleUpload')

router.get('/', getRecetas);
router.get('/receta/:id', getReceta);
router.post('/add', uploadFields, addReceta);
router.put('/edit', uploadFields, editReceta);
// router.post('/receta/:id', upload.fields([{
//   name: 'image', maxCount: 1
// }]), editReceta);

//dones

router.get('/mis-recetas', getCreated);
router.post('/removeCreated', removeReceta);
router.get('/user', getRecetasByUser);

//dones
router.get('/recetas-favoritas', getFavorites);
router.post('/addFavorite', addRecetaFavorita);
router.post('/removeFavorite', removeRecetaFavorita);

router.get('/isVoted', isVoted);
router.post('/votar', votarReceta);


module.exports = router;