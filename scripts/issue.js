const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [issuer, owner, _] = await hre.ethers.getSigners();
  const deployedAddress = fs.readFileSync(".deployed", "utf-8");
  console.log(`Target Contract: ${deployedAddress}`);
  const drivingLicenseTokenContract = await hre.ethers.getContractAt(
    "DrivingLicenseToken",
    deployedAddress
  );

  const argv = process.argv;
  if (argv.length < 3) {
    throw new Error("tokenId not specified");
  }
  const tokenId = process.argv[2];

  const txResponse = await drivingLicenseTokenContract
    .connect(issuer)
    .issueDrivingLicense(owner.address, tokenId);

  txResponse
    .wait()
    .then((receipt) => {
      console.log(`DrivingLicense #${tokenId} issued to ${owner.address}`);
    })
    .catch((error) => {
      console.log(`failed: ${error.reason}`);
    });

  const _owner = await drivingLicenseTokenContract
    .connect(owner)
    .getDrivingLicenseOwner(tokenId);
  console.log(`current owner of token #${tokenId}: ${_owner}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
