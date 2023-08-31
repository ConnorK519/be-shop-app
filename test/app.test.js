process.env.NODE_ENV = "test";
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

after("all", () => db.end());
