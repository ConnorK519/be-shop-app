const app = require("./app");

const { PORT = 5050 } = process.env;

app.listen(PORT, () => {
  console.log("Server is listening on port 5050...");
});
