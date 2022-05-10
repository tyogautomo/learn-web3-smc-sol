const assert = require('assert');
const ganache = require('ganache');
const { desribe } = require('mocha');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const { lotteryContractCmp: { abi, evm } } = require('../compile');