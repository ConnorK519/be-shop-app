const express = require("express");
const {
  userRegisterLimit,
  userLoginLimit,
} = require("./middleware/rateLimiter");

const {
  postNewUser,
  postUserLogin,
  deleteUserById,
} = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

app.post("/api/user/register", userRegisterLimit, postNewUser);

app.post("/api/user/login", userLoginLimit, postUserLogin);

app.delete("/api/user/:user_id", deleteUserById);

module.exports = app;
