import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, transformTreeData } from "../../constants";
import "./Arena.css";
import Game from "../../utils/Game.json";

const Arena = ({ characterNft, setCharacterNft }) => {
  const [gameContract, setGameContract] = useState();
  const [tree, setTree] = useState({});
  const [supportStatus, setSupportStatus] = useState("");

  const supportTreeAction = async () => {
    try {
      if (gameContract) {
        setSupportStatus("supporting");
        console.log("Supporting tree of life");

        const supportTxn = await gameContract.supportTreeOfLife();
        await supportTxn.wait();
        console.log("Support Transaction:", supportTxn);
        setSupportStatus("supported");
      }
    } catch (error) {
      console.log(
        "Something went wrong when supporting the Tree of Life!",
        error
      );
      setSupportStatus("");
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
      const fetchTreeOfLife = async () => {
        const treeTxn = await gameContract.getTreeOfLife();
        console.log("treeTxn:", treeTxn);

        setTree(transformTreeData(treeTxn));
      };

      const onTreeSupported = (treeHealth, treeMaxHealth, treeFruitToBear) => {
        console.log(
          `TreeSupported - New tree growth needed: ${
            treeMaxHealth - treeHealth
          }, Tree fruit to bear: ${treeFruitToBear}`
        );

        setTree((prevState) => {
          return {
            ...prevState,
            health: treeHealth,
            maxHealth: treeMaxHealth,
            fruitToBear: treeFruitToBear,
          };
        });
      };

      const onPlayerCollectsFruit = (playerName, fruitCollected) => {
        console.log(
          `Player Collected Fruit! ${playerName} now has ${fruitCollected} fruit`
        );

        setCharacterNft((prevState) => {
          return { ...prevState, fruitCollected: fruitCollected };
        });
      };
      if (gameContract) {
        fetchTreeOfLife();
        gameContract.on("TreeSupportEnd", onTreeSupported);
        gameContract.on("PlayerCollectsFruit", onPlayerCollectsFruit);
      }
    } catch (error) {
      console.log("Something went wrong while fetching all characters", error);
    }
  }, [gameContract, setCharacterNft, setTree]);

  return (
    <div className="arena-container">
      <h2>Feed the tree!</h2>
      {tree && (
        <div className="tree-container">
          <div className={`tree-content ${supportStatus}`}>
            <h2>🌲 The Tree Of Life 🌲</h2>
            <div className="image-content">
              <img src={tree.imageURI} alt={"Tree of Life"} />
              <div className="health-bar">
                <progress value={tree.health} max={tree.maxHealth} />
                <p>{`Growth Needed: ${tree.maxHealth - tree.health}`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`Fruit To Bear: ${tree.fruitToBear}`}</h4>
            </div>
          </div>
          <div className="support-container">
            <button className="cta-button" onClick={supportTreeAction}>
              {`Support the Tree of Life`}
            </button>
          </div>
        </div>
      )}
      {characterNft && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNft.name}</h2>
                <div className="influence-bar">
                  <progress value={characterNft.growthInfluence} />
                  <p>{`Growth Influence: ${characterNft.growthInfluence}`}</p>
                </div>
                <img
                  src={characterNft.imageURI}
                  alt={`Character ${characterNft.name}`}
                />
              </div>
              <div className="stats">
                <h4>{`Total Fruit Collected: ${characterNft.fruitCollected}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;
