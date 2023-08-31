const bcrypt = require("bcrypt");
const { createUser } = require("../models/users.models");

exports.registerUser = async (req, res, next) => {
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    post_code,
    town_or_city,
    house_number,
    street,
    created_at,
  } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  return createUser([
    username,
    first_name,
    last_name,
    email,
    hashedPass,
    post_code,
    town_or_city,
    house_number,
    street,
    "{}",
    created_at,
  ]).then(() => {
    res.status(201).send({ msg: "User created" });
  });
};
