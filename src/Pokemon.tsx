import { useState, useEffect } from "react";

export interface Pokemon {
  name: string;
  height?: number;
  weight?: number;
  types?: string[];
  location?: string;
  imageURL?: string;
}

export interface SeenPokemon extends Pokemon {
  firstName: string;
  joke: string;
  liked: true | false;
}

interface PokemonInterface {
  location: string;
  pokemonType: string;
  gender: string;
  error: string | null;
  setError: (value: string) => void;
  seenPokemon: SeenPokemon[];
  setSeenPokemon: (value: SeenPokemon[]) => void;
}

export async function fetchAllLocationAreas(): Promise<string[] | null> {
  const response = await fetch(
    "https://pokeapi.co/api/v2/location-area/?limit=1000",
  );
  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return null;
  }
  const locationsAreas = await response.json();
  return locationsAreas.results.map((loc: any) => loc.name);
}

export async function fetchAllPokemonTypes(): Promise<string[] | null> {
  const response = await fetch("https://pokeapi.co/api/v2/type/");
  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return null;
  }
  const pokemonTypes = await response.json();
  return pokemonTypes.results.map((typ: any) => typ.name);
}

export async function fetchPokemonWithOptions(
  location: string,
  pokemonType: string,
): Promise<Pokemon | null> {
  const formattedLocation = location.toLowerCase().replace(/ /g, "-");

  try {
    // Load all Pokemon names in area
    const areaUrl = `https://pokeapi.co/api/v2/location-area/${formattedLocation}/`;

    const response = await fetch(areaUrl);

    if (!response.ok) {
      console.error(`Location-area not found: ${response.status}`);
      return null;
    }
    const areaData = await response.json();

    if (
      !areaData.pokemon_encounters ||
      areaData.pokemon_encounters.length === 0
    ) {
      console.error("No Pokemon in this area");
      return null;
    }

    // Load all Pokemons in area
    const pokemonPromises = areaData.pokemon_encounters.map((x: any) =>
      fetchPokemon(x.pokemon.name, location),
    );
    const allPokemon = await Promise.all(pokemonPromises);

    // Filter Pokemon based on type
    const filteredPokemon = allPokemon.filter((pokemon) =>
      pokemon.types.includes(pokemonType),
    );

    if (filteredPokemon.length === 0) {
      console.error(`No ${pokemonType} type Pokemon in this area`);
      return null;
    }

    // Pick a random Pokemon in filteredPokemon
    const randomIndex = Math.floor(Math.random() * filteredPokemon.length);

    return filteredPokemon[randomIndex];
  } catch (error) {
    console.error(`Fetch Pokemon from location area failed: ${error}`);
    return null;
  }
}

async function fetchPokemon(
  name: string,
  location: string,
): Promise<Pokemon | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);

    if (!response.ok) {
      console.error(`Error: ${response.status}`);
      return null;
    }
    const pokemon = await response.json();

    return {
      name: pokemon["name"],
      height: pokemon["height"],
      weight: pokemon["weight"],
      types: pokemon.types.map((t: any) => t.type.name),
      location: location,
      imageURL: pokemon["sprites"]["front_default"],
    };
  } catch (error) {
    console.error(`Fetch Pokemon failed: ${error}`);
    return null;
  }
}

async function loadNewPokemon(
  setPokemon: (value: Pokemon | null) => void,
  location: string,
  pokemonType: string,
  gender: string,
  setFirstName: (value: string) => void,
  setJoke: (value: string) => void,
  setError: (value: string) => void,
) {
  setPokemon(null);
  const minLoadTime = new Promise((resolve) => setTimeout(resolve, 200));
  try {
    const [fetchedPokemon, fetchedFirstName, fetchedJoke] = await Promise.all([
      fetchPokemonWithOptions(location, pokemonType),
      fetchFirstName(gender),
      fetchRandomChuckNorrisJoke(),
      minLoadTime,
    ]);

    setPokemon(fetchedPokemon);
    setFirstName(fetchedFirstName);
    setJoke(fetchedJoke);
    setError("");
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Failed to fetch new Pokemon");
  }
}

