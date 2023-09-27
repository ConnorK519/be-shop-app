const dayjs = require("dayjs");
const { storageClient, bucketName } = require("../middleware/multer");

const {
  selectProducts,
  selectProductById,
  insertProduct,
  updateProductSeller,
} = require("../models/products.models");

exports.getProducts = async (req, res, next) => {
  return selectProducts().then((products) => {
    res.status(200).send(products);
  });
};

exports.getProductById = async (req, res, next) => {
  const { product_id } = req.params;
  return selectProductById(product_id)
    .then((product) => {
      res.status(200).send(product);
    })
    .catch(next);
};

exports.postProduct = async (req, res, next) => {
  const currentDate = dayjs().format("YYYY-MM-DD");
  const {
    seller_id,
    product_name,
    description,
    price,
    stock,
    category,
    created_at = currentDate,
  } = req.body;
  if (seller_id && product_name && description && price && stock && category) {
    const fileName = `${product_name}-${Date.now()}-${seller_id}`;
    const blob = storageClient.bucket("shop-app-portfolio").file(fileName);

    const stream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error(err);
      return res
        .status(500)
        .send({ msg: "Error uploading image to Google Cloud Storage." });
    });

    stream.on("finish", () => {
      console.log("Image Posted Successfully");
    });

    stream.end(req.file.buffer);

    const image_URL = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return insertProduct([
      seller_id,
      image_URL,
      product_name,
      description,
      price,
      stock,
      category,
      created_at,
    ]).then(() => {
      res.status(201).send({ msg: "product posted" });
    });
  } else {
    res.status(400).send({ msg: "Missing required field" });
  }
};
