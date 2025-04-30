const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const methods = require("../modules/encryptionMethods");
const rsaMethods = require("../modules/rsaMethods");

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
  const { text } = req.body;
  console.log(text);
  if (!text) {
    res.status(400).json({ message: "No input provided" });
    return;
  }
  try {
    const string = await encryptString(text);
    const jsonString = JSON.stringify(string);
    res.status(200).json({ message: jsonString });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Encryption failed" });
  }
});

router.route("/symkey").post(async (req, res) => {
  const text = req.body.text;
  const mode = req.body.mode;
  const key = req.body.key;
  const newKey = Buffer.from(key, "hex");
  if (!text) {
    res.status(400).json({ message: "No input provided" });
    return;
  }
  if (!mode) {
    res.status(400).json({ message: "No mode provided" });
    return;
  }
  if (!key) {
    res.status(400).json({ message: "No key provided" });
    return;
  }
  if (!(newKey.byteLength === 32)) {
    console.log(newKey.byteLength);
    res.status(400).json({ message: "Invalid key length" });
    return;
  }
  switch (mode) {
    case 1:
      //encrypt
      const encrypted = methods.encryptAES(text, newKey);
      res.status(200).json({ message: encrypted });
      return;
    case 2:
      //decrypt
      try {
        const decrypted = methods.decryptAES(text, newKey);
        res.status(200).json({ message: decrypted });
      } catch (error) {
        res.status(400).json({ message: "Decryption failed" });
      }
      return;
  }
  res.status(400).json({ message: "Unknown error!" });
});
router.route("/symkey").get(async (req, res) => {
  const key = methods.genKey();
  res.status(200).json({ key: key.toString("hex") });
});

router.route("/asymkeys").get(async (req, res) => {
  const keys = await rsaMethods.generateKeyPair();
  console.log(keys.publicKey);
  res.status(200).json({message: "ok"})
});

module.exports = router;
