type Pokemon = {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: string[];
    locations: string[];
    imageURL?: string;
}


export async function fetchAllLocationAreas(): Promise<string[] | null> {
  const response = await fetch('https://pokeapi.co/api/v2/location-area/?limit=1000');
  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return null;
  }
  const locationsAreas = await response.json();
  return (locationsAreas.results.map((loc: any) => loc.name));
}


export async function fetchPokemonFromLocationArea(location: string): Promise<Pokemon | null> {
  const formattedLocation = location.toLowerCase().replace(/ /g, '-')

  try {
    const areaUrl = `https://pokeapi.co/api/v2/location-area/${formattedLocation}/`
    console.log(`Trying location-area URL: ${areaUrl}`)
    const response = await fetch(areaUrl)
    
    if (!response.ok) {
      console.error(`Location-area not found: ${response.status}`)
      return null
    }
    
    const areaData = await response.json()
    
    if (!areaData.pokemon_encounters || areaData.pokemon_encounters.length === 0) {
      console.error('No Pokemon in this area')
      return null
    }
    
    // Pick a random Pokemon from the area
    const randomIndex = Math.floor(Math.random() * areaData.pokemon_encounters.length)
    const pokemonName = areaData.pokemon_encounters[randomIndex].pokemon.name
    
    // Fetch full Pokemon data
    return await fetchPokemon(pokemonName)
    
  } catch (error) {
    console.error(`Fetch Pokemon from location area failed: ${error}`)
    return null
  }
}

async function fetchPokemon (name:string): Promise<Pokemon | null> {
  try {
    const response_1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);

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
      imageURL: pokemon["sprites"]["front_default"]
 };
  }
  catch (error) {
    console.error(`Fetch Pokemon failed: ${error}`);
    return null;
  }
}


export function PokemonDisplay({ pokemon, firstName }: { pokemon: Pokemon; firstName: string | null }) {
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const fullName = firstName + " the " + pokemonName;
    return (
    <div className="card-container">
      <h2 className="name">{fullName}</h2>
      <br />
      <img src={pokemon.imageURL} />
      <div className="stats">
        <div className="row">

        </div>
        <div className="row">
          <h3 className="about">About</h3>
          <ul className="about-list">               
            <li>Height: {pokemon.height} dm</li>
            <li>Weight: {pokemon.weight} hg</li>
            <li>Type(s): {pokemon.types.join(', ')}</li>
          </ul>
          <h3 className="locations">Locations</h3>  
          <p className="locations-list">{pokemon.locations.join(', ')}</p>          
        </div>
      </div>
      <br />
    </div>
  )
}




