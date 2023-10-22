const dayjs = require("dayjs");

const {
  selectChatsByUserId,
  selectMessagesByChatId,
  selectChatByUsers,
  insertNewChat,
  insertNewMessage,
  updateChatById,
} = require("../models/messages.models");

const { selectUsersForChat } = require("../models/users.models");

exports.getChatsByUserId = (req, res, next) => {
  const { user_id } = req.params;
  return selectChatsByUserId(user_id)
    .then((chats) => {
      res.status(200).send({ chats });
    })
    .catch(next);
};

exports.getMessagesByChatId = (req, res, next) => {
  const { chat_id } = req.params;
  return selectMessagesByChatId(chat_id)
    .then((messages) => {
      res.status(200).send({ messages });
    })
    .catch(next);
};

exports.postNewChatOrGetChat = (req, res, next) => {
  const { user1_id, user2_id } = req.body;

  const checkForChat = new Promise((resolve, reject) => {
    const numberCheck = !isNaN(user1_id) && !isNaN(user2_id);
    const positiveCheck = user1_id > 0 && user2_id > 0;

    if (!user1_id || !user2_id) {
      return reject({ status: 400, msg: "Missing a user id" });
    }

    if (user1_id === user2_id) {
      return reject({ status: 400, msg: "Can't message yourself" });
    }

    if (numberCheck && positiveCheck) {
      resolve(selectChatByUsers(user1_id, user2_id));
    } else {
      reject({ status: 400, msg: "One or both user ids are invalid" });
    }
  });

  checkForChat
    .then((chat) => {
      if (chat) {
        return [chat];
      }
      return Promise.all([chat, selectUsersForChat(user1_id, user2_id)]);
    })
    .then(([chat, users]) => {
      if (!chat) {
        if (users.length === 2) {
          return insertNewChat(user1_id, user2_id);
        } else {
          return Promise.reject({
            status: 404,
            msg: "One or both users don't exist",
          });
        }
      }
      return chat;
    })
    .then((chat) => {
      if (Array.isArray(chat)) {
        return { chat_id: chat[0].insertId };
      }
      return chat;
    })
    .then((chat) => {
      const id = chat.chat_id;
      return selectMessagesByChatId(id);
    })
    .then((messages) => {
      res.status(200).send({ messages });
    })
    .catch(next);
};

exports.postMessageToChatById = (req, res, next) => {
  const { chat_id } = req.params;
  const { sender_id, message } = req.body;
  const currentDate = dayjs().format("YYYY-MM-DD HH-mm-ss");
  const chatIdCheck = isNaN(chat_id) || chat_id < 0;
  const senderIdCheck = isNaN(sender_id) || sender_id < 0;

  const patchChat = new Promise((resolve, reject) => {
    if (chatIdCheck || senderIdCheck) {
      return reject({ status: 400, msg: "One or more invalid ids" });
    }
    resolve(updateChatById(message, currentDate, chat_id, sender_id));
  });

  patchChat
    .then((patchData) => {
      const patchSuccess = patchData[0].affectedRows;

      if (patchSuccess) {
        return insertNewMessage(chat_id, sender_id, message, currentDate);
      }
      return Promise.reject({ status: 404, msg: "No chat found" });
    })
    .then((newMessageId) => {
      res.status(201).send({ newMessageId });
    })
    .catch(next);
};
