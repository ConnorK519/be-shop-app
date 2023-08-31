const db = require("../db/connection");

exports.createUser = async (newUser) => {
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
