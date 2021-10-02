module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  // const masterChefv2 = await ethers.getContract("MasterChefV2")
  // const reward = await ethers.getContract("SwivelToken")

  // const { address } = await deploy("ComplexRewarder", {
  //   from: deployer,
  //   args: [reward.address, "5000000000000000000", masterChefv2.address],
  //   log: true,
  //   deterministicDeployment: false
  // })



  // const complexRewarder = await ethers.getContract("ComplexRewarder")
  // if (await complexRewarder.owner() !== dev) {
  //   // Transfer ownership of MasterChef to dev
  //   console.log("Transfer ownership of ComplexRewarder to dev")
  //   await (await complexRewarder.transferOwnership(dev, true, true)).wait()
  // }
}

module.exports.tags = ["ComplexRewarder"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02","SwivelToken"]
