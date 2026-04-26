import { useState } from "react";
import type { SeenPokemon } from "./Pokemon";

interface seenPokemonInterface {
  seenPokemon: SeenPokemon[];
  setCurrentPage: (value: "app" | "settings" | "liked" | "login") => void;
}

function handleBack(
  currentIndx: number,
  likedPokemonList: SeenPokemon[],
): number {
  if (currentIndx === 0) {
    const maxIndx = likedPokemonList.length;
    return maxIndx - 1;
  } else {
    return currentIndx - 1;
  }
}

function handleNext(
  currentIndx: number,
  likedPokemonList: SeenPokemon[],
): number {
  const maxIndx = likedPokemonList.length;
  if (currentIndx === maxIndx - 1) {
    return 0;
  } else {
    return currentIndx + 1;
  }
}

export function Liked({ seenPokemon, setCurrentPage }: seenPokemonInterface) {
  const [indx, setIndx] = useState(0);
  let codeBlock = null;

  if (seenPokemon.length === 0) {
    codeBlock = <h3>No liked pokemon yet.</h3>;
  } else {
    const likedPokemon = seenPokemon.filter((item) => item.liked === true);
    const likedPokemonList = likedPokemon.map((item) => item);

    // Format data for display
    const pokemonName =
      likedPokemonList[indx].name.charAt(0).toUpperCase() +
      likedPokemonList[indx].name.slice(1);
    const fullName = likedPokemonList[indx].firstName + " the " + pokemonName;
    let location = likedPokemon[indx].location.replaceAll("-", " ");
    location = location.charAt(0).toUpperCase() + location.slice(1);

    codeBlock = (
      <>
        <h2 className="name">{fullName}</h2>
        <div className="location-row">
          <img className="house-image" src="../home.png"></img>
          <h3>Lives in {location}</h3>
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
            <button
              className="action-button"
              onClick={() => setIndx(handleBack(indx, likedPokemonList))}
            >
              <img src="../back.png" alt="Previous Pokemon" />
            </button>
            <button
              className="action-button"
              onClick={() => setIndx(handleNext(indx, likedPokemonList))}
            >
              <img src="../next.png" alt="Next Pokemon" />
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="container">
        <h2>Liked Pokemon</h2>
        {codeBlock}
      </div>
      <div className="buttonFooter">
        <button onClick={() => setCurrentPage("settings")}>Settings</button>
        <button onClick={() => setCurrentPage("app")}>Back to app</button>
        <button onClick={() => setCurrentPage("login")}>Log out</button>
      </div>
    </>
  );
}
