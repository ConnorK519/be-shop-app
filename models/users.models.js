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
  return db.query(`SELECT * FROM users WHERE email = ?`, email).then((rows) => {
    return rows[0][0];
  });
};

exports.selectUserByUsername = async (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = ?`, username)
    .then((rows) => {
      return rows[0][0];
    });
};

exports.checkUserExistsWithId = async (user_id) => {
  return db
    .query(`SELECT * FROM users WHERE user_id = ?`, user_id)
    .then((rows) => {
      if (rows[0][0]?.user_id) {
        return rows[0][0];
      } else {
        return false;
      }
    });
};

exports.updateUserLoginAttempts = (number, user_id) => {
  return db.query(
    `
  UPDATE users
  SET login_attempts = login_attempts + ?
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

exports.deleteUser = (user_id) => {
  return db.query(`DELETE FROM users WHERE user_id = ?`, user_id);
};
