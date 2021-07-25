import { tokens, ether, ETHER_ADDRESS, expectRevert, expectEvent } from './helpers'

const NFT = artifacts.require('./NFT')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('NFT', ([acc1, acc2]) => {
  let nft

  beforeEach(async () => {
    console.log("Creating new contract");
    nft = await NFT.new()
  })

  describe('deploy and test...', () => {
    it('...name', async () => {
      expect(await nft.name()).to.be.eq('Dapp University')
    })

    it('...symbol', async () => {
      expect(await nft.symbol()).to.be.eq('DAPPU')
    })

    it('...owner address', async () => {
      expect(await nft._owner()).to.be.eq(acc1)
    })
  })


  describe('deploy, mint, buy, changePrice and test...', () => {
    let result

    beforeEach(async () => {
      console.log("Minting 2 tokens");
      await nft.mint('token_uri_1', ether(0.01))
//      await nft.mint('token_uri_2', ether(0.02))
      result = await nft.buy('1', {from: acc2, value: ether(0.01)})
      result = await nft.changePrice('1', ether(0.03), {from: acc2, value: ether(0.2)})

    })

    it('...new owner', async () => {
      expect(await nft.ownerOf('1')).to.be.eq(acc2)
    })

    it("...sold status", async () => {
      expect(await nft.sold('1')).to.eq(true)
    })

    it("...changed Price", async () => {
      expect(await nft.price('1')).to.eq(ether(0.03))
    })


    it("...event values", () => {
      expectEvent.inLogs(result.logs, 'Purchase', {
        owner: acc2,
        price: ether(0.01),
        id: '1',
        uri: 'token_uri_1'
      })
    })

    it("...sold status", async () => {
      expect(await nft.sold('1')).to.eq(true)
    })

    it("+ test if rejects buying for invalid id, msg.value and status", async () => {
      expectRevert(nft.buy('1', {from: acc2, value: ether(0.01)}), "Error, wrong Token id")
      expectRevert(nft.buy('2', {from: acc2, value: ether(0.01)}), "Error, Token costs more")
      expectRevert(nft.buy('3', {from: acc2, value: ether(0.02)}), "Error, Token is sold")
    })

  })

})




