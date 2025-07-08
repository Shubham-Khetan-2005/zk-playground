

## 🔐 Zero-Knowledge Proof System Using Circom + Groth16

### ✅ Statement Proven:
> “I know a secret `x` such that `Poseidon(x) = H`, without revealing `x`.”

---

## 🧠 Core Features

- **Privacy-Preserving**: Your secret stays local.
- **On-Chain Verifiability**: Deploy proofs to Ethereum.
- **Efficient**: ~200k gas for Groth16 verification.

---

## 🛠️ Prerequisites

- Node.js ≥ 18.x
- Rust toolchain
- `snarkjs`
- Circom binary for your OS

Install (macOS/Linux):

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
curl -L https://github.com/iden3/circom/releases/latest/download/circom-<platform> -o circom
chmod +x circom && sudo mv circom /usr/local/bin/
```

To verify 
```
circom --version
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Shubham-Khetan-2005/zk-playground.git
cd zk-playground
npm install
npm install -g snarkjs
npm install -D circomlib
```

### 2. Compile the Circuit

```bash
mkdir build
circom circuits/preimage.circom --r1cs --wasm --sym -o build
```

### 3. Trusted Setup

#### Phase 1: Universal Powers of Tau

```bash
npx snarkjs powersoftau new bn128 12 build/pot12_0000.ptau -v
echo "my entropy" | npx snarkjs powersoftau contribute build/pot12_0000.ptau build/pot12_0001.ptau --name="first contrib" -v
npx snarkjs powersoftau prepare phase2 build/pot12_0001.ptau build/pot12_final.ptau -v
```

#### Phase 2: Circuit-specific

```bash
npx snarkjs groth16 setup build/preimage.r1cs build/pot12_final.ptau build/preimage_0000.zkey
echo "final contrib" | npx snarkjs zkey contribute build/preimage_0000.zkey build/preimage_final.zkey --name="me" -v
npx snarkjs zkey export verificationkey build/preimage_final.zkey build/verification_key.json
```

### 4. Generate a Proof

Make your own input.json using the help of input.example.json

```bash
node build/preimage_js/generate_witness.js build/preimage_js/preimage.wasm input.json build/witness.wtns

npx snarkjs groth16 prove build/preimage_final.zkey build/witness.wtns build/proof.json build/public.json
```

### 5. Verify Locally

```bash
npx snarkjs groth16 verify build/verification_key.json build/public.json build/proof.json
```

✅ Expected: `[INFO] snarkJS: OK!`

---

## 🔗 On-Chain Verification (Ethereum)

### 1. Generate Verifier Contract

```bash
npx snarkjs zkey export solidityverifier build/preimage_final.zkey contracts/Verifier.sol
```

### 2. Setup Hardhat Project

```bash
npx hardhat init
mkdir contracts scripts
mv build/Verifier.sol contracts/
```

### 3. Deploy the Verifier

**Terminal 1 (local node):**

```bash
npx hardhat node
```

**Terminal 2 (deployment):**

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Generate Calldata & Verify

```bash
node scripts/generate-calldata.js
npx hardhat console --network localhost
```

In console:

```javascript
const verifier = await ethers.getContractAt("Groth16Verifier", "DEPLOYED_ADDRESS");
const calldata = require("./calldata.json");
await verifier.verifyProof(...calldata); // Should return: true
```

---

## 📁 Project Structure

```
zk-playground/
├── circuits/preimage.circom       # ZK Circuit
├── contracts/Verifier.sol         # Solidity Verifier
├── scripts/
│   ├── deploy.js
│   └── generate-calldata.js
├── build/                         # Compiled Artifacts
├── input.json                     # Private Input
├── calldata.json                  # Proof Data
└── README.md
```

---

## 🧾 Circuit Logic (`preimage.circom`)

```circom
pragma circom 2.0.0;
include "../node_modules/circomlib/circuits/poseidon.circom";

template Preimage() {
    signal input x;
    signal output hash;
    component h = Poseidon(1);
    h.inputs[0] <== x;
    hash <== h.out;
}

component main = Preimage();
```

---

## 🔒 Security Best Practices To actually be Zero Knowledge 😏

**Never Commit:**

- `input.json`
- `witness.wtns`
- `calldata.json`
- `.env` / private keys

**Safe to Share:**

- `verification_key.json`
- `proof.json`
- `public.json`
- `Verifier.sol`

---

## 🎉 What it is Basically

✅ Complete ZK system with:

- A custom Circom circuit
- Groth16 trusted setup
- Local & on-chain proof verification
- Strong privacy via ZK
- Gas-efficient verifier (~200k gas)

---
