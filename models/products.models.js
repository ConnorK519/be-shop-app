const db = require("../db/connection");

exports.selectProducts = async () => {
  return db
    .query(
      `SELECT product_name, image, price, seller_id FROM products
    WHERE seller_id IS NOT NULL AND stock > 0`
    )
    .then((rows) => {
      return rows[0];
    });
};

exports.selectProductById = async (product_id) => {
  return db
    .query(
      `
    SELECT products.*, users.username FROM  products 
    JOIN users ON products.seller_id = users.user_id
    WHERE product_id = ?
    `,
      product_id
    )
    .then((rows) => {
      return rows[0][0];
    });
};

exports.insertProduct = async (newProduct) => {
  return db.query(
    `INSERT INTO products (
    seller_id,
    image,
    product_name,
    description,
    price,
    stock,
    category,
    created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    newProduct
  );
};
