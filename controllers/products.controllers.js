const dayjs = require("dayjs");

const {
  selectProducts,
  selectProductById,
  insertProduct,
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
    image = req.file.path,
    product_name,
    description,
    price,
    stock,
    category,
    created_at = currentDate,
  } = req.body;

  return insertProduct([
    seller_id,
    image,
    product_name,
    description,
    price,
    stock,
    category,
    created_at,
  ]).then(() => {
    res.status(201).send({ msg: "product posted" });
  });
};
