process.env.NODE_ENV = "test";
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const data = require("../db/data/test-data/index");
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

beforeEach(() => {
  return seed(data);
});

after("all", () => db.end());

describe("Users", () => {
  describe("POST /api/user/register", () => {
    it("should successfully post a user to the database and respond with a status 201 and the user data", async () => {
      chai
        .request(app)
        .post("/api/users/register")
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
          expect(res).to.have.status(201);
          expect(userData).to.have.property("user_id");
          expect(userData).to.have.property("username");
          expect(userData).to.have.property("first_name");
          expect(userData).to.have.property("last_name");
          expect(userData).to.have.property("email");
          expect(userData).to.have.property("post_code");
          expect(userData).to.have.property("town_or_city");
          expect(userData).to.have.property("house_number");
          expect(userData).to.have.property("street");
          expect(userData).to.have.property("basket");
          expect(userData).to.have.property("login_attempts");
          expect(userData).to.have.property("locked_till");
          expect(userData).to.have.property("created_at");
        });
    });

    it("should respond with a status 400 and an error message if passed invalid data", async () => {
      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid email or password");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@example.com",
          password: "thisisabadpassword",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid email or password");
        });
    });

    it("should respond with a status 400 and an error if missing a required field", async () => {
      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@",
          password: "P@ssw0rd",
          post_code: "12345",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@",
          password: "P@ssw0rd",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          email: "testuser123@",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          last_name: "User",
          email: "testuser123@",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          first_name: "Test",
          last_name: "User",
          email: "testuser123@",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
        });
    });

    it("should respond a status 409 and an error if a user already exists with an email or username", async () => {
      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "jalkin0",
          first_name: "Jasen",
          last_name: "Alkin",
          email: "jalkin0@odnoklassniki.rd",
          password: "yE4`h6|86#(",
          post_code: "48942",
          town_or_city: "Kranggan",
          house_number: "93",
          street: "Messerschmidt",
          created_at: "2023/03/07",
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.msg).to.equal("Username already in use");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "jalkin",
          first_name: "Jasen",
          last_name: "Alkin",
          email: "jalkin0@odnoklassniki.ru",
          password: "yE4`h6|86#(",
          post_code: "48942",
          town_or_city: "Kranggan",
          house_number: "93",
          street: "Messerschmidt",
          created_at: "2023/03/07",
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.msg).to.equal("Email already in use");
        });
    });
  });

  describe("POST /api/users/login", () => {
    it("should respond with a status 200 and an object containing the users data if passed a matching email and password", async () => {
      const res = await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#(",
      });
      const userData = res.body.user;
      expect(res).to.have.status(200);
      expect(userData).to.have.property("user_id");
      expect(userData).to.have.property("username");
      expect(userData).to.have.property("first_name");
      expect(userData).to.have.property("last_name");
      expect(userData).to.have.property("email");
      expect(userData).to.have.property("post_code");
      expect(userData).to.have.property("town_or_city");
      expect(userData).to.have.property("house_number");
      expect(userData).to.have.property("street");
      expect(userData).to.have.property("basket");
      expect(userData).to.have.property("login_attempts");
      expect(userData).to.have.property("locked_till");
      expect(userData).to.have.property("created_at");
    });

    it("should respond with a status 401 and an error message if passed an incorrect email or password", async () => {
      const res1 = await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#",
      });
      expect(res1).to.have.status(401);
      expect(res1.body.msg).to.equal("Invalid email or password");

      const res2 = await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.r",
        password: "yE4`h6|86#(",
      });

      expect(res2).to.have.status(401);
      expect(res2.body.msg).to.equal("Invalid email or password");
    });

    it("should respond with a status 403 and an error message after the login attempt limit is exceeded and lock the account to future login attempt", async () => {
      await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#",
      });

      await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#",
      });

      await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#",
      });

      const res = await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#(",
      });

      expect(res).to.have.status(403);
      expect(res.body.msg).to.equal(
        "This Account Is temporarily locked due to failed login attempts"
      );
    });

    it("should respond with a status 400 and an error message if a required field is missing", async () => {
      const res1 = await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.ru",
      });
      expect(res1).to.have.status(400);
      expect(res1.body.msg).to.equal("Missing field Password");

      const res2 = await chai.request(app).post("/api/users/login").send({
        password: "yE4`h6|86#(",
      });

      expect(res2).to.have.status(400);
      expect(res2.body.msg).to.equal("Missing field Email");
    });
  });

  describe("DELETE /api/users/:user_id", () => {
    it("should successfully delete a user then respond with a status 204", async () => {
      const deleteRes = await chai.request(app).delete("/api/users/1");
      expect(deleteRes).to.have.status(204);

      const loginRes = await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#(",
      });

      expect(loginRes).to.have.status(401);
      expect(loginRes.body.msg).to.equal("Invalid email or password");
    });

    it("should respond with a status 404 and an error message if passed an id that doesn't exist", async () => {
      chai
        .request(app)
        .delete("/api/users/20")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.msg).to.equal("Not Found");
        });
    });

    it("should respond with a status 400 and an error message if passed an invalid value", async () => {
      chai
        .request(app)
        .delete("/api/users/potato")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Bad Request");
        });
    });
  });
});

describe("Products", () => {
  describe("POST /api/products", () => {
    it("should successfully post a product and respond with a status 201", () => {
      chai
        .request(app)
        .post("/api/products")
        .send({
          seller_id: 4,
          product_name: "Test Item",
          description: "Test Worked if this is listed",
          price: 1.21,
          stock: 1,
          category: "testing",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
        });
    });

    it("should respond with a status 400 if passed incomplete product information", () => {
      chai
        .request(app)
        .post("/api/products")
        .send({
          seller_id: 4,
          product_name: "Test Item",
          description: "Test Failed if this is listed",
          price: 1.21,
          stock: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
        });
    });
  });
});
