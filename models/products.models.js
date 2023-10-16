const db = require("../db/connection");

exports.selectProducts = () => {
  return db
    .query(
      `SELECT product_name, image, price, product_id FROM products
    WHERE seller_id IS NOT NULL AND stock > 0`
    )
    .then((rows) => {
      return rows[0];
    });
};

exports.selectProductById = (product_id) => {
  return db
    .query(
      `
    SELECT products.*, users.username FROM products 
    LEFT JOIN users ON products.seller_id = users.user_id
    WHERE product_id = ? 
    `,
      product_id
    )
    .then((rows) => {
      if (rows[0][0]) {
        return rows[0][0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "Product not found",
        });
      }
    });
};

exports.insertProduct = (newProduct) => {
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
