const { error } = require("console");
const crypto = require("crypto");
const fs = require("fs");
var globalIv;

fs.readFile("./iv.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  globalIv = Buffer.from(data, "hex");
});

function genKey() {
  return crypto.randomBytes(32);
}

// Encryption
function encryptAES(plaintext, key) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, globalIv);
  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");
  return ciphertext;
}

// Decryption
function decryptAES(ciphertext, key) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, globalIv);
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

exports.encryptAES = encryptAES;
exports.decryptAES = decryptAES;
exports.genKey = genKey;
