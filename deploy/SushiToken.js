 module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  await deploy("SwivelToken", {
    from: deployer,
    log: true,
    deterministicDeployment: false
  })
  
   const reward = await ethers.getContract("SwivelToken")

   if (await reward.owner() !== dev) {
     // Transfer Reward Ownership to Chef
     console.log("Transfer Reward Ownership to dev")
     await (await reward.transferOwnership(dev)).wait()
   }
   
   
}

module.exports.tags = ["SwivelToken"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
