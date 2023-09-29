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

  const usernameInUse = await selectUserByUsername(username);
  const emailInUse = await selectUserByEmail(email);
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (
    username &&
    first_name &&
    last_name &&
    email &&
    password &&
    post_code &&
    town_or_city &&
    house_number &&
    street
  ) {
    if (
      emailRegex.test(email) &&
      passwordRegex.test(password) &&
      !emailInUse &&
      !usernameInUse
    ) {
      const hashedPass = await bcrypt.hash(password, 10);
      return insertUser([
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
      ])
        .then(() => {
          return selectUserByEmail(email);
        })
        .then((user) => {
          delete user.password;
          user.basket = JSON.parse(user.basket);
          res.status(201).send({ user });
        })
        .catch(next);
    } else if (usernameInUse) {
      res.status(409).send({ msg: "Username already in use" });
    } else if (emailInUse) {
      res.status(409).send({ msg: "Email already in use" });
    } else {
      res.status(400).send({ msg: "Invalid email or password" });
    }
  } else {
    res.status(400).send({ msg: "Missing a required input field" });
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
