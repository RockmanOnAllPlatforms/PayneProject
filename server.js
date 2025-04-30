const express = require("express");
const app = express();
const port = 3000;
const rateLimit = require("express-rate-limit");


app.use(express.static("frontend/public"));
app.use(express.json());


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/frontend/views/index.html");
});

app.get("/sources", (req, res) => {
  res.sendFile(__dirname + "/frontend/views/sources.html");
});

app.use("/api/encryption", require("./routes/encryptionRoutes"));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
