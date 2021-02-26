const ChatUsers = artifacts.require('./ChatUsers.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('ChatUsers', ([deployer, author, tipper]) => {
  let chatUsers

  before(async () => {
    chatUsers = await ChatUsers.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await chatUsers.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await chatUsers.name()
      assert.equal(name, 'ChatUsers')
    })
  })
})