const multer = require("multer");

const productImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads/productImgs");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + `${req.body.product_name} ${req.body.product_id}`);
  },
});

exports.uploadProductImg = multer({ storage: productImgStorage });
