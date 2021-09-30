const { REWARD_ADDRESS } = require("@ammswap/sdk");

module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments;

  const { deployer, dev } = await getNamedAccounts();

  const chainId = await getChainId();

  let rewardAddress;

  if (chainId === "31337") {
    rewardAddress = (await deployments.get("RewardToken")).address;
  } else if (chainId in REWARD_ADDRESS) {
    rewardAddress = REWARD_ADDRESS[chainId];
  } else {
    throw Error("No REWARD!");
  }

  await deploy("MiniChefV2", {
    from: deployer,
    args: [rewardAddress],
    log: true,
    deterministicDeployment: false,
  });

  const miniChefV2 = await ethers.getContract("MiniChefV2");
  if ((await miniChefV2.owner()) !== dev) {
    console.log("Transfer ownership of MiniChef to dev");
    await (await miniChefV2.transferOwnership(dev, true, false)).wait();
  }
};

module.exports.tags = ["MiniChefV2"];
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
