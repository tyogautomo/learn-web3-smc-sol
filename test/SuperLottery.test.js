const assert = require('assert');
const ganache = require('ganache');
const { describe } = require('mocha');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider({ vmErrorsOnRPCResponse: true, vmErrorsOnRPCResponse: true }));
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
    it('should return error if owner join a game', async function () {
      try {
        await lotteryContract.methods.enterGame().send({
          from: accounts[0],
          value: web3.utils.toWei('1', 'ether'),
        });
      } catch (error) {
        assert.equal(error.data.reason, "Owner can't enter the game");
        return;
      }
      assert(false);
    });
    it('should allow a user to join a game and appears on players array', async function () {
      await lotteryContract.methods.enterGame().send({
        from: accounts[1],
        value: web3.utils.toWei('1', 'ether'),
      });

      const players = await lotteryContract.methods.getPlayers().call();
      assert.equal(players.length, 1);
      assert.equal(players[0], accounts[1]);
    });
    it('should allow some users to join the game', async function () {
      await lotteryContract.methods.enterGame().send({
        from: accounts[1],
        value: web3.utils.toWei('1', 'ether'),
      });
      await lotteryContract.methods.enterGame().send({
        from: accounts[2],
        value: web3.utils.toWei('1', 'ether'),
      });
      await lotteryContract.methods.enterGame().send({
        from: accounts[3],
        value: web3.utils.toWei('1', 'ether'),
      });
      const players = await lotteryContract.methods.getPlayers().call();
      assert.equal(players.length, 3);
      assert.equal(players[0], accounts[1]);
      assert.equal(players[1], accounts[2]);
      assert.equal(players[2], accounts[3]);
    });
    it('should return an error if a user try to join twice', async function () {
      try {
        await lotteryContract.methods.enterGame().send({
          from: accounts[1],
          value: web3.utils.toWei('1', 'ether'),
        });
        await lotteryContract.methods.enterGame().send({
          from: accounts[1],
          value: web3.utils.toWei('1', 'ether'),
        });
      } catch (error) {
        assert.equal(error.data.reason, 'User already join the lottery');
        return;
      }
      assert(false);
    });
    it('should return an error if user not pay minimum 0.011 Ether to join the Game.', async function () {
      try {
        await lotteryContract.methods.enterGame().send({
          from: accounts[1],
          to: lotteryContract.options.address,
          value: web3.utils.toWei('0.01', 'ether'),
        });
      } catch (error) {
        assert.equal(error.data.reason, 'Minimum Ether is 0.011 Ether');
        return;
      }
      assert(false);
    });
    it('should return an error if winner determined by non manager/owner', async function () {
      try {
        await lotteryContract.methods.pickWinner().send({
          from: accounts[1],
        });
      } catch (error) {
        assert(error.data.reason, 'only running by Manager.');
        return;
      }
      assert(false);
    });
  });
});
