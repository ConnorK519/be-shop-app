const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const {
  postUser,
  getUserByEmail,
  getUserByUsername,
  checkUserExistsWithId,
  patchUserLoginAttempts,
  patchUserLockedTill,
  deleteUser,
} = require("../models/users.models");

exports.postNewUser = async (req, res, next) => {
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

  const usernameInUse = await getUserByUsername(username);
  const emailInUse = await getUserByEmail(email);
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
      const hashedPass = bcrypt.hashSync(password, 10);
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
      const user = await getUserByEmail(email);
      const attemptLimit = 3;
      const isLockedUser = user?.login_attempts >= attemptLimit;
      if (user && user.login_attempts < attemptLimit) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          delete user.password;
          await patchUserLoginAttempts(user.login_attempts, user.user_id);
          res.status(200).send({ user });
        } else {
          if (user.login_attempts === attemptLimit - 1) {
            const lockedTill = dayjs()
              .add(15, "minute")
              .format("YYYY-MM-DD HH-mm-ss");
            await patchUserLockedTill(lockedTill, user.user_id);
          }
          await patchUserLoginAttempts(1, user.user_id);
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

exports.deleteUserById = async (req, res, next) => {
  const { user_id } = req.params;

  const check = await checkUserExistsWithId(user_id);

  if (check) {
    return deleteUser(user_id)
      .then(() => {
        res.status(204).send({ msg: "No Content" });
      })
      .catch(next);
  } else {
    res.status(404).send({ msg: "Not Found" });
  }
};
