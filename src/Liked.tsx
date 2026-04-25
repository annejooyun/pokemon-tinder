import type { SeenPokemon } from "./Pokemon";

interface seenPokemonInterface {
  seenPokemon: SeenPokemon[];
}

export function Liked({ seenPokemon }: seenPokemonInterface) {
  let indx = 0;
  let maxIndx = 0;
  let codeBlock = null;
  if (!seenPokemon) {
    codeBlock = <p>No liked pokemon yet.</p>;
  } else {
    function handleBack() {
      indx -= 1;
    }
    function handleNext() {
      indx += 1;
    }
    const likedPokemon = seenPokemon.filter((item) => item.liked === true);
    const likedPokemonList = likedPokemon.map((item) => item);
    codeBlock = (
      <>
        <h2 className="name">{likedPokemonList[indx].name}</h2>
        <div className="location-row">
          <img className="house-image" src="../home.png"></img>
          <h3>Lives in {likedPokemonList[indx].locations}</h3>
        </div>
        <br />
        <img className="profile-image" src={likedPokemonList[indx].imageURL} />
        <div className="stats">
          <div className="row"></div>
          <div className="row">
            <h3 className="about-header">About me</h3>
            <ul className="about-list">
              <li>Height: {likedPokemonList[indx].height} dm</li>
              <li>Weight: {likedPokemonList[indx].weight} hg</li>
              <li>Type(s): {likedPokemonList[indx].types.join(", ")}</li>
            </ul>
            <h3 className="quote-header">Quote</h3>
            <p className="quote"> {likedPokemonList[indx].joke} </p>
          </div>

          <div className="action-buttons">
            <button className="back-button" onClick={handleBack}>
              <img src="../dislike.png" alt="Dislike" />
            </button>
            <button className="like-button" onClick={handleNext}>
              <img src="../like.png" alt="Like" />
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="container">
      <h2>Liked Pokemon</h2>
      {codeBlock}
    </div>
  );
}
