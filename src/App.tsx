import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [currentPage, setCurrentPage] = useState<'app' | 'settings' | 'login'>('app')
  const [allLocationAreas, setAllLocationAreas] = useState(null)
  const [locationArea, setLocationArea] = useState<string>(() => {
    const saved = localStorage.getItem('pokemon-location-area')
    if (saved) {
      console.log(`Loaded location area from localStorage: "${saved}"`)
      return saved
    }
    console.log('No location area in localStorage, using default: canalave-city-canalave-gym')
    return 'canalave-city-canalave-gym'
  })

  const [gender, setGender] = useState<'male' | 'female' | "both">(() => {
    return (localStorage.getItem('pokemon-gender') || 'male') as any
  })
  

  const [error, setError] = useState<string | null>(null)

  // Save location area to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemon-location-area', locationArea)
  }, [locationArea])

  // Save gender to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemon-gender', gender)
  }, [gender])

  // Fetch initial Pokemon and location areas
  useEffect(() => {
    Promise.all([
      fetchAllLocationAreas(),
      fetchPokemonFromLocationArea(locationArea),
      fetchFirstName(gender)
    ]).then(([locationAreas, pokemon, firstName]) => {
      setAllLocationAreas(locationAreas)
      setPokemon(pokemon)
      setFirstName(firstName)
    }).catch((err) => {
      console.error('Fetch error:', err)
      setError('Failed to fetch Pokemon')
    })
  }, [locationArea, gender])

  
  

  return (
    <div className="app">
      {currentPage == 'app' && (
        <>
          <h1>Pokemon Tinder</h1>
          {!pokemon && !error && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {pokemon && <PokemonDisplay pokemon={pokemon} firstName={firstName} />}
          <br />
          <button onClick={() => setCurrentPage('settings')}>Settings</button>
        </>
      )}

      {currentPage === 'settings' && (
        <SettingsPage 
          locationArea={locationArea}
          setLocationArea={setLocationArea}
          gender={gender}
          setGender={setGender}
          onBack={() => setCurrentPage('app')}
      />
    )}
  </div>

)
}


export default App

function PokemonDisplay({ pokemon, firstName}: { pokemon: Pokemon }) {
  const name = firstName + " the " + pokemon.name;
  return (
    <div className="card-container">
      <h2 className="name">{name}</h2>
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



type Pokemon = {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: string[];
    locations: string[];
    imageURL?: string;
}



async function fetchAllLocationAreas(): Promise<string[] | null> {
  const response = await fetch('https://pokeapi.co/api/v2/location-area/?limit=1000');
  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return null;
  }
  const locationsAreas = await response.json();
  console.log(locationsAreas.results.map((loc: any) => loc.name));
  return (locationsAreas.results.map((loc: any) => loc.name));
}


async function fetchSnorlax (): Promise<Pokemon | null> {
  try {
    const response_1 = await fetch('https://pokeapi.co/api/v2/pokemon/snorlax/');

    if (!response_1.ok) {
      console.error(`Error: ${response_1.status}`);
      return null;
    }
    const snorlax = await response_1.json();


    const response_2 = await fetch(snorlax.location_area_encounters);
    if (!response_2.ok) {
      console.error(`Error: ${response_2.status}`);
      return null;
    }
    const encounters = await response_2.json();

    return {
      id: snorlax["id"],
      name: snorlax["name"], 
      height: snorlax["height"],
      weight: snorlax["weight"],
      types: snorlax.types.map((t: any) => t.type.name),
      locations: encounters.map((e: any) => e.location_area.name),
      imageURL: snorlax["sprites"]["front_default"]
 };
  }
  catch (error) {
    console.error(`Fetch Snorlax failed: ${error}`);
    return null;
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

async function fetchPokemonFromLocationArea(location: string): Promise<Pokemon | null> {
  const formattedLocation = location.toLowerCase().replace(/ /g, '-')
  console.log(`Fetching Pokemon from location-area: "${location}" (formatted: "${formattedLocation}")`)

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
    console.log(`Found ${areaData.pokemon_encounters.length} Pokemon, selected: ${pokemonName}`)
    
    // Fetch full Pokemon data
    return await fetchPokemon(pokemonName)
    
  } catch (error) {
    console.error(`Fetch Pokemon from location area failed: ${error}`)
    return null
  }
}

  

async function fetchFirstName(gender: string): Promise<string | null> {
  //TODO: Add logic for gender
  try {
    //Nationality could be changed later if wanted
    const response = await fetch(`https://randomuser.me/api/?gender=${gender}&nat=US`);

    if(!response.ok){
      console.error(`Fetch failed: ${response.status}`);
      return null;
    }

    const user = await response.json();
    return(user.results[0].name.first);
  }
  catch (error){
    console.error(`Fetch first name failed: ${error}`);
    return null;
  }
}

function SettingsPage({
  locationArea,
  setLocationArea,
  gender,
  setGender,
  onBack
}: any) {

  return(
    <div className="settings">
      <h1>Settings</h1>

      <div>
        <label>Location Area: </label>
        <input
          type="text"
          value={locationArea}
          onChange={(e) => setLocationArea(e.target.value)}>
          </input>
      </div>

      <div>
        <label>Gender: </label>
        <select value={gender} onChange={(e) => setGender(e.target.value as any)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="both">Both</option>
        </select>
      </div>

      <button onClick={onBack}>Back to App</button>
    </div>
  ) 
}