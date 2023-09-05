process.env.NODE_ENV = "test";
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const data = require("../db/data/test-data/index");
const chai = require("chai");
const expect = chai.expect();
const should = chai.should();
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

beforeEach(() => {
  return seed(data);
});

after("all", () => db.end());

describe("Users", () => {
  describe("POST /api/user/register", () => {
    it("should successfully post a user to the database", (done) => {
      chai
        .request(app)
        .post("/api/user/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@example.com",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          const userData = res.body.user;
          res.should.have.status(201);
          userData.should.have.property("user_id");
          userData.should.have.property("username");
          userData.should.have.property("first_name");
          userData.should.have.property("last_name");
          userData.should.have.property("email");
          userData.should.have.property("post_code");
          userData.should.have.property("town_or_city");
          userData.should.have.property("house_number");
          userData.should.have.property("street");
          userData.should.have.property("basket");
          userData.should.have.property("login_attempts");
          userData.should.have.property("locked_till");
          userData.should.have.property("created_at");
          done();
        });
    });
  });
});
