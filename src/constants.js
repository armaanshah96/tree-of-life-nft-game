export const CONTRACT_ADDRESS = '0x55020BD062b356DcFc372F696167a0B92d0Fc4d6';

export const transformCharacterData = character => {
    return {
      index: character.index.toNumber(),
      name: character.name,
      imageURI: character.imageURI,
      growthInfluence: character.growthInfluence,
      fruitCollected: character.fruitCollected.toNumber()
    };
  }
