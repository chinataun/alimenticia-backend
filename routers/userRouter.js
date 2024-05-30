const express = require('express');
const router = express.Router();
const passport = require("passport");
const { getUser, loginUser, newUser, updateUser,checkPassword, getListasCompras, changePassword, getSupermarket, setSupermarketFavorite,setListasCompras, setCp, deleteUser, deleteCarritoUser} = require('../controllers/user');
const { update } = require('../models/user');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const uploadFields = require('../utils/handleUpload')



router.get('/', getUser);

router.post('/signin',  newUser);

router.post('/login', function(req, res, next) {
    /* look at the 2nd parameter to the below call */
    passport.authenticate('local', function(err, user, info) {
      if (err) { 
        return next(); 
      }
      if (!user) {
        req.info = info; 
        return next(); 
      }
      req.user = user; 
      return next();
    })(req, res, next)},  loginUser)

router.put("/edit", uploadFields, updateUser);

router.delete("/", deleteUser);

router.get('/check-password', checkPassword);

router.put('/change-password', changePassword);

router.put('/setSupermarketFavorite', setSupermarketFavorite);


router.put('/setCp', setCp);

router.get('/supermarket', getSupermarket);


router.post('/compras', setListasCompras);
router.get('/compras', getListasCompras);

router.delete("/compras", deleteCarritoUser);
// export default router;

module.exports = router;