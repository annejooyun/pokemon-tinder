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
  let fullName = "";

  if (seenPokemon.length === 0) {
    codeBlock = <h3>No liked Pokemon yet.</h3>;
  } else {
    const likedPokemon = seenPokemon.filter((item) => item.liked === true);
    if (likedPokemon.length === 0) {
      codeBlock = <h3>No liked Pokemon yet.</h3>;
    } else {
      // Format data for display
      const pokemonName =
        likedPokemon[indx].name.charAt(0).toUpperCase() +
        likedPokemon[indx].name.slice(1);
      fullName = likedPokemon[indx].firstName + " the " + pokemonName;
      let location = likedPokemon[indx].location.replaceAll("-", " ");
      location = location.charAt(0).toUpperCase() + location.slice(1);

      codeBlock = (
        <>
          <div className="location-row">
            <img className="house-image" src="../home.png"></img>
            <h3>Lives in {location}</h3>
          </div>

          <img className="profile-image" src={likedPokemon[indx].imageURL} />

          <div className="stats">
            <h3 className="about-header">About me</h3>
            <ul className="about-list">
              <li>Height: {likedPokemon[indx].height} dm</li>
              <li>Weight: {likedPokemon[indx].weight} hg</li>
              <li>Type(s): {likedPokemon[indx].types.join(", ")}</li>
            </ul>
            <h3 className="quote-header">Quote</h3>
            <p className="quote"> {likedPokemon[indx].joke} </p>
          </div>

          <div className="action-buttons">
            <button
              className="action-button"
              onClick={() => setIndx(handleBack(indx, likedPokemon))}
            >
              <img src="../back.png" alt="Previous Pokemon" />
            </button>
            <button
              className="action-button"
              onClick={() => setIndx(handleNext(indx, likedPokemon))}
            >
              <img src="../next.png" alt="Next Pokemon" />
            </button>
          </div>
        </>
      );
    }
  }
  return (
    <>
      <div className="container">
        <div className="like-row">
          <img src="./like.png" className="liked-heart"></img>
          <h2 className="name">{fullName}</h2>
        </div>
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
