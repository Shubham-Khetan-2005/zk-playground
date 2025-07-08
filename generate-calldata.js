const snarkjs = require("snarkjs");
const fs = require("fs");

async function main() {
    // Read the proof and public signals files
    const proof = JSON.parse(fs.readFileSync("build/proof.json", "utf8"));
    const publicSignals = JSON.parse(fs.readFileSync("build/public.json", "utf8"));
    
    // Generate the calldata array [a, b, c, input]
    const calldata = [
        [proof.pi_a[0], proof.pi_a[1]],
        [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],
        [proof.pi_c[0], proof.pi_c[1]],
        publicSignals
    ];
    
    // Write to calldata.json
    fs.writeFileSync("calldata.json", JSON.stringify(calldata, null, 2));
    console.log("Calldata generated successfully");
}

main().catch(console.error);
