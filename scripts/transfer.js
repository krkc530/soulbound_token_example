const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [_, owner, receiver] = await hre.ethers.getSigners();
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

  console.log(`Trying to transfer #${tokenId} to ${receiver.address}...`);
  const txResponse = await drivingLicenseTokenContract
    .connect(owner)
    .transferFrom(owner.address, receiver.address, tokenId);

  txResponse
    .wait()
    .then((receipt) => {
      console.log(
        `DrivingLicense #${tokenId} transferred to ${receiver.address}`
      );
    })
    .catch((error) => {
      console.log(`failed: ${error.reason}`);
    });

  const _owner = await drivingLicenseTokenContract
    .connect(owner)
    .getDrivingLicenseOwner(tokenId);
  console.log(`current owner of #{tokenId}: ${_owner}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
