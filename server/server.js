// server/server.js
const express = require("express");
const cors = require("cors");
const path = require("path"); // NEW: Import the path module

const app = express();
app.use(cors());
app.use(express.json());

// FIX: Use path.join to serve the root directory of the project reliably
// The __dirname is the current directory ('server'), so '..' goes up to the project root.
app.use(express.static(path.join(__dirname, '..'))); 

// SERVER-RANDOM b
function randomB(p) {
  return Math.floor(Math.random() * (p - 2)) + 2;
}

// Import WASM for modexp
const MyProgModule = require("../wasm/myProg.js");

let wasm;

// FIX: We wait for the WASM module to load and THEN start the server
MyProgModule().then(instance => {
  wasm = instance;
  console.log("WASM Loaded on Server");

  // Server starts listening ONLY AFTER WASM is successfully loaded
  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });

}).catch(error => {
    console.error("Failed to load WASM module on server:", error);
    process.exit(1); // Exit if critical module fails to load
});

// Handle DH request
app.post("/dh", (req, res) => {
  const { g, p, x } = req.body;

  // 'wasm' is guaranteed to be defined here
  const b = randomB(p);
  const y = wasm._modexp(g, b, p);   // g^b mod p
  const K = wasm._modexp(x, b, p);   // x^b mod p

  res.json({ K, y });
});