const db = require("../db/connection");

exports.selectChatsByUserId = (user_id) => {
  return db
    .query(
      `
     SELECT chats.*, users.username FROM chats
     LEFT JOIN users ON users.user_id = user1_id OR users.user_id = user2_id 
     WHERE (user1_id = ? OR user2_id = ?) AND users.user_id != ?`,
      [user_id, user_id, user_id]
    )
    .then((rows) => {
      return rows[0];
    });
};

exports.selectMessagesByChatId = (chat_id) => {
  return db
    .query(
      `
     SELECT chats.chat_id, messages.*, users.username FROM chats 
     JOIN messages ON chats.chat_id = messages.chat_id
     LEFT JOIN users ON messages.sender_id = users.user_id
     WHERE chats.chat_id = ?
     ORDER BY messages.sent_at DESC`,
      chat_id
    )
    .then((rows) => {
      return rows[0];
    });
};

exports.selectChatByUsers = (user1_id, user2_id) => {
  return db
    .query(
      `SELECT chat_id FROM chats 
     WHERE user1_id = ? AND user2_id = ? OR user1_id = ? AND user2_id = ?`,
      [user1_id, user2_id, user2_id, user1_id]
    )
    .then((rows) => {
      if (rows[0][0]) {
        return rows[0][0];
      }
      return false;
    });
};

exports.insertNewChat = (user1_id, user2_id) => {
  return db.query(
    `INSERT INTO chats (
    user1_id,
    user2_id
  )
  VALUES (?, ?)
  `,
    [user1_id, user2_id]
  );
};
