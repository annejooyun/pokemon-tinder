import { useState, useEffect } from "react";

type ErrorSetter = (value: Error | null) => void;

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
  liked: boolean;
}

interface PokemonInterface {
  location: string;
  pokemonType: string;
  gender: string;
  error: Error | null;
  setError: ErrorSetter;
  seenPokemon: SeenPokemon[];
  setSeenPokemon: (value: SeenPokemon[]) => void;
}

export async function fetchAllLocations(
  setError: ErrorSetter,
): Promise<string[] | null> {
  const response = await fetch(
    "https://pokeapi.co/api/v2/location-area/?limit=1000",
  );
  if (!response.ok) {
    setError(new Error(`Error: ${response.status}`));
    return null;
  }
  const locations = await response.json();
  return locations.results.map((loc: any) => loc.name);
}

export async function fetchAllPokemonTypes(
  setError: ErrorSetter,
): Promise<string[] | null> {
  const response = await fetch("https://pokeapi.co/api/v2/type/");
  if (!response.ok) {
    setError(new Error(`Error: ${response.status}`));
    return null;
  }
  const pokemonTypes = await response.json();
  return pokemonTypes.results.map((typ: any) => typ.name);
}

export async function fetchPokemonWithOptions(
  location: string,
  pokemonType: string,
  setError: ErrorSetter,
): Promise<Pokemon | null> {
  const formattedLocation = location.toLowerCase().replace(/ /g, "-");

  try {
    // Load all Pokemon names in area
    const areaUrl = `https://pokeapi.co/api/v2/location-area/${formattedLocation}/`;

    const response = await fetch(areaUrl);

    if (!response.ok) {
      setError(new Error(`Location-area not found: ${response.status}`));
      return null;
    }
    const areaData = await response.json();

    if (
      !areaData.pokemon_encounters ||
      areaData.pokemon_encounters.length === 0
    ) {
      setError(new Error("No Pokemon in this area"));
      return null;
    }

    // Load all Pokemons in area
    const pokemonPromises = areaData.pokemon_encounters.map((x: any) =>
      fetchPokemon(x.pokemon.name, location, setError),
    );
    const allPokemon = await Promise.all(pokemonPromises);

    // Filter Pokemon based on type
    const filteredPokemon = allPokemon.filter((pokemon) =>
      pokemon.types.includes(pokemonType),
    );

    if (filteredPokemon.length === 0) {
      setError(new Error(`No ${pokemonType} type Pokemon in this area`));
      return null;
    }

    // Pick a random Pokemon in filteredPokemon
    const randomIndex = Math.floor(Math.random() * filteredPokemon.length);

    return filteredPokemon[randomIndex];
  } catch (error) {
    setError(new Error(`Fetch Pokemon from location area failed: ${error}`));
    return null;
  }
}

async function fetchPokemon(
  name: string,
  location: string,
  setError: ErrorSetter,
): Promise<Pokemon | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);

    if (!response.ok) {
      setError(new Error(`Error: ${response.status}`));
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
    setError(new Error(`Fetch Pokemon failed: ${error}`));
    return null;
  }
}

async function loadNewPokemon(
  setPokemon: (value: Pokemon | null) => void,
  location: string,
  pokemonType: string,
  gender: string,
  seenPokemon: SeenPokemon[],
  setFirstName: (value: string) => void,
  setJoke: (value: string) => void,
  setError: ErrorSetter,
  setIsLoading: (value: boolean) => void,
) {
  setIsLoading(true);
  setError(null);
  setPokemon(null);
  setFirstName("");
  setJoke("");
  const minLoadTime = new Promise((resolve) => setTimeout(resolve, 200));
  try {
    const [fetchedPokemon, fetchedFirstName, fetchedJoke] = await Promise.all([
      fetchPokemonWithOptions(location, pokemonType, setError),
      fetchFirstName(gender, setError),
      fetchRandomChuckNorrisJoke(setError),
      minLoadTime,
    ]);

    if (
      fetchedPokemon &&
      alreadySeenPokemon(fetchedPokemon.name, fetchedFirstName, seenPokemon)
    ) {
      // Already seen, load new Pokemon
      await loadNewPokemon(
        setPokemon,
        location,
        pokemonType,
        gender,
        seenPokemon,
        setFirstName,
        setJoke,
        setError,
        setIsLoading,
      );
    }

    setPokemon(fetchedPokemon);
    setFirstName(fetchedFirstName);
    setJoke(fetchedJoke);
  } catch (err) {
    setError(new Error(`Fetch error: ${err}`));
  } finally {
    setIsLoading(false);
  }
}

