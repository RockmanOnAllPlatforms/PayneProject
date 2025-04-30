const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

function tableToString(hashes) {
  return {
    input_hashes: hashes.map((hash, index) => ({
      hash: hash,
    })),
    total_hashes: hashes.length,
    timestamp: new Date().toISOString(),
  };
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

router.route("/hashes").post(async (req, res) => {
  const input = req.body;
  console.log("server " + input);
  if (input === undefined) {
    res.status(400).json({ message: "No input provided" });
    return;
  }
  try {
    const string = await encryptString(input);
    const jsonString = JSON.stringify(string);
    res.status(200).json({ message: jsonString });
  } catch (error) {
    res.status(500).json({ message: "Encryption failed" });
  }
});

module.exports = router;
