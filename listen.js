const app = require("./app");

const { PORT = 9089 } = process.env;

app.listen(() => {
  console.log("Server is listening on port 9089...");
});
