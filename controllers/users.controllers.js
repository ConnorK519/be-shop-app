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

exports.postUser = (req, res, next) => {
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

  let hasAllFields = false;

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
    hasAllFields = true;
  }

  const promises = [selectUserByEmail(email), selectUserByUsername(username)];

  return Promise.all(promises)
    .then(([emailInUse, usernameInUse]) => {
      if (!hasAllFields) {
        return Promise.reject({
          status: 400,
          msg: "Missing a required input field",
        });
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

      const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,}$/;
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

      const validFields = {
        username: ["string", 15],
        first_name: ["string", 20],
        last_name: ["string", 20],
        post_code: ["string", 10],
        town_or_city: ["string", 20],
        house_number: ["number", 0],
        street: ["string", 50],
      };
      const invalidFields = [];
      const fields = { ...req.body };
      delete fields.email;
      delete fields.password;

      for (const key of Object.keys(fields)) {
        if (Object.keys(validFields).includes(key)) {
          const stringCheck = validFields[key][0] === "string";
          if (
            (typeof fields[key] !== validFields[key][0] && stringCheck) ||
            (fields[key].length > validFields[key][1] && stringCheck) ||
            (validFields[key][0] === "number" && isNaN(fields[key]))
          ) {
            invalidFields.push(key);
          }
        } else {
          invalidFields.push(key);
        }
      }

      if (invalidFields.length) {
        const errMsg = `Invalid fields ${invalidFields.join(", ")}`;
        return Promise.reject({ status: 400, msg: errMsg });
      }

      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      const currentDate = dayjs().format("YYYY-MM-DD HH-mm-ss");
      return insertUser([
        username,
        first_name,
        last_name,
        email,
        hashedPassword,
        post_code,
        town_or_city,
        house_number,
        street,
        "{}",
        currentDate,
      ]);
    })
    .then(() => {
      return selectUserByEmail(email);
    })
    .then((user) => {
      delete user.password;
      user.basket = JSON.parse(user.basket);
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.postUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  const loginAttemptLimit = 3;

  return selectUserByEmail(email)
    .then((user) => {
      if (!email || !password) {
        let errMsg = "Missing field";
        if (!email && !password) {
          errMsg += "s email and password";
        } else if (!email) {
          errMsg += ` email`;
        } else {
          errMsg += ` password`;
        }
        return Promise.reject({ status: 400, msg: errMsg });
      }

      if (!user) {
        return Promise.reject({
          status: 400,
          msg: "Invalid email or password",
        });
      }

      const promises = [bcrypt.compare(password, user.password), user];

      if (user.locked_till) {
        const currentTimestamp = dayjs().format("YYYY-MM-DD HH-mm-ss");
        const lockedTillTimestamp = dayjs(user.locked_till).format(
          "YYYY-MM-DD HH-mm-ss"
        );
        if (currentTimestamp > lockedTillTimestamp) {
          promises.push(updateUserLoginAttempts(0, user.user_id));
          promises.push(updateUserLockedTill(null, user.user_id));
          user.login_attempts = 0;
          user.locked_till = null;
        } else {
          return Promise.reject({
            status: 403,
            msg: "This Account Is temporarily locked due to failed login attempts",
          });
        }
      }
      return Promise.all(promises);
    })
    .then(([correctPassword, user]) => {
      const userLoginResponse = [user];
      if (correctPassword) {
        if (user.login_attempts) {
          userLoginResponse.push(0, updateUserLoginAttempts(0, user.user_id));
        }
        userLoginResponse.push(0, null);
        return userLoginResponse;
      } else {
        const attemptIncrease = 1;
        const newAttemptCount = user.login_attempts + attemptIncrease;
        userLoginResponse.push(
          newAttemptCount,
          updateUserLoginAttempts(newAttemptCount, user.user_id)
        );
        if (newAttemptCount >= loginAttemptLimit) {
          const lockTill = dayjs()
            .add(15, "minute")
            .format("YYYY-MM-DD HH-mm-ss");
          userLoginResponse.push(updateUserLockedTill(lockTill, user.user_id));
        }
      }
      return Promise.all(userLoginResponse);
    })
    .then(([user, failedAttempts]) => {
      if (failedAttempts) {
        if (failedAttempts >= loginAttemptLimit) {
          return Promise.reject({
            status: 403,
            msg: "This Account has been temporarily locked due to failed login attempts",
          });
        }
        return Promise.reject({
          status: 400,
          msg: "Invalid email or password",
        });
      } else {
        delete user.password;
        user.login_attempts = 0;
        user.basket = JSON.parse(user.basket);
        res.status(200).send({ user });
      }
    })
    .catch(next);
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
