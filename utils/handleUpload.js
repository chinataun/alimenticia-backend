
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    console.log(file)
    // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;