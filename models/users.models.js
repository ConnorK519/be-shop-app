const db = require("../db/connection");

exports.insertUser = (newUser) => {
  return db.query(
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

exports.selectUserByEmail = (email) => {
  if (!email) {
    return false;
  }
  return db.query(`SELECT * FROM users WHERE email = ?`, email).then((rows) => {
    return rows[0][0];
  });
};

exports.selectUserByUsername = (username) => {
  if (!username) {
    return false;
  }
  return db
    .query(`SELECT * FROM users WHERE username = ?`, username)
    .then((rows) => {
      return rows[0][0];
    });
};

exports.checkUserExistsWithId = (user_id) => {
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

exports.updateUserById = (user_id, updatedUser) => {
  const validFields = {
    username: ["string", 5, 15],
    first_name: ["string", 1, 20],
    last_name: ["string", 1, 20],
    post_code: ["string", 3, 10],
    town_or_city: ["string", 3, 20],
    house_number: ["number"],
    street: ["string", 5, 50],
  };
  const values = [];
  const invalidFields = [];
  const fieldsToUpdate = Object.keys(updatedUser)
    .map((key) => {
      if (Object.keys(validFields).includes(key)) {
        if (
          typeof updatedUser[key] === validFields[key][0] &&
          updatedUser[key].length >= validFields[key][1] &&
          updatedUser[key].length <= validFields[key][2]
        ) {
          values.push(updatedUser[key]);
          return `${key} = ?`;
        } else if (!isNaN(updatedUser[key]) && key === "house_number") {
          values.push(updatedUser[key]);
          return `${key} = ?`;
        } else {
          invalidFields.push(key);
        }
      } else {
        invalidFields.push(key);
      }
    })
    .filter((field) => field !== undefined)
    .join(", ");
  values.push(user_id);

  if (invalidFields.length > 0) {
    let errMsg = "Invalid field";
    const formattedInvalidFields = invalidFields.map((field) => {
      return field.split("_").join(" ");
    });
    if (invalidFields.length > 1) {
      errMsg += "s";
    }
    return Promise.reject({
      status: 400,
      msg: `${errMsg} ${formattedInvalidFields.join(", ")}`,
    });
  }

  if (fieldsToUpdate.length > 0) {
    const query = `UPDATE users SET ${fieldsToUpdate} WHERE user_id = ?`;
    return db.query(query, values);
  } else {
    return Promise.reject({
      status: 400,
      msg: "No valid fields found to update",
    });
  }
};

exports.deleteUser = (user_id) => {
  return db.query(`DELETE FROM users WHERE user_id = ?`, user_id);
};

exports.updateUserProductsById = (seller_id) => {
  return db.query(
    `
    UPDATE products
    SET seller_id = NULL
    WHERE seller_id = ?`,
    seller_id
  );
};
