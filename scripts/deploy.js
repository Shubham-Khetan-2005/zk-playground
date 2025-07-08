const hre = require("hardhat");

async function main() {
  // exact contract name in the artifact
  const Verifier = await hre.ethers.getContractFactory("Groth16Verifier");

  // start the deployment tx
  const verifier = await Verifier.deploy();

  // OLD (breaks) : await verifier.deployed();
  await verifier.waitForDeployment();          // ✅ new helper

  console.log("Verifier deployed to:", await verifier.getAddress()); // ✅
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
