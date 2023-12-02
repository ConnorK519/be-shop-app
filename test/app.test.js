process.env.NODE_ENV = "test";
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const data = require("../db/data/test-data/index");
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const sorted = require("chai-sorted");

chai.use(sorted);
chai.use(chaiHttp);

after("all", () => {
  db.end();
});

describe("User", () => {
  describe("POST /api/user/register", () => {
    beforeEach(() => {
      return seed(data);
    });
    it("should successfully post a user to the database and respond with a status 201 and the user data", (done) => {
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
          expect(res).to.have.status(201);
          expect(res.headers).to.have.property("authorization");
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed an invalid email or password", (done) => {
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
          expect(res.body.msg).to.equal("Invalid email");
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
          expect(res.body.msg).to.equal("Invalid password");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@",
          password: "thisisabadpassword",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid email and password");
          done();
        });
    });

    it("should respond with a status 400 and an error if missing a required field", (done) => {
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
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing required input field street");
        });

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
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field house number"
          );
        });

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
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field town or city"
          );
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@example.com",
          password: "P@ssw0rd",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field post code"
          );
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          last_name: "User",
          email: "testuser123@example.com",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field password"
          );
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
          expect(res.body.msg).to.equal("Missing required input field email");
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          first_name: "Test",
          email: "testuser123@example.com",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field last name"
          );
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
          username: "testuser123",
          last_name: "User",
          email: "testuser123@example.com",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field first name"
          );
        });

      chai
        .request(app)
        .post("/api/users/register")
        .send({
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
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field username"
          );
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed data with invalid fields or values", (done) => {
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
          invalidField: "Invalid",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid field invalidField");
        });

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
          invalidField1: "Invalid",
          invalidField2: "Invalid",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Invalid fields invalidField1, invalidField2"
          );
          done();
        });
    });

    it("should respond with a status 409 and an error if a user already exists with an email or username", (done) => {
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
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.msg).to.equal("Email already in use");
          done();
        });
    });
  });

  describe("POST /api/users/login", () => {
    beforeEach(() => {
      return seed(data);
    });
    it("should respond with a status 200 and an object containing the users data if passed a matching email and password", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          email: "jalkin0@odnoklassniki.ru",
          password: "yE4`h6|86#(",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.headers).to.have.property("authorization");
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed an incorrect email or password", async () => {
      const res1 = await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#",
      });

      expect(res1).to.have.status(400);
      expect(res1.body.msg).to.equal("Invalid email or password");

      const res2 = await chai.request(app).post("/api/users/login").send({
        email: "jalkin0@odnoklassniki.r",
        password: "yE4`h6|86#(",
      });
      expect(res2).to.have.status(400);
      expect(res2.body.msg).to.equal("Invalid email or password");
      /*
          I know this is inconsistent, but I built a new pc and my tests started failing for no reason on the new machine changing this to an async function seems 
          to have fixed the weird bug where it would pass at times, but fail at others I have checked manually and the test are returning expected responses
          */
    });

    it("should respond with a status 400 and an error message if a required field is missing", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          email: "jalkin0@odnoklassniki.ru",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing field password");
        });

      chai
        .request(app)
        .post("/api/users/login")
        .send({
          password: "yE4`h6|86#(",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing field email");
          done();
        });
    });

    it("should respond with a status 403 and an error message after the login attempt limit is exceeded and lock the account to future login attempt", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          email: "jalkin0@odnoklassniki.ru",
          password: "yE4`h6|86#",
        })
        .then((res) => {
          return chai.request(app).post("/api/users/login").send({
            email: "jalkin0@odnoklassniki.ru",
            password: "yE4`h6|86#",
          });
        })
        .then((res) => {
          return chai.request(app).post("/api/users/login").send({
            email: "jalkin0@odnoklassniki.ru",
            password: "yE4`h6|86#",
          });
        })
        .then((res) => {
          return chai.request(app).post("/api/users/login").send({
            email: "jalkin0@odnoklassniki.ru",
            password: "yE4`h6|86#(",
          });
        })
        .then((res) => {
          expect(res).to.have.status(403);
          expect(res.body.msg).to.equal(
            "This Account Is temporarily locked due to failed login attempts"
          );
          done();
        });
    });
  });

  describe("PATCH /api/users", () => {
    beforeEach(() => {
      return seed(data);
    });
    let token;
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#(",
      })
      .end((err, res) => {
        token = res.headers.authorization;
      });
    it("should respond with a status 200 and a message after successfully updating a user", (done) => {
      chai
        .request(app)
        .patch("/api/users")
        .set("authorization", token)
        .send({ username: "newUsername" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.msg).to.equal("User updated");
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed bad fields", (done) => {
      chai
        .request(app)
        .patch("/api/users")
        .set("authorization", token)
        .send({ bad_field: "this field should cause an error" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid field bad field");
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed an empty object", (done) => {
      chai
        .request(app)
        .patch("/api/users")
        .set("authorization", token)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("No valid fields found to update");
          done();
        });
    });
    /*
    -------------Tests Invalidated by the implementation of jwt this comment is to document previous implementation-----------
    it("should respond with a status 400 and an error message when passed an invalid id type", (done) => {
      chai
        .request(app)
        .patch("/api/users/userID")
        .send({ username: "newUsername" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid user id");
          done();
        });
    });

        it("should respond with a status 404 and an error message when passed a user id that doesn't exist", (done) => {
      chai
        .request(app)
        .patch("/api/users/99")
        .send({ username: "newUsername" })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.msg).to.equal("No user found");
          done();
        });
    });
    */
  });

  describe("DELETE /api/users", () => {
    beforeEach(() => {
      return seed(data);
    });
    it("should successfully delete a user then respond with a status 204", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          email: "jalkin0@odnoklassniki.ru",
          password: "yE4`h6|86#(",
        })
        .end((err, res) => {
          chai
            .request(app)
            .delete("/api/users")
            .set("authorization", res.headers.authorization)
            .end((err, res) => {
              expect(res).to.have.status(204);
              return chai
                .request(app)
                .post("/api/users/login")
                .send({
                  email: "jalkin0@odnoklassniki.ru",
                  password: "yE4`h6|86#(",
                })
                .end((err, res) => {
                  expect(res).to.have.status(400);
                  expect(res.body.msg).to.equal("Invalid email or password");
                  done();
                });
            });
        });
    });
    /*
     -------------Tests Invalidated by the implementation of jwt this comment is to document previous implementation-----------
    it("should respond with a status 404 and an error message if passed an id that doesn't exist", (done) => {
      chai
        .request(app)
        .delete("/api/users/20")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.msg).to.equal("No user found");
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed an invalid id", (done) => {
      chai
        .request(app)
        .delete("/api/users/potato")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("invalid user id");
          done();
        });
    });
    */
  });
});

