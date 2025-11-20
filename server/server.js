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
  // Ensure p is treated as a standard number for Math.random range calculation
  const range = Number(p) - 2; 
  // Generate random number (standard JS Number) and convert to BigInt
  const b = Math.floor(Math.random() * range) + 2; 
  return BigInt(b); // Return as BigInt
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

  // 1. Convert incoming Number parameters to BigInt
  const g_big = BigInt(g);
  const p_big = BigInt(p);
  const x_big = BigInt(x);

  // 2. Generate random private key 'b' (returns BigInt)
  const b_big = randomB(p_big); // Note: We pass p_big to ensure range consistency

  // 3. Perform WASM calculations with BigInts
  // y = g^b mod p
  const y_big = wasm._modexp(g_big, b_big, p_big);
  
  // K = x^b mod p (Shared Secret)
  const K_big = wasm._modexp(x_big, b_big, p_big); 

  // 4. Convert results back to standard JavaScript Number for JSON response
  const y = Number(y_big);
  const K = Number(K_big);

  res.json({ K, y });
});