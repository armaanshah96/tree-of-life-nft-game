import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import "./SelectCharacter.css";
import Game from "../../utils/Game.json";
import Character from "../Character";

const SelectCharacter = ({ setCharacterNft }) => {
  const [defaultCharacters, setDefaultCharacters] = useState([]);
  const [gameContract, setGameContract] = useState();

  const mintCharacterNftAction = async (characterIndex) => {
    try {
      if (gameContract) {
        console.log("Minting new character");

        const mintTxn = await gameContract.mintCharacterNft(characterIndex);
        await mintTxn.wait();

        console.log("New character minted", mintTxn);
      }
    } catch (error) {
      console.log("Something went wrong minting a new character", error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Game.abi, signer);

      setGameContract(contract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    try {
      const fetchCharacters = async () => {
        const charactersTxn = await gameContract.getDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);

        const characterList = charactersTxn.map((contractCharacter) =>
          transformCharacterData(contractCharacter)
        );
        setDefaultCharacters(characterList);
      };

      const onCharacterMint = async (sender, tokenId, characterIndex) => {
        console.log(
          `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
        );

        if(gameContract) {
          const characterNft = await gameContract.checkIfUserHasNft();
          console.log('Character NFT: ', characterNft);
          setCharacterNft(characterNft)
        }
      };

      if (gameContract) {
        fetchCharacters();
        gameContract.on('CharacterNftMinted', onCharacterMint);
      }

      return () => {
        gameContract && gameContract.off('CharacterNftMinted', onCharacterMint);
      }
    } catch (error) {
      console.log("Something went wrong while fetching all characters", error);
    }
  }, [gameContract, setCharacterNft]);

  return (
    <div className="select-character-container">
      <h2>Mint your player and support the tree of life</h2>
      <div className="character-grid">
        {defaultCharacters.length > 0 && defaultCharacters.map((character) => {
          return (
            <Character
              mintCharacterNftAction={mintCharacterNftAction}
              key={character.name}
              {...character}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SelectCharacter;
