// DOM Content Loaded Event Listener
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  init();
});

// Initialize your app
function init() {
  // Your initialization code here
  document
    .getElementById("encrypt")
    .addEventListener("click", encryptString, false);
}

// Example utility functions
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

async function encryptString() {
  const output = document.getElementById("output");
  const input = getId("input").value;
  const jsonInput = { text: input };
  const res = await fetch(`/api/encryption/hashes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonInput),
  });
  const data = await res.json();
  if (res.status !== 200) {
    output.innerHTML = data.message;
  } else {
    output.innerHTML = makeNiceTable(data.message);
  }
}
