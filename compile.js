const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const lotteryPath = path.resolve(__dirname, 'contracts', 'SuperLottery.sol');

const inboxSource = fs.readFileSync(inboxPath, 'utf-8');
const lotterySource = fs.readFileSync(lotteryPath, 'utf-8');

const input = {
  language: 'Solidity',
  sources: {
    'Inbox.sol': {
      content: inboxSource,
    },
    'SuperLottery.sol': {
      content: lotterySource,
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input)));

const inboxContractCmp = compiled.contracts['Inbox.sol'].Inbox;
const lotteryContractCmp = compiled.contracts['SuperLottery.sol'].SuperLottery;

module.exports = { inboxContractCmp, lotteryContractCmp };