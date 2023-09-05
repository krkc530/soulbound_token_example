const { expect } = require("chai");

describe("DrivingLicenseToken", function () {
  async function setup() {
    const [issuer, owner, receiver] = await hre.ethers.getSigners();

    const drivingLicenseTokenContractFactory =
      await hre.ethers.getContractFactory("DrivingLicenseToken");
    const drivingLicenseTokenContract =
      await drivingLicenseTokenContractFactory.deploy();
    await drivingLicenseTokenContract.deployed();

    const tokenId = 1;

    await drivingLicenseTokenContract
      .connect(issuer)
      .issueDrivingLicense(owner.address, tokenId);

    return { drivingLicenseTokenContract, issuer, owner, receiver, tokenId };
  }

  describe("given a driving license souldbound token, locked, and only burnable by the issuer", () => {
    describe("when the owner tries to transfer his token", async () => {
      it("fails to transfer the token because it's locked", async () => {
        const { drivingLicenseTokenContract, owner, receiver, tokenId } =
          await setup();

        await expect(
          drivingLicenseTokenContract
            .connect(owner)
            .transferFrom(owner.address, receiver.address, tokenId)
        ).to.be.revertedWithCustomError(
          drivingLicenseTokenContract,
          "ErrLocked"
        );

        expect(
          await drivingLicenseTokenContract
            .connect(owner)
            .getDrivingLicenseOwner(tokenId)
        ).to.be.equal(owner.address);
      });
    });

    describe("when the issuer tries to transfer the token", () => {
      it("fails to transfer the token because it's not his token", async () => {
        const {
          drivingLicenseTokenContract,
          issuer,
          owner,
          receiver,
          tokenId,
        } = await setup();

        await expect(
          drivingLicenseTokenContract
            .connect(issuer)
            .transferFrom(owner.address, receiver.address, tokenId)
        ).to.be.revertedWith(/ERC721: caller is not token owner or approved/);

        expect(
          await drivingLicenseTokenContract
            .connect(issuer)
            .getDrivingLicenseOwner(tokenId)
        ).to.be.equal(owner.address);
      });
    });

    describe("when the owner tries to burn his token", () => {
      it("fails because he's not allowed to", async () => {
        const { drivingLicenseTokenContract, owner, tokenId } = await setup();

        await expect(
          drivingLicenseTokenContract.connect(owner).burnDrivingLicense(tokenId)
        ).to.be.revertedWith(
          /The set burnAuth doesn't allow you to burn this token/
        );

        expect(
          await drivingLicenseTokenContract
            .connect(owner)
            .getDrivingLicenseOwner(tokenId)
        ).to.be.equal(owner.address);
      });
    });

    describe("when the issuer tries to burn the token", () => {
      it("success because he is allowed to", async () => {
        const { drivingLicenseTokenContract, issuer, tokenId } = await setup();

        await expect(
          drivingLicenseTokenContract
            .connect(issuer)
            .burnDrivingLicense(tokenId)
        ).not.to.be.reverted;

        expect(
          await drivingLicenseTokenContract
            .connect(issuer)
            .getDrivingLicenseOwner(tokenId)
        ).to.be.equal("0x0000000000000000000000000000000000000000");
      });
    });
  });
});