describe("Products", () => {
  describe("GET /api/products", () => {
    beforeEach(() => {
      return seed(data);
    });
    it("should respond with an array of products and a status 200", (done) => {
      chai
        .request(app)
        .get("/api/products")
        .end((err, res) => {
          const { products } = res.body;
          expect(res).to.have.status(200);
          products.forEach((product) => {
            expect(product).to.have.property("product_name");
            expect(product).to.have.property("image");
            expect(product).to.have.property("price");
            expect(product).to.have.property("product_id");
          });
          done();
        });
    });
  });
  describe("GET /api/products/:product_id", () => {
    beforeEach(() => {
      return seed(data);
    });
    it("should respond with a product and a status 200", (done) => {
      chai
        .request(app)
        .get("/api/products/1")
        .end((err, res) => {
          const { product } = res.body;
          expect(res).to.have.status(200);
          expect(product).to.have.property("product_id");
          expect(product).to.have.property("seller_id");
          expect(product).to.have.property("image");
          expect(product).to.have.property("product_name");
          expect(product).to.have.property("description");
          expect(product).to.have.property("price");
          expect(product).to.have.property("stock");
          expect(product).to.have.property("category");
          expect(product).to.have.property("created_at");
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed an invalid id", (done) => {
      chai
        .request(app)
        .get("/api/products/onion")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Invalid product id: onion. id must be a number above 0"
          );
          done();
        });
    });

    it("should respond with a status 404 and an error message if the product doesn't exist", (done) => {
      chai
        .request(app)
        .get("/api/products/99")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.msg).to.equal("Product not found");
          done();
        });
    });
  });
  describe("POST /api/products", () => {
    beforeEach(() => {
      return seed(data);
    });
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#(",
      })
      .end((err, res) => {
        token = res.headers.authorization;
      });
    it("should successfully post a product and respond with a status 201", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .set("authorization", token)
        .send({
          product_name: "Test Item",
          description: "Test Worked if this is listed",
          price: 1.21,
          stock: 1,
          category: "testing",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.msg).to.equal("Product listed");
          done();
        });
    });

    it("should respond with a status 400 if passed incomplete product information", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .set("authorization", token)
        .send({
          description: "Test Failed if this is listed",
          price: 1.21,
          stock: 1,
          category: "testing",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field product name"
          );
        });

      chai
        .request(app)
        .post("/api/products")
        .set("authorization", token)
        .send({
          product_name: "Test Item",
          price: 1.21,
          stock: 1,
          category: "testing",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field description"
          );
        });

      chai
        .request(app)
        .post("/api/products")
        .set("authorization", token)
        .send({
          product_name: "Test Item",
          description: "Test Failed if this is listed",
          stock: 1,
          category: "testing",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing required input field price");
        });

      chai
        .request(app)
        .post("/api/products")
        .set("authorization", token)
        .send({
          product_name: "Test Item",
          description: "Test Failed if this is listed",
          price: 1.21,
          category: "testing",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing required input field stock");
        });

      chai
        .request(app)
        .post("/api/products")
        .set("authorization", token)
        .send({
          product_name: "Test Item",
          description: "Test Failed if this is listed",
          price: 1.21,
          stock: 1,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal(
            "Missing required input field category"
          );
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed an invalid value or values", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .set("authorization", token)
        .send({
          product_name: "Test Item",
          description: "Test Worked if this is listed",
          price: "hello",
          stock: 1,
          category: "testing",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid field price");
          done();
        });
    });
  });
});

