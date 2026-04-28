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

  const noLikedPokemonCodeBlock = (
    <>
      <div className="container error-container">
        <img src="./like.png" className="liked-heart"></img>

        <h3>No liked Pokemon yet.</h3>
      </div>
      <div className="buttonFooter">
        <button onClick={() => setCurrentPage("settings")}>Settings</button>
        <button onClick={() => setCurrentPage("app")}>Back to app</button>
        <button onClick={() => setCurrentPage("login")}>Log out</button>
      </div>
    </>
  );
  if (seenPokemon.length === 0) {
    return noLikedPokemonCodeBlock;
  } else {
    const likedPokemon = seenPokemon.filter((item) => item.liked === true);
    if (likedPokemon.length === 0) {
      return noLikedPokemonCodeBlock;
    } else {
      const currentPokemon = likedPokemon[indx % likedPokemon.length];

      // Format data for display
      const pokemonName =
        currentPokemon.name.charAt(0).toUpperCase() +
        currentPokemon.name.slice(1);
      fullName = currentPokemon.firstName + " the " + pokemonName;
      let location = (currentPokemon.location ?? "unknown").replaceAll(
        "-",
        " ",
      );
      location = location.charAt(0).toUpperCase() + location.slice(1);

      codeBlock = (
        <>
          <div className="container">
            <div className="like-row">
              <img src="./like.png" className="liked-heart"></img>
              <h2 className="name">{fullName}</h2>
            </div>
            <div className="location-row">
              <img className="house-image" src="../home.png"></img>
              <h3>Lives in {location}</h3>
            </div>

            <img className="profile-image" src={currentPokemon.imageURL} />

            <div className="stats">
              <h3 className="about-header">About me</h3>
              <ul className="about-list">
                <li>Height: {currentPokemon.height} dm</li>
                <li>Weight: {currentPokemon.weight} hg</li>
                <li>
                  Type(s): {currentPokemon.types?.join(", ") ?? "Unknown"}
                </li>
              </ul>
              <h3 className="quote-header">Quote</h3>
              <p className="quote"> {currentPokemon.joke} </p>
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
          </div>
          <div className="buttonFooter">
            <button onClick={() => setCurrentPage("settings")}>Settings</button>
            <button onClick={() => setCurrentPage("app")}>Back to app</button>
            <button onClick={() => setCurrentPage("login")}>Log out</button>
          </div>
        </>
      );
    }
  }
  return codeBlock;
}
