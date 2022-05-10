const assert = require('assert');
const ganache = require('ganache');
const { describe } = require('mocha');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const { lotteryContractCmp: { abi, evm } } = require('../compile');

let accounts = [];
let lotteryContract = null;

describe('Super Lottery Testing', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lotteryContract = await new web3.eth
      .Contract(abi)
      .deploy({ data: evm.bytecode.object })
      .send({ from: accounts[0], gas: '3000000' });
  });

  describe('- Super Lottery', () => {
    it('deploys a contract', function () {
      assert.ok(lotteryContract.options.address);
    });
    it('has a manager method', function () {
      assert.ok(lotteryContract.methods.manager);
    });
    it('has a players method', function () {
      assert.ok(lotteryContract.methods.players);
    });
    it('has a getPlayers method', function () {
      assert.ok(lotteryContract.methods.getPlayers);
    });
    it('has an owner/manager', async function () {
      const manager = await lotteryContract.methods.manager().call();
      assert.ok(manager);
    });
    it('has initial empty array of players', async function () {
      const players = await lotteryContract.methods.getPlayers().call();
      assert.equal(players.length, 0);
    });
    it('should return error if owner join a game', function () {
      await lotteryContract.methods.enter()
    })
  });
});
