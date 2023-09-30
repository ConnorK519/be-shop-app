const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const {
  insertUser,
  selectUserByEmail,
  selectUserByUsername,
  checkUserExistsWithId,
  updateUserLoginAttempts,
  updateUserLockedTill,
  updateUserById,
  deleteUser,
} = require("../models/users.models");

exports.postUser = async (req, res, next) => {
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
  } = req.body;
  try {
    if (
      !username ||
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !post_code ||
      !town_or_city ||
      !house_number ||
      !street
    ) {
      return Promise.reject({
        status: 400,
        msg: "Missing a required input field",
      });
    }

    const usernameInUse = await selectUserByUsername(username);
    const emailInUse = await selectUserByEmail(email);
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      let errMsg;
      if (!emailRegex.test(email) && !passwordRegex.test(password)) {
        errMsg = "Invalid email and password";
      } else if (!emailRegex.test(email)) {
        errMsg = "Invalid email";
      } else {
        errMsg = "Invalid password";
      }
      return Promise.reject({ status: 400, msg: errMsg });
    }

    if (usernameInUse || emailInUse) {
      let errMsg;
      if (usernameInUse) {
        errMsg = "Username already in use";
      } else {
        errMsg = "Email already in use";
      }
      return Promise.reject({ status: 409, msg: errMsg });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    await insertUser([
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
      currentDate,
    ]);

    const user = await selectUserByEmail(email);
    delete user.password;
    user.basket = JSON.parse(user.basket);
    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.postUserLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const user = await selectUserByEmail(email);
      const lockCheck = dayjs().format("YYYY-MM-DD HH-mm-ss");
      const lock = dayjs(user?.locked_till).format("YYYY-MM-DD HH-mm-ss");

      if (user && user.locked_till && lock < lockCheck) {
        await updateUserLoginAttempts(-user.login_attempts, user.user_id);
        await updateUserLockedTill(null, user.user_id);
        user.login_attempts = 0;
        user.locked_till = null;
      }
      const attemptLimit = 3;
      const isLockedUser = user?.login_attempts >= attemptLimit;
      if (user && user.login_attempts < attemptLimit) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          delete user.password;
          await updateUserLoginAttempts(-user.login_attempts, user.user_id);
          user.login_attempts = 0;
          user.basket = JSON.parse(user.basket);
          res.status(200).send({ user });
        } else {
          if (user.login_attempts === attemptLimit - 1) {
            const lockedTill = dayjs()
              .add(15, "minute")
              .format("YYYY-MM-DD HH-mm-ss");
            await updateUserLockedTill(lockedTill, user.user_id);
          }
          await updateUserLoginAttempts(1, user.user_id);
          res.status(401).send({ msg: "Invalid email or password" });
        }
      } else if (isLockedUser) {
        res.status(403).send({
          msg: "This Account Is temporarily locked due to failed login attempts",
        });
      } else {
        res.status(401).send({ msg: "Invalid email or password" });
      }
    } catch (err) {
      if (err) {
        next(err);
      }
    }
  } else if (email && !password) {
    res.status(400).send({ msg: "Missing field Password" });
  } else if (!email && password) {
    res.status(400).send({ msg: "Missing field Email" });
  }
};

exports.patchUserById = async (req, res, next) => {
  const { user_id } = req.params;
  const updatedUser = req.body;
  try {
    if (!isNaN(user_id)) {
      const userExists = await checkUserExistsWithId(user_id);
      if (userExists) {
        await updateUserById(user_id, updatedUser);
        res.status(200).send({ msg: "user updated" });
      } else {
        res.status(404).send({ msg: "Not Found" });
      }
    } else {
      res.status(400).send({ msg: "Bad Request" });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteUserById = async (req, res, next) => {
  const { user_id } = req.params;
  if (!isNaN(user_id)) {
    const userExists = await checkUserExistsWithId(user_id);
    if (userExists) {
      return deleteUser(user_id)
        .then(() => {
          res.status(204).send({ msg: "No Content" });
        })
        .catch(next);
    } else {
      res.status(404).send({ msg: "Not Found" });
    }
  } else {
    res.status(400).send({ msg: "Bad Request" });
  }
};
