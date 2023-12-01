const express = require("express");
const cors = require("cors");

const { upload } = require("./middleware/multer");

const { handleCustomErrors } = require("./middleware/errorHandlers");

const { authenticateToken } = require("./middleware/authentication");

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

const {
  getChatsByUserId,
  getMessagesByChatId,
  postNewChatOrGetChat,
  postMessageToChatById,
} = require("./controllers/messages.controllers");

const app = express();

app.use(cors());

app.use(express.json());

app.post("/api/users/register", userRegisterLimit, postUser);

app.post("/api/users/login", userLoginLimit, postUserLogin);

app.patch("/api/users", authenticateToken, patchUserById);

app.delete("/api/users", authenticateToken, deleteUserById);

app.get("/api/products", getProducts);

app.get("/api/products/:product_id", getProductById);

app.post(
  "/api/products",
  authenticateToken,
  upload.single("image"),
  postProduct
);

app.get("/api/chats", authenticateToken, getChatsByUserId);

app.get("/api/messages/:chat_id", authenticateToken, getMessagesByChatId);

app.post("/api/chats", authenticateToken, postNewChatOrGetChat);

app.post("/api/messages/:chat_id", authenticateToken, postMessageToChatById);

app.use(handleCustomErrors);

module.exports = app;
