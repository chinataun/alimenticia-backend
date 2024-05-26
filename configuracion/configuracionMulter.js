const multer = require('multer');

function configurarMulter(destinationFolder) {
  return multer({
    storage: multer.diskStorage({
      destination: destinationFolder,
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
      },
    }),
  });
}

module.exports = { configurarMulter };
