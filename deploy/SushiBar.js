module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const reward = await deployments.get("RewardToken")

  await deploy("StakeReward", {
    from: deployer,
    args: [reward.address],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["StakeReward"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "RewardToken"]
