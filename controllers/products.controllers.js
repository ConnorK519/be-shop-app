const dayjs = require("dayjs");
const { storageClient, bucketName } = require("../middleware/multer");

const {
  selectProducts,
  selectProductById,
  insertProduct,
} = require("../models/products.models");

exports.getProducts = (req, res, next) => {
  return selectProducts()
    .then((products) => {
      res.status(200).send({ products });
    })
    .catch(next);
};

exports.getProductById = (req, res, next) => {
  const { product_id } = req.params;

  const checkId = new Promise((resolve, reject) => {
    if (isNaN(product_id) || product_id <= 0) {
      reject({
        status: 400,
        msg: `Invalid product id: ${product_id}. id must be a number above 0`,
      });
    } else {
      resolve(selectProductById(product_id));
    }
  });

  checkId
    .then((product) => {
      res.status(200).send({ product });
    })
    .catch(next);
};

exports.postProduct = (req, res, next) => {
  const { seller_id, product_name, description, price, stock, category } =
    req.body;

  const listProduct = new Promise((resolve, reject) => {
    if (
      !seller_id ||
      !product_name ||
      !description ||
      !price ||
      !stock ||
      !category
    ) {
      const missingFields = [];
      const allFields = [
        "seller_id",
        "product_name",
        "description",
        "price",
        "stock",
        "category",
      ];
      for (const field of allFields) {
        if (!Object.keys(req.body).includes(field)) {
          const formattedField = field.split("_").join(" ");
          missingFields.push(formattedField);
        }
      }
      let errMsg = "Missing required input field";
      if (missingFields.length > 1) {
        errMsg += "s";
      }
      return reject({
        status: 400,
        msg: `${errMsg} ${missingFields.join(", ")}`,
      });
    }
    const currentDate = dayjs().format("YYYY-MM-DD HH-mm-ss");
    const fileName = `${product_name}-${Date.now()}-${seller_id}`;
    let imageURL = null;

    const validFields = {
      seller_id: ["number", 0],
      product_name: ["string", 1, 100],
      description: ["string", 1, 1000],
      price: ["number", 0],
      stock: ["number", 0],
      category: ["string", 1, 50],
    };

    const invalidFields = [];
    const fields = { ...req.body };

    for (const key of Object.keys(fields)) {
      if (Object.keys(validFields).includes(key)) {
        const stringCheck = validFields[key][0] === "string";
        const numberCheck = validFields[key][0] === "number";
        if (
          (typeof fields[key] !== validFields[key][0] && stringCheck) ||
          (fields[key].length < validFields[key][1] && stringCheck) ||
          (fields[key].length > validFields[key][2] && stringCheck) ||
          (numberCheck && isNaN(fields[key])) ||
          (numberCheck && fields[key] < validFields[key][1])
        ) {
          invalidFields.push(key);
        }
      } else {
        invalidFields.push(key);
      }
    }

    if (invalidFields.length) {
      let errMsg = `Invalid field`;
      if (invalidFields.length > 1) {
        errMsg += "s";
      }
      return reject({
        status: 400,
        msg: `${errMsg} ${invalidFields.join(", ")}`,
      });
    }

    if (req.file) {
      imageURL = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      const blob = storageClient.bucket(bucketName).file(fileName);
      const stream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on("error", (err) => {
        console.error(err);
        return reject({
          status: 500,
          msg: "Error uploading image to Google Cloud Storage.",
        });
      });

      stream.on("finish", () => {
        console.log("Image Posted Successfully");
      });

      stream.end(req.file.buffer);
    }

    return resolve(
      insertProduct([
        seller_id,
        imageURL,
        product_name,
        description,
        price,
        stock,
        category,
        currentDate,
      ])
    );
  });

  listProduct
    .then(() => {
      res.status(201).send({ msg: "Product listed" });
    })
    .catch(next);
};
