module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const reward = await ethers.getContract("SwivelToken")
  
  const { address } = await deploy("MasterChef", {
    from: deployer,
    args: [reward.address, dev, "1000000000000000000", "11000000", "100000000"],
    log: true,
    deterministicDeployment: false
  })

  if (await reward.owner() !== address) {
    // Transfer Reward Ownership to Chef
    console.log("Transfer Reward Ownership to Chef")
    await (await reward.transferOwnership(address)).wait()
  }

  const masterChef = await ethers.getContract("MasterChef")
  if (await masterChef.owner() !== dev) {
    // Transfer ownership of MasterChef to dev
    console.log("Transfer ownership of MasterChef to dev")
    await (await masterChef.transferOwnership(dev)).wait()
  }
}

module.exports.tags = ["MasterChef"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "SwivelToken"]