function alreadySeenPokemon(
  pokemonName: string,
  firstName: string,
  allSeenPokemon: SeenPokemon[],
): boolean {
  return allSeenPokemon.some(
    (p) => p.firstName === firstName && p.name === pokemonName,
  );
}

async function fetchFirstName(
  gender: string,
  setError: ErrorSetter,
): Promise<string> {
  let url = "";
  if (gender === "both") {
    url = `https://randomuser.me/api/?nat=US`;
  } else {
    url = `https://randomuser.me/api/?gender=${gender}&nat=US`;
  }

  //Nationality could be changed later if wanted
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(`Fetch first name failed: ${response.status}`);
    setError(error);
    throw error;
  }

  const user = await response.json();
  return user.results[0].name.first;
}

async function fetchRandomChuckNorrisJoke(setError: ErrorSetter) {
  const response = await fetch(`https://api.chucknorris.io/jokes/random`);

  if (!response.ok) {
    const error = new Error(
      `Fetch Chuck Norris joke failed: ${response.status}`,
    );
    setError(error);
    throw error;
  }

  let joke = await response.json();
  joke = joke.value;

  if (joke.length > 250) {
    joke = await fetchRandomChuckNorrisJoke(setError);
  }

  return joke;
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
  const [firstName, setFirstName] = useState<string>("");
  const [joke, setJoke] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Update pokemon if location, gender or type changes
  useEffect(() => {
    loadNewPokemon(
      setPokemon,
      location,
      pokemonType,
      gender,
      seenPokemon,
      setFirstName,
      setJoke,
      setError,
      setIsLoading,
    );
  }, [location, gender, pokemonType]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="container">
        <h2>...Loading</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container error-container">
        <h3
          className="error"
          style={{ color: "red" }}
        >{`Error: ${error.message}`}</h3>
      </div>
    );
  }

  if (pokemon === null || firstName === "" || joke === "") {
    return null;
  }

  // Format full name
  const pokemonName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const fullName = firstName + " the " + pokemonName;

  //Format location
  let location_ = location.replaceAll("-", " ");
  location_ = location_.charAt(0).toUpperCase() + location_.slice(1);

  const createSeenPokemon = (liked: boolean): SeenPokemon => ({
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    types: pokemon.types,
    location: pokemon.location,
    imageURL: pokemon.imageURL,
    firstName: firstName || "Unknown",
    joke: joke,
    liked: liked,
  });

  const handleLike = async () => {
    // Push to array
    setSeenPokemon([...seenPokemon, createSeenPokemon(true)]);

    //Load new Pokemon
    loadNewPokemon(
      setPokemon,
      location,
      pokemonType,
      gender,
      seenPokemon,
      setFirstName,
      setJoke,
      setError,
      setIsLoading,
    );
  };

  const handleDislike = () => {
    // Push to array by creating
    setSeenPokemon([...seenPokemon, createSeenPokemon(false)]);

    // Move to next Pokemon
    loadNewPokemon(
      setPokemon,
      location,
      pokemonType,
      gender,
      seenPokemon,
      setFirstName,
      setJoke,
      setError,
      setIsLoading,
    );
  };

  return (
    <div className="container">
      <h2 className="name">{fullName}</h2>

      <div className="location-row">
        <img className="house-image" src="../home.png"></img>
        <h3>Lives in {location_}</h3>
      </div>

      <img className="profile-image" src={pokemon.imageURL} />

      <div className="stats">
        <h3 className="about-header">About me</h3>
        <ul className="about-list">
          <li>Height: {pokemon.height} dm</li>
          <li>Weight: {pokemon.weight} hg</li>
          <li>Type(s): {pokemon.types?.join(", ") ?? "Unknown"}</li>
        </ul>
        <h3 className="quote-header">Quote</h3>
        <p className="quote"> {joke} </p>

        <div className="action-buttons">
          <button className="action-button" onClick={handleDislike}>
            <img src="../dislike.png" alt="Dislike" />
          </button>
          <button className="action-button" onClick={handleLike}>
            <img src="../like.png" alt="Like" />
          </button>
        </div>
      </div>
    </div>
  );
}
