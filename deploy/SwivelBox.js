const { WNATIVE } = require("@ammswap/sdk");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments;

    const { deployer, dev } = await getNamedAccounts();

    const chainId = await getChainId();

    let wethAddress;

    if (chainId === "31337") {
        wethAddress = (await deployments.get("WETH9Mock")).address;
    } else if (chainId in WNATIVE) {
        wethAddress = WNATIVE[chainId].address;
    } else {
        throw Error("No WNATIVE!");
    }

    const factoryAddress = (await deployments.get("UniswapV2Factory")).address;

    await deploy("SwivelBoxV1", {
        from: deployer,
        args: [wethAddress],
        log: true,
        deterministicDeployment: false,
    });

    const treasureChest = await ethers.getContract("SwivelBoxV1")
    if (await treasureChest.owner() !== dev) {
        // Transfer ownership of TreasureChestV1 to dev
        console.log("Transfer ownership of SwivelBox to dev")
        await (await treasureChest.transferOwnership(dev, true, true)).wait()
    }



};




module.exports.tags = ["SwivelBox"];
module.exports.dependencies = ["UniswapV2Factory", "Mocks"];