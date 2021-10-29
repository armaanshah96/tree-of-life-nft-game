import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import Game from './utils/Game.json';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';


const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNft, setCharacterNft] = useState(null);

  const checkIfWalletConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Connect MetaMask wallet!");
      } else {
        console.log("Ethereum object present", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length === 0) {
        console.log("No authorized account found");
        return;
      }

      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      // checkIfUserHasNft function on contract -> setCharacter with result
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Connect MetaMask wallet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      console.log("Connected account:", account);
      setCurrentAccount(account);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  useEffect(() => {
    const fetchNftMetadata = async () => {
      console.log('Looking up user for NFT associated with their account', currentAccount);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, Game.abi, signer);

      const txn = await gameContract.checkIfUserHasNft();
      if(txn.name) {
        console.log('User has NFT character type', txn);
        setCharacterNft(transformCharacterData(txn));
      } else {
        console.log('No NFT Found')
      }
    }

    if(currentAccount) {
      console.log("Current account:", currentAccount);
      fetchNftMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🪴 Tree of Life 🌲 </p>
          <p className="sub-text">Team up to grow the tree of life</p>
          <div className="connect-wallet-container">
            {currentAccount ? <SelectCharacter setCharacterNft={setCharacterNft} /> : (
              <button
                className="cta-button connect-wallet-button"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
