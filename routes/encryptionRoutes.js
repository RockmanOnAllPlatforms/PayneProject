const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

function encryptString(input) {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(input, salt, function (err, hash) {
      return hash;
    });
  });
}

router.route("/").get((req, res) => {
  res.status(200).send("Encryption Route");
});

router.route("/:msg").post((req, res) => {
  if (req.params.msg === undefined) {
    res.status(400).send("No message provided");
  }
  var string = encryptString(req.params.msg);
  console.log(string);
  res.status(200).json({ message: string });
});

module.exports = router;
