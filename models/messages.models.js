const db = require("../db/connection");
const dayjs = require("dayjs");

exports.selectChatsByUserId = (user_id) => {
  return db
    .query(
      `
     SELECT chats.*, users.username FROM chats
     LEFT JOIN users ON users.user_id = user1_id OR users.user_id = user2_id 
     WHERE (user1_id = ? OR user2_id = ?) AND users.user_id != ?
     ORDER BY last_message_time DESC`,
      [user_id, user_id, user_id]
    )
    .then((rows) => {
      const chats = rows[0];
      chats.forEach(
        (chat) =>
          (chat.last_message_time = dayjs(chat.last_message_time).format(
            "YYYY-MM-DD HH:mm:ss"
          ))
      );
      return chats;
    });
};

exports.selectMessagesByChatId = (chat_id, user_id) => {
  return db
    .query(
      `
     SELECT chats.chat_id, messages.*, users.username FROM chats 
     JOIN messages ON chats.chat_id = messages.chat_id
     LEFT JOIN users ON messages.sender_id = users.user_id
     WHERE chats.chat_id = ? AND chats.user1_id = ? OR chats.chat_id = ? AND chats.user2_id = ?
     ORDER BY messages.sent_at DESC`,
      [chat_id, user_id, chat_id, user_id]
    )
    .then((rows) => {
      const messages = rows[0];
      messages.forEach(
        (message) =>
          (message.sent_at = dayjs(message.sent_at).format(
            "YYYY-MM-DD HH:mm:ss"
          ))
      );
      return messages;
    });
};

exports.insertNewChat = (user1_id, user2_id, currentDate) => {
  return db.query(
    `INSERT INTO chats (
    user1_id,
    user2_id,
    last_message_time
  )
  VALUES (?, ?, ?)
  `,
    [user1_id, user2_id, currentDate]
  );
};

exports.insertNewMessage = (chat_id, sender_id, message, time) => {
  return db
    .query(
      `INSERT INTO messages (
    chat_id,
    sender_id,
    message,
    sent_at
  )
  VALUES (?, ?, ?, ?)`,
      [chat_id, sender_id, message, time]
    )
    .then((messageData) => {
      const newMessageId = messageData[0].insertId;
      return newMessageId;
    });
};

exports.updateChatById = (message, time, chat_id, sender_id) => {
  return db.query(
    `
  UPDATE chats
  SET last_message = ?, last_message_time = ?
  WHERE chat_id = ? AND user1_id = ? OR chat_id = ? AND user2_id = ?`,
    [message, time, chat_id, sender_id, chat_id, sender_id]
  );
};
