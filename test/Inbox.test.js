const assert = require('assert');
const ganache = require('ganache');
const { describe } = require('mocha');
const Web3 = require('web3');

const { abi, evm } = require('../compile');
const { INITIAL_MESSAGE, NEW_MESSAGE } = require('../utils/constants');

const web3 = new Web3(ganache.provider()); // connect to local test network

let accounts = [];
let inboxContract = null;

describe('Inbox Testing', () => {
  // this will run every "it" case
  beforeEach(async () => {
    // get all accounts
    accounts = await web3.eth.getAccounts();
    // create the contract instance and deploy it
    inboxContract = await new web3.eth
      .Contract(abi) // tells web3 what methods an inbox/this contract has
      .deploy({ data: evm.bytecode.object, arguments: [INITIAL_MESSAGE] }) // tells web3 to create new contract/ transaction object
      .send({ from: accounts[0], gas: '1000000' }); // tells web3 to send out this transaction to local test network
  })

  describe('- Inbox', () => {
    it('deploys a contract', function () {
      assert.ok(inboxContract.options.address);
    });
    it('have a message method', function () {
      assert.ok(inboxContract.methods.message);
    });
    it('have an initial message', async function () {
      const message = await inboxContract.methods.message().call();
      assert.ok(message);
    });
    it(`initial message should return "${INITIAL_MESSAGE}"`, async function () {
      const message = await inboxContract.methods.message().call();
      assert.equal(message, INITIAL_MESSAGE);
    })
    it('should have setMessage method', function () {
      assert.ok(inboxContract.methods.setMessage);
    });
    it(`can change message to "${NEW_MESSAGE}"`, async function () {
      await inboxContract.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] });
      const message = await inboxContract.methods.message().call();
      assert.equal(message, NEW_MESSAGE);
    })
  })
})