import { expect } from "chai";
import { prepare, deploy, getBigNumber, createSLP } from "./utilities"

describe("RewardMaker", function () {
  before(async function () {
    await prepare(this, ["RewardMaker", "StakeReward", "RewardMakerExploitMock", "ERC20Mock", "UniswapV2Factory", "UniswapV2Pair"])
  })

  beforeEach(async function () {
    await deploy(this, [
      ["reward", this.ERC20Mock, ["REWARD", "REWARD", getBigNumber("10000000")]],
      ["dai", this.ERC20Mock, ["DAI", "DAI", getBigNumber("10000000")]],
      ["mic", this.ERC20Mock, ["MIC", "MIC", getBigNumber("10000000")]],
      ["usdc", this.ERC20Mock, ["USDC", "USDC", getBigNumber("10000000")]],
      ["weth", this.ERC20Mock, ["WETH", "ETH", getBigNumber("10000000")]],
      ["strudel", this.ERC20Mock, ["$TRDL", "$TRDL", getBigNumber("10000000")]],
      ["factory", this.UniswapV2Factory, [this.alice.address]],
    ])
    await deploy(this, [["bar", this.StakeReward, [this.reward.address]]])
    await deploy(this, [["rewardMaker", this.RewardMaker, [this.factory.address, this.bar.address, this.reward.address, this.weth.address]]])
    await deploy(this, [["exploiter", this.RewardMakerExploitMock, [this.rewardMaker.address]]])
    await createSLP(this, "rewardEth", this.reward, this.weth, getBigNumber(10))
    await createSLP(this, "strudelEth", this.strudel, this.weth, getBigNumber(10))
    await createSLP(this, "daiEth", this.dai, this.weth, getBigNumber(10))
    await createSLP(this, "usdcEth", this.usdc, this.weth, getBigNumber(10))
    await createSLP(this, "micUSDC", this.mic, this.usdc, getBigNumber(10))
    await createSLP(this, "rewardUSDC", this.reward, this.usdc, getBigNumber(10))
    await createSLP(this, "daiUSDC", this.dai, this.usdc, getBigNumber(10))
    await createSLP(this, "daiMIC", this.dai, this.mic, getBigNumber(10))
  })
  describe("setBridge", function () {
    it("does not allow to set bridge for Reward", async function () {
      await expect(this.rewardMaker.setBridge(this.reward.address, this.weth.address)).to.be.revertedWith("RewardMaker: Invalid bridge")
    })

    it("does not allow to set bridge for WETH", async function () {
      await expect(this.rewardMaker.setBridge(this.weth.address, this.reward.address)).to.be.revertedWith("RewardMaker: Invalid bridge")
    })

    it("does not allow to set bridge to itself", async function () {
      await expect(this.rewardMaker.setBridge(this.dai.address, this.dai.address)).to.be.revertedWith("RewardMaker: Invalid bridge")
    })

    it("emits correct event on bridge", async function () {
      await expect(this.rewardMaker.setBridge(this.dai.address, this.reward.address))
        .to.emit(this.rewardMaker, "LogBridgeSet")
        .withArgs(this.dai.address, this.reward.address)
    })
  })
  describe("convert", function () {
    it("should convert REWARD - ETH", async function () {
      await this.rewardEth.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.convert(this.reward.address, this.weth.address)
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.rewardEth.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.reward.balanceOf(this.bar.address)).to.equal("1897569270781234370")
    })

    it("should convert USDC - ETH", async function () {
      await this.usdcEth.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.convert(this.usdc.address, this.weth.address)
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.usdcEth.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.reward.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("should convert $TRDL - ETH", async function () {
      await this.strudelEth.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.convert(this.strudel.address, this.weth.address)
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.strudelEth.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.reward.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("should convert USDC - REWARD", async function () {
      await this.rewardUSDC.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.convert(this.usdc.address, this.reward.address)
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.rewardUSDC.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.reward.balanceOf(this.bar.address)).to.equal("1897569270781234370")
    })

    it("should convert using standard ETH path", async function () {
      await this.daiEth.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.convert(this.dai.address, this.weth.address)
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.daiEth.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.reward.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("converts MIC/USDC using more complex path", async function () {
      await this.micUSDC.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.setBridge(this.usdc.address, this.reward.address)
      await this.rewardMaker.setBridge(this.mic.address, this.usdc.address)
      await this.rewardMaker.convert(this.mic.address, this.usdc.address)
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.micUSDC.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.reward.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("converts DAI/USDC using more complex path", async function () {
      await this.daiUSDC.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.setBridge(this.usdc.address, this.reward.address)
      await this.rewardMaker.setBridge(this.dai.address, this.usdc.address)
      await this.rewardMaker.convert(this.dai.address, this.usdc.address)
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.daiUSDC.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.reward.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("converts DAI/MIC using two step path", async function () {
      await this.daiMIC.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.setBridge(this.dai.address, this.usdc.address)
      await this.rewardMaker.setBridge(this.mic.address, this.dai.address)
      await this.rewardMaker.convert(this.dai.address, this.mic.address)
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.daiMIC.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.reward.balanceOf(this.bar.address)).to.equal("1200963016721363748")
    })

    it("reverts if it loops back", async function () {
      await this.daiMIC.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.setBridge(this.dai.address, this.mic.address)
      await this.rewardMaker.setBridge(this.mic.address, this.dai.address)
      await expect(this.rewardMaker.convert(this.dai.address, this.mic.address)).to.be.reverted
    })

    it("reverts if caller is not EOA", async function () {
      await this.rewardEth.transfer(this.rewardMaker.address, getBigNumber(1))
      await expect(this.exploiter.convert(this.reward.address, this.weth.address)).to.be.revertedWith("RewardMaker: must use EOA")
    })

    it("reverts if pair does not exist", async function () {
      await expect(this.rewardMaker.convert(this.mic.address, this.micUSDC.address)).to.be.revertedWith("RewardMaker: Invalid pair")
    })

    it("reverts if no path is available", async function () {
      await this.micUSDC.transfer(this.rewardMaker.address, getBigNumber(1))
      await expect(this.rewardMaker.convert(this.mic.address, this.usdc.address)).to.be.revertedWith("RewardMaker: Cannot convert")
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.micUSDC.balanceOf(this.rewardMaker.address)).to.equal(getBigNumber(1))
      expect(await this.reward.balanceOf(this.bar.address)).to.equal(0)
    })
  })

  describe("convertMultiple", function () {
    it("should allow to convert multiple", async function () {
      await this.daiEth.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardEth.transfer(this.rewardMaker.address, getBigNumber(1))
      await this.rewardMaker.convertMultiple([this.dai.address, this.reward.address], [this.weth.address, this.weth.address])
      expect(await this.reward.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.daiEth.balanceOf(this.rewardMaker.address)).to.equal(0)
      expect(await this.reward.balanceOf(this.bar.address)).to.equal("3186583558687783097")
    })
  })
})
