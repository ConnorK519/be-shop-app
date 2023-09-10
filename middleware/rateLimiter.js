const { rateLimit } = require("express-rate-limit");

exports.userRegisterLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 50,
  message: { msg: "Exceeded The sign up Limit" },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.userLoginLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: { msg: "Exceeded The login Limit" },
  standardHeaders: true,
  legacyHeaders: false,
});
