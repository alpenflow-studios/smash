import { ethers } from 'hardhat';

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60; // 1 minute from now

  const lockedAmount = ethers.parseEther('0.001');

  const lock = await ethers.deployContract('Lock', [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(lockedAmount)} ETH deployed to ${await lock.getAddress()}`
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