async function fetchFirstName(gender: string): Promise<string> {
  let url = "";
  if (gender === "both") {
    url = `https://randomuser.me/api/?nat=US`;
  } else {
    url = `https://randomuser.me/api/?gender=${gender}&nat=US`;
  }

  //Nationality could be changed later if wanted
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fetch first name failed: ${response.status}`);
  }

  const user = await response.json();
  return user.results[0].name.first;
}

async function fetchRandomChuckNorrisJoke() {
  const response = await fetch(`https://api.chucknorris.io/jokes/random`);

  if (!response.ok) {
    throw new Error(`Fetch Chuch Norris joke failed: ${response.status}`);
  }

  const joke = await response.json();
  return joke.value;
}

export function Pokemon({
  location,
  pokemonType,
  gender,
  error,
  setError,
  seenPokemon,
  setSeenPokemon,
}: PokemonInterface) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [joke, setJoke] = useState<string | null>(null);

  // Update pokemon if locationArea, gender or type changes
  useEffect(() => {
    loadNewPokemon(
      setPokemon,
      location,
      pokemonType,
      gender,
      setFirstName,
      setJoke,
      setError,
    );
  }, [location, gender, pokemonType]);

  // Loading screen
  if (!pokemon && !error) {
    return (
      <div className="container">
        <h2>...Loading</h2>
      </div>
    );
  }

  if (pokemon === null) {
    console.error("Failed to fetch Pokemon.");
    return null;
  } else if (firstName === null) {
    console.error("Failed to fetch first name.");
    return null;
  } else if (joke === null) {
    console.error("Failed to fetch joke.");
    return null;
  }

  // Format full name
  const pokemonName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const fullName = firstName + " the " + pokemonName;

  //Format location
  let location_ = location.replaceAll("-", " ");
  location_ = location_.charAt(0).toUpperCase() + location_.slice(1);

  const handleLike = async () => {
    console.log("Liked!", pokemon.name);
    // Add to seen list with liked = true
    const newSeenPokemon: SeenPokemon = {
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types,
      location: pokemon.location,
      imageURL: pokemon.imageURL,
      firstName: firstName || "Unknown",
      joke: joke,
      liked: true,
    };

    // Push to array
    setSeenPokemon([...seenPokemon, newSeenPokemon]);

    console.log("All seen Pokemon:", [...seenPokemon, newSeenPokemon]);

    //Load new Pokemon
    loadNewPokemon(
      setPokemon,
      location,
      pokemonType,
      gender,
      setFirstName,
      setJoke,
      setError,
    );
  };

  const handleDislike = () => {
    console.log("Disliked!", pokemon.name);
    // Add to seen list with liked = false
    const newSeenPokemon: SeenPokemon = {
      name: pokemon.name,
      firstName: firstName || "Unknown",
      joke: joke,
      liked: false,
    };

    // Push to array by creating
    setSeenPokemon([...seenPokemon, newSeenPokemon]);

    // Log to verify
    console.log("All seen Pokemon:", [...seenPokemon, newSeenPokemon]);
    // Move to next Pokemon
    loadNewPokemon(
      setPokemon,
      location,
      pokemonType,
      gender,
      setFirstName,
      setJoke,
      setError,
    );
  };

  let codeBlock = null;
  if (error) {
    codeBlock = <p style={{ color: "red" }}>{error}</p>;
  } else {
    codeBlock = (
      <div className="container">
        <h2 className="name">{fullName}</h2>
        <div className="location-row">
          <img className="house-image" src="../home.png"></img>
          <h3>Lives in {location_}</h3>
        </div>
        <br />
        <img className="profile-image" src={pokemon.imageURL} />
        <div className="stats">
          <div className="row"></div>
          <div className="row">
            <h3 className="about-header">About me</h3>
            <ul className="about-list">
              <li>Height: {pokemon.height} dm</li>
              <li>Weight: {pokemon.weight} hg</li>
              <li>Type(s): {pokemon.types.join(", ")}</li>
            </ul>
            <h3 className="quote-header">Quote</h3>
            <p className="quote"> {joke} </p>
          </div>

          <div className="action-buttons">
            <button className="action-button" onClick={handleDislike}>
              <img src="../dislike.png" alt="Dislike" />
            </button>
            <button className="action-button" onClick={handleLike}>
              <img src="../like.png" alt="Like" />
            </button>
          </div>
        </div>
        <br />
      </div>
    );
  }
  return codeBlock;
}
