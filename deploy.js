require('dotenv').config();

const Web3 = require('web3');
const HdWalletProvider = require('@truffle/hdwallet-provider');

const {
  inboxContractCmp: { abi: inboxAbi, evm: inboxEvm },
  lotteryContractCmp: { abi: lotteryAbi, evm: lotteryEvm },
} = require('./compile');

const provider = new HdWalletProvider(process.env.TEST_PHRASE, process.env.TEST_RINKEBY_NODE)

const web3 = new Web3(provider); // using provider from truffle and infura node

const getUserInput = () => {
  const argvs = process.argv;
  argvs.splice(0, 2);
  return argvs[0];
}

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`deploying contract from account ${accounts[0]} ...`);

  let deployedContract = null;
  switch (getUserInput()) {
    case 'inbox':
      deployedContract = await new web3.eth
        .Contract(inboxAbi)
        .deploy({ data: inboxEvm.bytecode.object, arguments: ['First contract!'] })
        .send({ from: accounts[0], gas: '1000000' });
      break;
    case 'lottery':
      deployedContract = await new web3.eth
        .Contract(lotteryAbi)
        .deploy({ data: lotteryEvm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000' });
      break;
    default:
      break;
  }

  console.log(`\n`);
  if (deployedContract) {
    console.log(`Contract successfully deployed to Rinkeby network with address: ${deployedContract?.options?.address}`);
    console.log('Go check on Rinkeby Etherscan.');
  } else {
    console.log('No contract deployed, specify the contract on argument');
  }

  // address : 0x8F1f94F869e1ed81df886B813F74d7aaC4F5031D // inbox contract
  // address : 0xb3DDe169eBBe0D7e6cc0c2d4C143bf9cF4A03a1c // lottery contract
  provider.engine.stop();
};

deploy();
