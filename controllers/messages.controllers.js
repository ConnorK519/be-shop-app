const dayjs = require("dayjs");

const {
  selectChatsByUserId,
  selectMessagesByChatId,
  insertNewChat,
  insertNewMessage,
  updateChatById,
} = require("../models/messages.models");

const {
  selectUsersAndChat,
  selectUserById,
} = require("../models/users.models");

exports.getChatsByUserId = (req, res, next) => {
  const { user_id } = req.params;

  const checkUser = new Promise((resolve, reject) => {
    const IdCheck = !isNaN(user_id) && user_id > 0;
    if (IdCheck) {
      return resolve(selectUserById(user_id));
    }
    reject({ status: 400, msg: "Invalid user id" });
  });

  checkUser
    .then((user) => {
      if (user) {
        return selectChatsByUserId(user_id);
      }
      return Promise.reject({ status: 404, msg: "User not found" });
    })
    .then((chats) => {
      res.status(200).send({ chats });
    })
    .catch(next);
};

exports.getMessagesByChatId = (req, res, next) => {
  const { chat_id } = req.params;

  const getMessages = new Promise((resolve, reject) => {
    const IdCheck = !isNaN(chat_id) && chat_id > 0;
    if (IdCheck) {
      return resolve(selectMessagesByChatId(chat_id));
    }
    reject({ status: 400, msg: "Invalid chat id" });
  });

  getMessages
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
      resolve(selectUsersAndChat(user1_id, user2_id));
    } else {
      reject({ status: 400, msg: "One or both user ids are invalid" });
    }
  });

  checkForChat
    .then((result) => {
      const chat_id = result[0].chat_id;
      if (chat_id) {
        return [chat_id];
      }
      if (result.length !== 2) {
        return Promise.reject({
          status: 404,
          msg: "One or both users don't exist",
        });
      }
      return Promise.all([chat_id, insertNewChat(user1_id, user2_id)]);
    })
    .then(([chat_id, insertData]) => {
      if (!chat_id) {
        const newChatId = insertData[0].insertId;
        return [newChatId];
      }
      return [chat_id];
    })
    .then(([chat_id]) => {
      return Promise.all([selectMessagesByChatId(chat_id), chat_id]);
    })
    .then(([messages, chat_id]) => {
      res.status(200).send({ messages, chat_id });
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
    if (!message) {
      return reject({ status: 400, msg: "No message input" });
    }
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
