const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

function tableToString(table) {
  
}

async function encryptString(input) {
  let hashes = [];
  for (let i = 0; i < 5; i++) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(input, salt);
    hashes.push(hash);
  }
  return tableToString(hashes);
}

router.route("/").get((req, res) => {
  res.status(200).send("Encryption Route");
});

router.route("/:msg").post(async (req, res) => {
  if (req.params.msg === undefined) {
    res.status(400).send("No message provided");
  }
  try {
    const string = await encryptString(req.params.msg);
    console.log(string);
    res.status(200).json({ message: string });
  } catch (error) {
    res.status(500).json({ error: "Encryption failed" });
  }
});

module.exports = router;
