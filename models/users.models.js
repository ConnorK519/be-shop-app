const db = require("../db/connection");

exports.postUser = async (newUser) => {
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

exports.getUserByEmail = async (email) => {
  return db.query(`SELECT * FROM users WHERE email = ?`, email).then((rows) => {
    return rows[0][0];
  });
};

exports.patchUserLoginAttempts = (number, user_id) => {
  return db.query(
    `
  UPDATE users
  SET login_attempts = login_attempts + ?
  WHERE user_id = ?
  `,
    [number, user_id]
  );
};
