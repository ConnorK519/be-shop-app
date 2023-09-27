const express = require("express");
const cors = require("cors");
const { upload } = require("./middleware/multer");

const {
  userRegisterLimit,
  userLoginLimit,
} = require("./middleware/rateLimiter");

const {
  postUser,
  postUserLogin,
  deleteUserById,
  patchUserById,
} = require("./controllers/users.controllers");

const {
  getProducts,
  getProductById,
  postProduct,
} = require("./controllers/products.controllers");

const app = express();

app.use(cors());

app.use(express.json());

app.post("/api/users/register", userRegisterLimit, postUser);

app.post("/api/users/login", userLoginLimit, postUserLogin);

app.delete("/api/users/:user_id", deleteUserById);

app.get("/api/products", getProducts);

app.get("/api/products/:product_id", getProductById);

app.post("/api/products", upload.single("image"), postProduct);

app.patch("/api/users/:user_id", patchUserById);

module.exports = app;
