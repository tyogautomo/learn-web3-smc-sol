import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

import styles from './App.module.css'
import { NETWORKS } from './utils/constants';
import lotteryContract from './utils/contracts/lottery';

function App() {
  const [manager, setManager] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentChain, setCurrentChain] = useState('');

  useEffect(() => {
    getManagerAddress();
    checkAccounts();
    window.ethereum.on('chainChanged', chain => {
      setCurrentChain(Number(chain));
    })

    window.ethereum.on('accountsChanged', accounts => {
      setCurrentAddress(accounts[0])
    })
  }, []);

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

  const getManagerAddress = async () => {
    const manager = await lotteryContract.methods.manager().call();
    setManager(manager);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>Account: <span>{currentAddress ? currentAddress : 'Not Logged In.'}</span></div>
      </div>
      <div className={styles.spacer} />
      <div className={styles.title}>Super Lottery</div>
      <div className={styles.subtitle}>This Lottery game Manager / Owner is:</div>
      <div className={styles.manager}>{manager}</div>
      <div className={styles.divider} />
      {!currentAddress && (
        <>
          <div>This Game need Metamask Account, Please Login to continue</div>
          <button className={styles.login} onClick={loginMetamask}>LOGIN METAMASK</button>
        </>
      )}
      {currentAddress && currentChain !== NETWORKS.RINKEBY && (
        <>
          <div>This game only using Rinkeby network chain, please change the network to Rinkeby</div>
          <button className={styles.alertBtn} onClick={changeNetwork}>CHANGE NETWORK</button>
        </>
      )}
    </div>
  );
}

export default App;
