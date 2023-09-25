const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

let projectId = process.env.GOOGLE_CLOUD_PROJECT;
let credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);

exports.storageClient = new Storage({
  projectId,
  credentials,
});

const storage = multer.memoryStorage();
const limits = { fileSize: 5 * 1024 * 1024, files: 1 };
const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("Incorrect File Type"), false);
  }
};

exports.bucketName = process.env.GOOGLE_CLOUD_BUCKET;

exports.upload = multer({
  storage,
  fileFilter,
  limits,
});
