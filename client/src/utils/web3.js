import Web3 from "web3";

const web3 = new Web3(window.ethereum);
web3.eth.handleRevert = true

export default web3;
