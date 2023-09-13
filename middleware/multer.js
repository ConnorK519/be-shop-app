const multer = require("multer");

const productImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads/productImgs");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + `${req.body.product_name} ${req.body.product_id}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("Incorrect File Type"), false);
  }
};

exports.uploadProductImg = multer({
  storage: productImgStorage,
  fileFilter,
  limits: { fileSize: 1000000, files: 1 },
});
