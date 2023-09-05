const express = require("express");
const {
  userRegisterLimit,
  userLoginLimit,
} = require("./middleware/rateLimiter");

const { registerUser, loginUser } = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

app.post("/api/user/register", userRegisterLimit, registerUser);

app.post("/api/user/login", userLoginLimit, loginUser);

module.exports = app;
