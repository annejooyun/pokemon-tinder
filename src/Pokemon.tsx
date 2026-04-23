import { useState, useEffect } from "react";

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  locations: string[];
  imageURL?: string;
};

export type SeenPokemon = {
  firstName: string;
  pokemonName: string;
  liked: true | false;
};

interface PokemonInterface {
  firstName: string | null;
  location: string;
  pokemonType: string;
  gender: string;
  setFirstName: (value: string) => void;
  error: string | null;
  setError: (value: string) => void;
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
  console.log(pokemonTypes);
  return pokemonTypes.results.map((typ: any) => typ.name);
}

export async function fetchPokemonFromLocationArea(
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
    const pokemonPromises = areaData.pokemon_encounters.map((x) =>
      fetchPokemon(x.pokemon.name),
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

async function fetchPokemon(name: string): Promise<Pokemon | null> {
  try {
    const response_1 = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name}/`,
    );

    if (!response_1.ok) {
      console.error(`Error: ${response_1.status}`);
      return null;
    }
    const pokemon = await response_1.json();

    const response_2 = await fetch(pokemon.location_area_encounters);
    if (!response_2.ok) {
      console.error(`Error: ${response_2.status}`);
      return null;
    }
    const encounters = await response_2.json();

    return {
      id: pokemon["id"],
      name: pokemon["name"],
      height: pokemon["height"],
      weight: pokemon["weight"],
      types: pokemon.types.map((t: any) => t.type.name),
      locations: encounters.map((e: any) => e.location_area.name),
      imageURL: pokemon["sprites"]["front_default"],
    };
  } catch (error) {
    console.error(`Fetch Pokemon failed: ${error}`);
    return null;
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

export function Pokemon({
  firstName,
  location,
  pokemonType,
  gender,
  setFirstName,
  error,
  setError,
}: PokemonInterface) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  // Update pokemon if locationArea, gender or type changes
  useEffect(() => {
    const loadData = async () => {
      setPokemon(null);
      try {
        const [fetchedPokemon, fetchedFirstName] = await Promise.all([
          fetchPokemonFromLocationArea(location, pokemonType),
          fetchFirstName(gender),
        ]);

        setPokemon(fetchedPokemon);
        setFirstName(fetchedFirstName);
        setError("");
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch Pokemon");
      }
    };
    loadData();
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
    console.error(`Failed to fetch Pokemon`);
    return null;
  }

  // Format full name
  const pokemonName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const fullName = firstName + " the " + pokemonName;

  //Format location
  let location_ = location.replaceAll("-", " ");
  location_ = location_.charAt(0).toUpperCase() + location_.slice(1);

  const handleLike = () => {
    console.log("Liked!", pokemon.name);
    // Add to liked list
  };

  const handleDislike = () => {
    console.log("Disliked!", pokemon.name);
    // Move to next Pokemon
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
            <p className="quote"> *Insert Chuck Norris quote here* </p>
          </div>

          <div className="action-buttons">
            <button className="dislike-button" onClick={handleDislike}>
              <img src="../dislike.png" alt="Dislike" />
            </button>
            <button className="like-button" onClick={handleLike}>
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
