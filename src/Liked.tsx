import type { SeenPokemon } from "./Pokemon";

interface seenPokemonInterface {
  seenPokemon: SeenPokemon[];
}

export function Liked({ seenPokemon }: seenPokemonInterface) {
  let codeBlock = null;
  if (!seenPokemon) {
    codeBlock = <p>No liked pokemon yet.</p>;
  } else {
    const likedPokemon = seenPokemon.filter((item) => item.liked === true);
    codeBlock = <p>{likedPokemon.map((item) => item.firstName)}</p>;
  }
  return (
    <div className="container">
      <h2>Liked Pokemon</h2>
      {codeBlock}
    </div>
  );
}
