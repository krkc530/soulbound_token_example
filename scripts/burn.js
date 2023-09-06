const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [issuer] = await hre.ethers.getSigners();
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

  console.log(`Trying to burn #${tokenId} from issuer...`);
  const txResponse = await drivingLicenseTokenContract
    .connect(issuer)
    .burnDrivingLicense(tokenId);

  txResponse
    .wait()
    .then((receipt) => {
      console.log(`DrivingLicense #${tokenId} is burned`);
    })
    .catch((error) => {
      console.log(`failed: ${error.reason}`);
    });

  const _owner = await drivingLicenseTokenContract
    .connect(issuer)
    .getDrivingLicenseOwner(tokenId);
  console.log(`current owner of #{tokenId}: ${_owner}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
