const express = require("express");

const { registerUser } = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

app.post("/api/users", registerUser);

module.exports = app;
