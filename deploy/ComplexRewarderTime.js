module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  // const masterChefv2 = await ethers.getContract("MasterChefV2")
  // const reward = await ethers.getContract("SwivelToken")

  // const { address } = await deploy("ComplexRewarderTime", {
  //   from: deployer,
  //   args: [reward.address, "1000000000000000000", masterChefv2.address],
  //   log: true,
  //   deterministicDeployment: false
  // })



  // const complexRewarderTime = await ethers.getContract("ComplexRewarderTime")
  // if (await complexRewarderTime.owner() !== dev) {
  //   // Transfer ownership of MasterChef to dev
  //   console.log("Transfer ownership of complexRewarderTime to dev")
  //   await (await complexRewarderTime.transferOwnership(dev, true, true)).wait()
  // }
}

module.exports.tags = ["ComplexRewarderTime"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02","SwivelToken"]
