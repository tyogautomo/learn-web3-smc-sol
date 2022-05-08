require('dotenv').config();

const Web3 = require('web3');
const HdWalletProvider = require('@truffle/hdwallet-provider');

const { abi, evm } = require('./compile');

const provider = new HdWalletProvider(process.env.TEST_PHRASE, process.env.TEST_RINKEBY_NODE)

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`deploying contract from account ${accounts[0]} ...`);

  const deployedContract = await new web3.eth
    .Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ['First contract!'] })
    .send({ from: accounts[0], gas: '1000000' });

  console.log(`\n`);
  console.log(`Contract successfully deployed to Rinkeby network with address: ${deployedContract.options.address}`);
  console.log('Go check on Rinkeby Etherscan.');

  // address : 0x8F1f94F869e1ed81df886B813F74d7aaC4F5031D
  provider.engine.stop();
};

deploy();
