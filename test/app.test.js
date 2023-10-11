process.env.NODE_ENV = "test";
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const data = require("../db/data/test-data/index");
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const requester = chai.request(app).keepOpen();

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
          expect(res.body.msg).to.equal("Missing a required input field");
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
          expect(res.body.msg).to.equal("Missing a required input field");
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
          expect(res.body.msg).to.equal("Missing a required input field");
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
          expect(res.body.msg).to.equal("Missing a required input field");
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
          email: "testuser123@example.com",
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
          email: "testuser123@example.com",
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
          email: "testuser123@example.com",
          password: "P@ssw0rd",
          post_code: "12345",
          town_or_city: "Testville",
          house_number: "456",
          street: "Sample Street",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Missing a required input field");
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
          expect(res.body.msg).to.equal("Invalid fields invalidField");
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
          done();
        });
    });

    it("should respond with a status 400 and an error message if passed an incorrect email or password", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          email: "jalkin0@odnoklassniki.ru",
          password: "yE4`h6|86#",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid email or password");
        });

      chai
        .request(app)
        .post("/api/users/login")
        .send({
          email: "jalkin0@odnoklassniki.r",
          password: "yE4`h6|86#(",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.msg).to.equal("Invalid email or password");
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
  });

  //   describe("DELETE /api/users/:user_id", () => {
  //     it("should successfully delete a user then respond with a status 204", async () => {
  //       const deleteRes = await chai.request(app).delete("/api/users/1");
  //       expect(deleteRes).to.have.status(204);

  //       const loginRes = await chai.request(app).post("/api/users/login").send({
  //         email: "jalkin0@odnoklassniki.ru",
  //         password: "yE4`h6|86#(",
  //       });

  //       expect(loginRes).to.have.status(401);
  //       expect(loginRes.body.msg).to.equal("Invalid email or password");
  //     });

  //     it("should respond with a status 404 and an error message if passed an id that doesn't exist", async () => {
  //       chai
  //         .request(app)
  //         .delete("/api/users/20")
  //         .end((err, res) => {
  //           expect(res).to.have.status(404);
  //           expect(res.body.msg).to.equal("Not Found");
  //         });
  //     });

  //     it("should respond with a status 400 and an error message if passed an invalid value", async () => {
  //       chai
  //         .request(app)
  //         .delete("/api/users/potato")
  //         .end((err, res) => {
  //           expect(res).to.have.status(400);
  //           expect(res.body.msg).to.equal("Bad Request");
  //         });
  //     });
  //   });
  // });
});

// describe("Products", () => {
//   describe("POST /api/products", () => {
//     it("should successfully post a product and respond with a status 201", () => {
//       chai
//         .request(app)
//         .post("/api/products")
//         .send({
//           seller_id: 4,
//           product_name: "Test Item",
//           description: "Test Worked if this is listed",
//           price: 1.21,
//           stock: 1,
//           category: "testing",
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(201);
//         });
//     });

//     it("should respond with a status 400 if passed incomplete product information", () => {
//       chai
//         .request(app)
//         .post("/api/products")
//         .send({
//           seller_id: 4,
//           product_name: "Test Item",
//           description: "Test Failed if this is listed",
//           price: 1.21,
//           stock: 1,
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(400);
//         });
//     });
// });
