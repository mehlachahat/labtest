// server/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // (1) NEW: Import file system module

const app = express();
app.use(cors());
app.use(express.json());

// Use path.join to serve the root directory of the project reliably
app.use(express.static(path.join(__dirname, '..'))); 

// SERVER-RANDOM b (Corrected to range [1, p-1])
function randomB(p_big) {
  // Assuming p is within safe integer range for Math.random range calculation
  const p_num = Number(p_big); 
  const range = p_num - 1;
  const b = Math.floor(Math.random() * range) + 1; 
  return BigInt(b); 
}

// Import WASM wrapper
const MyProgModule = require("../wasm/myProg.js");

let wasm;

// (2) CRITICAL FIX: Ensure WASM binary loads reliably in Node.js
try {
  // Construct the absolute path to the .wasm file
  const wasmPath = path.join(__dirname, '..', 'wasm', 'myProg.wasm');
  // Synchronously read the .wasm file content into a Buffer
  const wasmBinary = fs.readFileSync(wasmPath);

  // Initialize the module by passing the binary data directly
  MyProgModule({ wasmBinary: wasmBinary }).then(instance => {
    wasm = instance;
    console.log("WASM Loaded on Server");

    // Server starts listening ONLY AFTER WASM is successfully loaded
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });

  }).catch(error => {
      console.error("Failed to initialize WASM module on server:", error);
      process.exit(1);
  });
} catch (error) {
  console.error("Failed to read myProg.wasm file:", error.message);
  process.exit(1);
}

// Handle DH request (Uses BigInts for calculation, strings for transport)
app.post("/dh", (req, res) => {
  if (!wasm) {
    return res.status(503).json({ error: "WASM module not loaded." });
  }
  
  const { g, p, x } = req.body;

  // Convert incoming string parameters to BigInt for WASM compatibility
  const g_big = BigInt(g);
  const p_big = BigInt(p);
  const x_big = BigInt(x); // Client's public key (g^a mod p)

  // Generate server's private key 'b'
  const b_big = randomB(p_big); 

  // WASM Calculation 1: Server's Public Key (y = g^b mod p)
  const y_big = wasm._modexp(g_big, b_big, p_big);
  
  // WASM Calculation 2: Shared Secret Key (K = x^b mod p)
  const K_big = wasm._modexp(x_big, b_big, p_big); 

  // Convert results back to String for JSON response (to maintain precision)
  const y = y_big.toString();
  const K = K_big.toString();

  // Send the correct values
  res.json({ K, y });
});