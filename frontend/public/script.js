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

async function encryptString() {
  const input = getId("input").value;
  const jsonInput = { text: input };
  console.log("client input:", jsonInput);
  const res = await fetch(`/api/encryption/hashes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonInput),
  });
  const data = await res.json();
  document.getElementById("output").innerHTML = data.message;
}
