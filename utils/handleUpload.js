
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const uploadFields = upload.fields([{ name: 'imagenPrincipal', maxCount: 1 }, { name: 'imagenesPasos', maxCount: 10 }]);

module.exports = uploadFields;