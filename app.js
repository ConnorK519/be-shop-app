const express = require("express");

const {
  userRegisterLimit,
  userLoginLimit,
} = require("./middleware/rateLimiter");

const { uploadProductImg } = require("./middleware/multer");

const {
  postUser,
  postUserLogin,
  deleteUserById,
} = require("./controllers/users.controllers");

const {
  getProducts,
  getProductById,
  postProduct,
} = require("./controllers/products.controllers");

const app = express();

app.use(express.json());

app.post("/api/user/register", userRegisterLimit, postUser);

app.post("/api/user/login", userLoginLimit, postUserLogin);

app.delete("/api/user/:user_id", deleteUserById);

app.get("/api/products", getProducts);

app.get("/api/product/:product_id", getProductById);

app.post("/api/products", uploadProductImg, postProduct);

module.exports = app;
