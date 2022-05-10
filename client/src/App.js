import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

import styles from './App.module.css'
import { NETWORKS } from './utils/constants';
import lotteryContract from './utils/contracts/lottery';
import web3 from './utils/web3';

function App() {
  const [manager, setManager] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentChain, setCurrentChain] = useState('');
  const [contractBalance, setContractBalance] = useState('');
  const [players, setPlayers] = useState(0);
  const [inputValue, setInputValue] = useState(0);

  const [contractError, setContractError] = useState(null);

  useEffect(() => {
    checkAccounts();

    window.ethereum.on('chainChanged', chain => {
      setCurrentChain(Number(chain));
    })

    window.ethereum.on('accountsChanged', accounts => {
      setCurrentChain('');
      setCurrentAddress(accounts[0])
    })
  }, []);

  useEffect(() => {
    getInitialData();
  }, [currentChain]);

  const checkAccounts = async () => {
    const provider = await detectEthereumProvider();
    if (provider) { // provider == window.ethereum;
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        setCurrentAddress(accounts[0]);
        setCurrentChain(Number(window.ethereum.networkVersion));
      }
    }
  };

  const loginMetamask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentChain(Number(window.ethereum.networkVersion));
        setCurrentAddress(accounts[0]);
      } else {
        alert('Please install Metamask Chrome plugin.')
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const changeNetwork = async () => {
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x4' }] });
  };

  const getInitialData = async () => {
    try {
      setContractError(null);

      const manager = await lotteryContract.methods.manager().call();
      const contractBalance = await web3.eth.getBalance(lotteryContract.options.address);
      const players = await lotteryContract.methods.getPlayers().call();

      setContractBalance(contractBalance);
      setPlayers(players.length);
      setManager(manager);
    } catch (error) {
      setContractError(error);
    }
  };

  const enter = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await lotteryContract.methods.enterGame().send({
      from: accounts[0],
      value: web3.utils.toWei('0.011', 'ether'),
    });
  };

  const onChange = (e) => {
    setInputValue(e.target.value);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>Account: <span>{currentAddress ? currentAddress : 'Not Logged In.'}</span></div>
      </div>
      <div className={styles.spacer} />
      <div className={styles.title}>Super Lottery</div>
      <div className={styles.subtitle}>This Lottery game Manager / Owner is:</div>
      <div className={styles.manager}>{contractError ? 'change to Rinkeby to see' : manager}</div>
      <div className={styles.players}>There are currently {players} player(s) joined the lottery.</div>
      <div className={styles.balance}>Competing {web3.utils.fromWei(contractBalance, 'ether')} Ether!</div>
      <div className={styles.divider} />
      {currentAddress && currentChain !== NETWORKS.RINKEBY && (
        <>
          <div>This game only using Rinkeby network chain, please change the network to Rinkeby</div>
          <button className={styles.alertBtn} onClick={changeNetwork}>CHANGE NETWORK</button>
        </>
      )}
      {!currentAddress && (
        <>
          <div>This Game need Metamask Account, Please Login to continue</div>
          <button className={styles.login} onClick={loginMetamask}>LOGIN METAMASK</button>
        </>
      )}
      {currentAddress && currentChain === NETWORKS.RINKEBY && (
        <>
          <form>
            <h2>Try your Luck maybe?</h2>
            <div className={styles.inputCont}>
              <input
                type="text"
                pattern="[0-9]*"
                value={inputValue}
                onChange={onChange}
              />
              <h4>Ether</h4>
            </div>
            <button onClick={enter} className={styles.join}>JOIN THE GAME!</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
