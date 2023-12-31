const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

const {
  insertUser,
  checkEmailAndUsername,
  selectUserByEmail,
  selectUserById,
  updateUserLoginAttempts,
  updateUserLockedTill,
  updateUserById,
  deleteUser,
  updateUserProductsById,
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

  const checkUserInputs = new Promise((resolve, reject) => {
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
      resolve(checkEmailAndUsername(email, username));
    } else {
      const missingFields = [];
      const allFields = [
        "username",
        "first_name",
        "last_name",
        "email",
        "password",
        "post_code",
        "town_or_city",
        "house_number",
        "street",
      ];
      for (const field of allFields) {
        if (!Object.keys(req.body).includes(field)) {
          const formattedField = field.split("_").join(" ");
          missingFields.push(formattedField);
        }
      }
      let errMsg = "Missing required input field";
      if (missingFields.length > 1) {
        errMsg += "s";
      }
      reject({
        status: 400,
        msg: `${errMsg} ${missingFields.join(", ")}`,
      });
    }
  });

  checkUserInputs
    .then((conflictCheck) => {
      let usernameInUse;
      let emailInUse;
      if (conflictCheck.length) {
        conflictCheck.forEach((user) => {
          if (user.username === username) {
            usernameInUse = true;
          }
          if (user.email === email) {
            emailInUse = true;
          }
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
        let errMsg = `Invalid field`;
        if (invalidFields.length > 1) {
          errMsg += "s";
        }
        return Promise.reject({
          status: 400,
          msg: `${errMsg} ${invalidFields.join(", ")}`,
        });
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
    .then((inputData) => {
      const newUser = {};
      newUser.user_id = inputData[0].insertId;
      newUser.username = username;
      return newUser;
    })
    .then((user) => {
      const accessToken = jwt.sign(user, process.env.JWT_SECRET);
      res.setHeader("authorization", `Bearer ${accessToken}`);
      res.status(201).send();
    })
    .catch(next);
};

exports.postUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  const loginAttemptLimit = 3;

  const getUser = new Promise((resolve, reject) => {
    if (email && password) {
      resolve(selectUserByEmail(email));
    } else {
      let errMsg = "Missing field";
      if (!email && !password) {
        errMsg += "s email and password";
      } else if (!email) {
        errMsg += ` email`;
      } else {
        errMsg += ` password`;
      }
      reject({ status: 400, msg: errMsg });
    }
  });

  getUser
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 400,
          msg: "Invalid email or password",
        });
      }

      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, correctPassword]) => {
      const userLoginResponse = [user, correctPassword];

      if (user.locked_till) {
        const currentTimestamp = dayjs().format("YYYY-MM-DD HH-mm-ss");
        const lockedTillTimestamp = dayjs(user.locked_till).format(
          "YYYY-MM-DD HH-mm-ss"
        );
        if (currentTimestamp > lockedTillTimestamp) {
          userLoginResponse.push(updateUserLoginAttempts(0, user.user_id));
          userLoginResponse.push(updateUserLockedTill(null, user.user_id));
          user.login_attempts = 0;
          user.locked_till = null;
        } else {
          return Promise.reject({
            status: 403,
            msg: "This Account Is temporarily locked due to failed login attempts",
          });
        }
      }

      if (correctPassword) {
        if (user.login_attempts) {
          userLoginResponse.push(0, updateUserLoginAttempts(0, user.user_id));
        }
        return Promise.all(userLoginResponse);
      } else {
        const attemptIncrease = 1;
        const newAttemptCount = user.login_attempts + attemptIncrease;
        userLoginResponse.push(
          newAttemptCount,
          updateUserLoginAttempts(newAttemptCount, user.user_id)
        );
        if (newAttemptCount >= loginAttemptLimit && !user.locked_till) {
          const lockTill = dayjs()
            .add(15, "minute")
            .format("YYYY-MM-DD HH-mm-ss");
          userLoginResponse.push(updateUserLockedTill(lockTill, user.user_id));
        }
      }
      return Promise.all(userLoginResponse);
    })
    .then(([user, correctPassword, failedAttempts]) => {
      const { user_id, username } = user;
      if (!correctPassword) {
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
      }
      const userResponse = { user_id, username };
      const accessToken = jwt.sign(userResponse, process.env.JWT_SECRET);
      res.setHeader("authorization", `Bearer ${accessToken}`);
      res.status(200).send();
    })
    .catch(next);
};

exports.patchUserById = (req, res, next) => {
  const { user_id } = req.user;
  const updatedUser = req.body;

  const updateUser = new Promise((resolve, reject) => {
    resolve(updateUserById(user_id, updatedUser));
  });

  updateUser
    .then(() => {
      res.status(200).send({ msg: "User updated" });
    })
    .catch(next);
};

exports.deleteUserById = (req, res, next) => {
  const { user_id } = req.user;

  const deletePassedUser = new Promise((resolve, reject) => {
    resolve(deleteUser(user_id));
  });

  deletePassedUser
    .then(() => {
      return updateUserProductsById(user_id);
    })
    .then(() => {
      res.status(204).send({ msg: "No content" });
    })
    .catch(next);
};
