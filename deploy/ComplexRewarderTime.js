module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const masterChefv2 = await ethers.getContract("MasterChefV2")
  const rewardAddress = '0x12017c89444624c0268a1053467e22954f4fd362';

  const { address } = await deploy("ComplexRewarderTime", {
    from: deployer,
    args: [rewardAddress, "277700000000000", masterChefv2.address],
    log: true,
    deterministicDeployment: false
  })



  const complexRewarderTime = await ethers.getContract("ComplexRewarderTime")
  if (await complexRewarderTime.owner() !== dev) {
    // Transfer ownership of MasterChef to dev
    console.log("Transfer ownership of complexRewarderTime to dev")
    await (await complexRewarderTime.transferOwnership(dev, true, true)).wait()
  }
}

module.exports.tags = ["ComplexRewarderTime"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02","SwivelToken"]
