# Diffie–Hellman Key Exchange (WASM + Node.js + JavaScript)

This project implements the Diffie–Hellman shared secret key exchange between a client and server, using WebAssembly (WASM) compiled from the provided `myProg.c` file.  
The implementation strictly follows the Cryptography Lab Test assignment instructions.

---

## Overview

### Client Responsibilities
- Accept inputs **p** and **g** from the user.
- Generate private key **a ∈ Z\*_p** using JavaScript.
- Compute:
  ```
  x = g^a mod p
  ```
  using **WebAssembly (WASM)**.
- Send `<g, p, x>` to the server.
- Display:
  - Private key `a`
  - Server public key `y`
  - Shared key `K`

### Server Responsibilities
- Receive `<g, p, x>` from the client.
- Generate private key **b ∈ Z\*_p** using JavaScript.
- Compute using WASM:
  ```
  y = g^b mod p
  K = x^b mod p
  ```
- Return `<K, y>` to the client.

---

## Project Structure

```
crypto-wasm-next/
│
├── client/
│   └── index.html
│
├── client_server/
│   ├── client_server.js
│   └── package.json
│
├── server/
│   ├── server.js
│   └── package.json
│
└── wasm/
    ├── myProg.c
    └── myProg.wasm
```

---

## Compiling WebAssembly

Inside the `wasm/` folder, compile the provided C file:

```bash
emcc myProg.c -O3   -s WASM_BIGINT=1   -s STANDALONE_WASM=1   -s EXPORTED_FUNCTIONS="['_modexp']"   -Wl,--no-entry   -o myProg.wasm
```

This generates:

```
myProg.wasm
```

---

## Running the Backend Server

```bash
cd server
npm install
node server.js
```

Backend runs at:

```
http://localhost:5000
```

---

## Running the Frontend Server

```bash
cd client_server
npm install
node client_server.js
```

Frontend runs at:

```
http://localhost:3000
```

---

## Usage Instructions

1. Open browser and visit:

   ```
   http://localhost:3000
   ```

2. Enter values for **p** and **g**.
3. Click **Compute**.
4. The page will display:
   - Client private key `a`
   - Server public key `y`
   - Shared secret key `K`

---

## MD5 Digest for Submission

To generate MD5 hash of your project folder:

```bash
cd ..
md5sum -b crypto-wasm-next/* > digest.txt
```

---

## Notes
- WebAssembly is used for all modular exponentiation operations.
- `WASM_BIGINT=1` allows 64-bit integer (`uint64_t`) operations safely.
- The project follows the assignment specification exactly.

---

## Author
Satish Kumar  
Introduction to Cryptography – Lab Test  
Session: July–Dec 2025
