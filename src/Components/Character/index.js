import "./Character.css";

const Character = (props) => {
  return (
    <div className="character-item">
      <div className="name-container">
        <p>{props.name}</p>
      </div>
      <img alt={props.name} src={props.imageURI} />
      <button
        type="button"
        className="character-mint-button"
        onClick={() => props.mintCharacterNftAction(props.index)}
      >
        Mint {props.name}
      </button>
    </div>
  );
};

export default Character;
