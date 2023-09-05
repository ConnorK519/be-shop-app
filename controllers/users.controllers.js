const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const {
  postUser,
  getUserByEmail,
  patchUserLoginAttempts,
  patchUserLockedTill,
} = require("../models/users.models");

exports.registerUser = async (req, res, next) => {
  const currentDate = dayjs().format("YYYY-MM-DD");
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
    created_at = currentDate,
  } = req.body;

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (emailRegex.test(email) && passwordRegex.test(password)) {
    const hashedPass = await bcrypt.hash(password, 10);
    return postUser([
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
    ])
      .then(() => {
        return getUserByEmail(email);
      })
      .then((user) => {
        delete user.password;
        res.status(201).send({ user });
      });
  } else {
    res.status(400).send({ msg: "Invalid email or password" });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  const attemptLimit = 3;
  const isLockedUser = user.login_attempts >= attemptLimit;
  const errorMsg = isLockedUser
    ? "This Account Is temporarily locked due to failed login attempts"
    : "Invalid email or password";
  const errStatus = isLockedUser ? 403 : 401;

  if (user && user.login_attempts < attemptLimit) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      delete user.password;
      patchUserLoginAttempts(user.login_attempts, user.user_id);
      res.status(200).send({ user });
    } else {
      if (user.login_attempts === attemptLimit - 1) {
        const lockedTill = dayjs()
          .add(15, "minute")
          .format("YYYY-MM-DD HH-mm-ss");
        patchUserLockedTill(lockedTill, user.user_id);
      }
      patchUserLoginAttempts(1, user.user_id);
      res.status(401).send({ msg: "Invalid email or password" });
    }
  } else {
    res.status(errStatus).send({ msg: errorMsg });
  }
};