describe("Messages", () => {
  describe("GET /api/chats", () => {
    beforeEach(() => {
      return seed(data);
    });
    let token;
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#(",
      })
      .end((err, res) => {
        token = res.headers.authorization;
      });
    it("should respond with an array of the provided users chats in descending order by time of the last message and a status 200", (done) => {
      chai
        .request(app)
        .get("/api/chats")
        .set("authorization", token)
        .end((err, res) => {
          const { chats } = res.body;
          expect(res).to.have.status(200);
          expect(chats).to.be.descendingBy("last_message_time");
          expect(chats).to.have.length(2);
          chats.forEach((chat) => {
            const testUserId = 1;
            const idMatch =
              chat.user1_id === testUserId || chat.user2_id === testUserId
                ? true
                : false;

            expect(idMatch).to.equal(true);
            expect(chat).to.have.property("chat_id");
            expect(chat).to.have.property("last_message_time");
            expect(chat).to.have.property("last_message");
            expect(chat).to.have.property("user1_id");
            expect(chat).to.have.property("user2_id");
            expect(chat).to.have.property("username");
          });
          done();
        });
    });

    /*
   -------------Tests Invalidated by the implementation of jwt this comment is to document previous implementation-----------
    it("should respond with a status 400 and an error message if passed an invalid user id", (done) => {
      chai
        .request(app)
        .get("/api/chats/cheese")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid user id");
          done();
        });
    });

    it("should respond with a status 404 and an error message if the user id does not exist", (done) => {
      chai
        .request(app)
        .get("/api/chats/111")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.msg).to.equal("User not found");
          done();
        });
    });
    */
  });

  describe("GET /api/messages/:chat_id", () => {
    beforeEach(() => {
      return seed(data);
    });
    let token;
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#(",
      })
      .end((err, res) => {
        token = res.headers.authorization;
      });
    it("should respond with a status 200 and an array of messages in descending order by time for the passed chat", (done) => {
      const chatId = 2;
      chai
        .request(app)
        .get(`/api/messages/${chatId}`)
        .set("authorization", token)
        .end((err, res) => {
          const { messages } = res.body;
          expect(res).to.have.status(200);
          expect(messages).to.be.descendingBy("sent_at");
          expect(messages).to.have.length(3);
          messages.forEach((message) => {
            expect(message.chat_id).to.equal(chatId);
            expect(message).to.have.property("chat_id");
            expect(message).to.have.property("message_id");
            expect(message).to.have.property("sender_id");
            expect(message).to.have.property("message");
            expect(message).to.have.property("sent_at");
            expect(message).to.have.property("username");
          });
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed an invalid chat_id", (done) => {
      chai
        .request(app)
        .get("/api/messages/notAnId")
        .set("authorization", token)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid chat id");
          done();
        });
    });
  });
  /*
  -------------Tests Invalidated by the implementation of jwt this comment is to document previous implementation-----------
  it("should respond with a status 200 and an empty array if passed a chat id that does not exist yet", (done) => {
    chai
      .request(app)
      .get("/api/messages/100")
      .end((err, res) => {
        const { messages } = res.body;
        expect(res).to.have.status(200);
        expect(messages).to.have.length(0);
        done();
      });
  });
  */
  describe("POST /api/chats", () => {
    beforeEach(() => {
      return seed(data);
    });
    let token;
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#(",
      })
      .end((err, res) => {
        token = res.headers.authorization;
      });
    it("should successfully post a new chat and respond with the chat id and an empty array of messages with a status 200", (done) => {
      chai
        .request(app)
        .post("/api/chats")
        .set("authorization", token)
        .send({ user2_id: 10 })
        .end((err, res) => {
          const { messages } = res.body;
          const { chat_id } = res.body;
          expect(res).to.have.status(200);
          expect(messages).to.have.length(0);
          expect(res.body).to.have.property("chat_id");
          expect(chat_id).to.equal(11);
          done();
        });
    });
    it("should respond with a status 400 and an error message if missing a user id", (done) => {
      chai
        .request(app)
        .post("/api/chats")
        .set("authorization", token)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a user id");
          done();
        });
    });
    it("should respond with a status 400 and an error if the 2 passed ids are the same", (done) => {
      chai
        .request(app)
        .post("/api/chats")
        .set("authorization", token)
        .send({ user2_id: 1 })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Can't message yourself");
          done();
        });
    });
    it("should respond with a status 400 and an error message if passed invalid ids", (done) => {
      chai
        .request(app)
        .post("/api/chats")
        .set("authorization", token)
        .send({ user2_id: "onion" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("One or both user ids are invalid");
          done();
        });
    });
    it("should respond with a status 404 and an error message if 1 or both of the users don't exist", (done) => {
      chai
        .request(app)
        .post("/api/chats")
        .set("authorization", token)
        .send({ user2_id: 49 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.msg).to.equal("One or both users don't exist");
          done();
        });
    });
  });
  describe("POST /api/messages/:chat_id", () => {
    beforeEach(() => {
      return seed(data);
    });
    let token;
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        email: "jalkin0@odnoklassniki.ru",
        password: "yE4`h6|86#(",
      })
      .end((err, res) => {
        token = res.headers.authorization;
      });
    it("should respond with a status 201 and the id of the new message", (done) => {
      chai
        .request(app)
        .post("/api/messages/2")
        .set("authorization", token)
        .send({ message: "This is a test message" })
        .end((err, res) => {
          const { newMessageId } = res.body;
          expect(res).to.have.status(201);
          expect(newMessageId).to.equal(31);
          done();
        });
    });
  });
});
