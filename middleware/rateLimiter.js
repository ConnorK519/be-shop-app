const { rateLimit } = require("express-rate-limit");

exports.userRegisterLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { msg: "Exceeded The sign up Limit" },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.userLoginLimit = rateLimit({
  windowMs: 60 * 60 * 500,
  max: 5,
  message: { msg: "Exceeded The sign up Limit" },
  standardHeaders: true,
  legacyHeaders: false,
});
