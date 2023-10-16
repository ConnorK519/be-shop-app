const db = require("../connection");
const { formatUsers } = require("./utils");

const seed = ({ userData, productData }) => {
  return db
    .query("DROP TABLE IF EXISTS ordered_items;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS orders;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS products;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS messages;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS chats;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(15) UNIQUE NOT NULL,
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(60) NOT NULL,
        post_code VARCHAR(10) NOT NULL,
        town_or_city VARCHAR(20) NOT NULL,
        house_number INT NOT NULL,
        street VARCHAR(50) NOT NULL,
        basket TEXT,
        login_attempts INT DEFAULT 0,
        locked_till TIMESTAMP DEFAULT NULL,
        created_at DATE
      )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE chats (
        chat_id SERIAL PRIMARY KEY,
        created_at DATE
      )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE messages (
        message_id SERIAL PRIMARY KEY,
        chat_id INT REFERENCES chats(chat_id),
        sender_id INT REFERENCES users(user_id),
        message TEXT,
        sent_at DATE
      )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE products (
        product_id SERIAL PRIMARY KEY,
        seller_id INT REFERENCES users(user_id) ON DELETE SET NULL,
        image TEXT,
        product_name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(6, 2) NOT NULL CHECK (price >= 0),
        stock INT NOT NULL CHECK (stock >= 0),
        category VARCHAR(50) NOT NULL,
        created_at DATE
      )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
        order_date DATE,
        total_amount DECIMAL(6, 2) NOT NULL,
        status VARCHAR(20)
      )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE ordered_items (
        item_order_id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(order_id),
        product_id INT REFERENCES products(product_id),
        quantity INT NOT NULL CHECK (quantity >= 0),
        subtotal DECIMAL(6, 2) NOT NULL
      )`);
    })
    .then(() => {
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
      VALUES ?`,
        [formatUsers(userData)]
      );
    })
    .then(() => {
      return db.query(
        `INSERT INTO products (
          product_name,
          seller_id,
          image,
          description,
          price,
          stock,
          category,
          created_at
        )
        VALUES ?`,
        [
          productData.map((product) => [
            product.product_name,
            product.seller_id,
            product.image,
            product.description,
            product.price,
            product.stock,
            product.category,
            product.created_at,
          ]),
        ]
      );
    });
};

module.exports = seed;
