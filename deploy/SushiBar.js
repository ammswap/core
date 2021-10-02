module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const reward = await deployments.get("SwivelToken")

  await deploy("SwivelStaked", {
    from: deployer,
    args: [reward.address],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["SwivelStaked"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "SwivelToken"]
