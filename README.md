# Diffie–Hellman Key Exchange (Cryptography Lab Assignment)

This project implements the Diffie–Hellman shared secret key establishment between a client and a server, exactly according to the given lab assignment requirements.

The computation of:
- g^a mod p  
- g^b mod p  
- x^b mod p  

is performed using WebAssembly (WASM) compiled from the provided `myProg.c`.

---

## Project Structure

dh_lab/
├── client/
│   └── index.html
├── client_server/
│   └── client_server.js
├── server/
│   └── server.js
└── wasm/
    ├── myProg.c
    └── myProg.wasm

---

## How to Run

### 1. Compile WebAssembly

Inside the `wasm/` folder:

emcc myProg.c -O3   -s WASM_BIGINT=1   -s STANDALONE_WASM=1   -s EXPORTED_FUNCTIONS="['_modexp']"   -Wl,--no-entry   -o myProg.wasm

### 2. Start Backend Server

cd server  
npm install  
node server.js  

Runs at: http://localhost:5000

### 3. Start Frontend Server

cd client_server  
npm install  
node client_server.js  

Runs at: http://localhost:3000

---

## Usage

1. Open http://localhost:3000  
2. Enter p and g  
3. Click Compute  
4. You will see:  
   - a (client private key)  
   - y (server public key)  
   - K (shared secret key)

---

## MD5 Digest for Submission

cd ..  
md5sum -b dh_lab/* > digest.txt

---

## Author

Satish Kumar  
Introduction to Cryptography Lab Test  
Session: July–Dec 2025
