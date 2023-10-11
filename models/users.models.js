const db = require("../db/connection");

exports.insertUser = async (newUser) => {
  return await db.query(
    `INSERT INTO users (
    username,
    first_name,
    last_name,
    email,
    password,
    post_code,
    town_or_city,
    house_number,
    street,
    basket,
    created_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    newUser
  );
};

exports.selectUserByEmail = async (email) => {
  if (!email) {
    return false;
  }
  return db.query(`SELECT * FROM users WHERE email = ?`, email).then((rows) => {
    return rows[0][0];
  });
};

exports.selectUserByUsername = async (username) => {
  if (!username) {
    return false;
  }
  return db
    .query(`SELECT * FROM users WHERE username = ?`, username)
    .then((rows) => {
      return rows[0][0];
    });
};

exports.checkUserExistsWithId = async (user_id) => {
  if (!user_id) {
    return false;
  }
  return db
    .query(`SELECT * FROM users WHERE user_id = ?`, user_id)
    .then((rows) => {
      return rows[0][0];
    });
};

exports.updateUserLoginAttempts = (number, user_id) => {
  return db.query(
    `
  UPDATE users
  SET login_attempts = ?
  WHERE user_id = ?
  `,
    [number, user_id]
  );
};

exports.updateUserLockedTill = (date, user_id) => {
  return db.query(
    `
  UPDATE users
  SET locked_till = ?
  WHERE user_id = ?
  `,
    [date, user_id]
  );
};

exports.updateUserById = async (user_id, updatedUser) => {
  const validFields = {
    username: ["string", 15],
    first_name: ["string", 20],
    last_name: ["string", 20],
    post_code: ["string", 10],
    town_or_city: ["string", 20],
    house_number: ["number"],
    street: ["string", 50],
  };
  const values = [];
  const invalidFields = [];
  const fieldsToUpdate = Object.keys(updatedUser)
    .map((key) => {
      if (Object.keys(validFields).includes(key)) {
        if (
          typeof updatedUser[key] === validFields[key][0] &&
          updatedUser[key].length <= validFields[key][1]
        ) {
          values.push(updatedUser[key]);
          return `${key} = ?`;
        } else if (!isNaN(updatedUser[key]) && key === "house_number") {
          values.push(updatedUser[key]);
          return `${key} = ?`;
        } else {
          invalidFields.push(key);
        }
      }
    })
    .filter((field) => field !== undefined)
    .join(", ");
  values.push(user_id);

  if (invalidFields.length > 0) {
    const errMsg = invalidFields.join(", ");
    return Promise.reject({ status: 400, msg: `Invalid Fields: ${errMsg}` });
  }

  if (fieldsToUpdate.length > 0) {
    const query = `UPDATE users SET ${fieldsToUpdate} WHERE user_id = ?`;
    return db.query(query, values);
  } else {
    return Promise.reject({ status: 400, msg: "No fields to update" });
  }
};

exports.deleteUser = (user_id) => {
  return db.query(`DELETE FROM users WHERE user_id = ?`, user_id);
};
