// DOM Content Loaded Event Listener
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  init();
});

// Initialize your app
function init() {
  document
    .getElementById("encrypt")
    .addEventListener("click", encryptString, false);

  document
    .getElementById("generate-symmetric-key")
    .addEventListener("click", genSymKey, false);

  document
    .getElementById("symmetric-encrypt")
    .addEventListener("click", encryptSym, false);

  document
    .getElementById("symmetric-decrypt")
    .addEventListener("click", decryptSym, false);
}

// Utility functions
function getId(id) {
  return document.getElementById(id);
}

function getClass(className) {
  return document.getElementsByClassName(className);
}

function makeNiceTable(data) {
  var final = "";
  const parsedData = JSON.parse(data);
  const hashes = parsedData.input_hashes;
  return hashes.map((hash) => hash.hash).join("\n");
}

// Main encryption function
async function encryptString() {
  const output = document.getElementById("output");
  const input = getId("input").value;
  const jsonInput = { text: input };

  try {
    const res = await fetch(`/api/encryption/hashes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonInput),
    });

    const data = await res.json();

    setTimeout(() => {
      let resultText;
      if (res.status !== 200) {
        resultText = data.message;
      } else {
        resultText = makeNiceTable(data.message);
      }

      output.innerHTML = `<span class="output-text-fade">${resultText}</span>`;
    }, delay);
  } catch (err) {
    setTimeout(() => {
      output.innerHTML = `<span class="output-text-fade">An error occurred during encryption.</span>`;
    }, delay);
  }
}

async function genSymKey() {
  const res = await fetch(`/api/encryption/symkey`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const key = await res.json();
  console.log(key.key);
  getId("symmetric-key").value = key.key;
}

async function encryptSym() {
  const input = getId("symmetric-input").value;
  const key = getId("symmetric-key").value;
  const jsonInput = { text: input, mode: 1, key: key };
  const symOutput = getId("symmetric-output");
  const res = await fetch(`/api/encryption/symkey`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonInput),
  });
  const data = await res.json();
  const msg = data.message;
  symOutput.innerHTML = `<span class="output-text-fade">${msg}</span>`;
}

async function decryptSym() {
  const input = getId("symmetric-input").value;
  const key = getId("symmetric-key").value;
  const jsonInput = { text: input, mode: 2, key: key };
  const symOutput = getId("symmetric-output");
  const res = await fetch(`/api/encryption/symkey`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonInput),
  });
  const data = await res.json();
  const msg = data.message;
  symOutput.innerHTML = `<span class="output-text-fade">${msg}</span>`;
}

// Optional delay for simulating loading time
const delay = 0;
