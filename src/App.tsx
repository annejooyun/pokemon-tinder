import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [firstName, setFirstName] = useState(null)

  const [currentPage, setCurrentPage] = useState<'app' | 'settings' | 'login'>('app')
  const [location, setLocation] = useState<string>('canalave-city')
  const [gender, setGender] = useState<'male' | 'female' | "both">('male')
  
  const [error, setError] = useState<string | null>(null)

  //This should maybe only load in when opening settings page
  const [locations, setLocations] = useState(null);

useEffect(() => {
  Promise.all([
    fetchSnorlax(),
    fetchFirstName(gender),
    fetchAllLocations()
  ]).then(([pokemon, firstName, locations]) => {
    setData(pokemon)
    setFirstName(firstName)
    setLocations(locations)
  }).catch(() => setError('Failed to fetch'))
}, [])


  return (
    <div className="app">
      {currentPage == 'app' && (
        <>
          <h1>Pokemon Tinder</h1>
          {!data && !error && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {data && <PokemonDisplay data={data} firstName={firstName} />}
          <br></br>
          <button onClick={() => setCurrentPage('settings')}>Settings</button>
        </>
      )}

      {currentPage === 'settings' && (
        <SettingsPage 
          location={location}
          setLocation={setLocation}
          gender={gender}
          setGender={setGender}
          onBack={() => setCurrentPage('app')}
      />
    )}
  </div>

)
}


export default App

function PokemonDisplay({ data, firstName}: { data: Pokemon }) {
  const name = firstName + " the " + data.name;
  return (
    <div className="card-container">
      <h2 className="name">{name}</h2>
      <br></br>
      <img src={data.imageURL}></img>
      <div className="stats">
        <div className="row">

        </div>
        <div className="row">
          <h3 className="about">About</h3>
          <ul className="about-list">               
            <li>Height: {data.height} dm</li>
            <li>Weight: {data.weight} hg</li>
            <li>Type(s): {data.types.join(', ')}</li>
          </ul>
          <h3 className="locations">Locations</h3>  
          <p className="locations-list">{data.locations.join(', ')}</p>          
        </div>
      </div>
      <br></br>
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



async function fetchAllLocations(): Promise<string[] | null> {
  const response = await fetch('https://pokeapi.co/api/v2/location/?limit=1000');
  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return null;
  }
  const data = await response.json();
  console.log(data.results.map((loc: any) => loc.name));
  return (data.results.map((loc: any) => loc.name));
}


async function fetchSnorlax (): Promise<Pokemon | null> {
  try {
    const response_1 = await fetch('https://pokeapi.co/api/v2/pokemon/snorlax/');

    if (!response_1.ok) {
      console.error(`Error: ${response_1.status}`);
      return null;
    }
    const data = await response_1.json();


    const response_2 = await fetch(data.location_area_encounters);
    if (!response_2.ok) {
      console.error(`Error: ${response_2.status}`);
      return null;
    }
    const encounters = await response_2.json();

    return {
      id: data["id"],
      name: data["name"], 
      height: data["height"],
      weight: data["weight"],
      types: data.types.map((t: any) => t.type.name),
      locations: encounters.map((e: any) => e.location_area.name),
      imageURL: data["sprites"]["front_default"]
 };
  }
  catch (error) {
    console.error(`Fetch Snorlax failed: ${error}`);
    return null;
  }
}


async function fetchPokemonByLocation(location: string): Promise<Pokemon | null> {
  const formattedLocation = location.toLowerCase().replace(/ /g, '-')

  try {
    // Fetch location area to get pokemon
    const response_1 = await fetch(`https://pokeapi.co/api/v2/location-area/${formattedLocation}/`)

    if (!response_1.ok) {
      console.error(`Error: ${response_1.status}`)
      return null
    }
    
    const locationData = await response_1.json()
    
    // Get first pokemon from this location
    if (!locationData.pokemon_encounters || locationData.pokemon_encounters.length === 0) {
      console.error('No pokemon found in this location')
      return null
    }
    
    const pokemonName = locationData.pokemon_encounters[0].pokemon.name
    
    // Fetch that pokemon's details
    const response_2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
    if (!response_2.ok) {
      console.error(`Error: ${response_2.status}`)
      return null
    }
    const pokemonData = await response_2.json()
    
    // Fetch encounters for this pokemon
    const response_3 = await fetch(pokemonData.location_area_encounters)
    if (!response_3.ok) {
      console.error(`Error: ${response_3.status}`)
      return null
    }
    const encounters = await response_3.json()
    
    return {
      id: pokemonData.id,
      name: pokemonData.name,
      height: pokemonData.height,
      weight: pokemonData.weight,
      types: pokemonData.types.map((t: any) => t.type.name),
      locations: encounters.map((e: any) => e.location_area.name),
      imageURL: pokemonData.sprites.front_default
    }
  } catch (error) {
    console.error(`Fetch Pokemon failed: ${error}`)
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

    const data = await response.json();
    return(data.results[0].name.first);
  }
  catch (error){
    console.error(`Fetch first name failed: ${error}`);
    return null;
  }
}

function SettingsPage({
  location,
  setLocation,
  gender,
  setGender,
  onBack
}: any) {

  return(
    <div className="settings">
      <h1>Settings</h1>

      <div>
        <label>Location: </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}>
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