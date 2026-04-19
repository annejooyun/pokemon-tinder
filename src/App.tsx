import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const gender = "male";


useEffect(() => {
  Promise.all([
    fetchSnorlax(),
    fetchFirstName(gender)
  ]).then(([pokemon, firstName]) => {
    setData(pokemon)
    setFirstName(firstName)
  }).catch(() => setError('Failed to fetch'))
}, [])

  return (
    <div className="app">
    <h1>Pokemon Tinder</h1>
    {!data && !error && <p>Loading...</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {data && <PokemonDisplay data={data} firstName={firstName} />}
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
      <div className="stats">
        <h3>About:</h3>
        <ul>
          <li>Height: {data.height} dm</li>
          <li>Weight: {data.weight} hg</li>
          <li>Type(s): {data.types.join(', ')}</li>
        </ul>
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
    imageURL?: string;
}


/*
async function fetchLocations() {
  const response = await fetch('https://pokeapi.co/api/v2/location/canalave-city/');
  const data = await response.json();
  return data;
}
*/

async function fetchSnorlax (): Promise<Pokemon | null> {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/snorlax/');

    if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return null;
    }
    const data = await response.json();
    return {
      id: data["id"],
      name: data["name"], 
      height: data["height"],
      weight: data["weight"],
      types: data.types.map((t: any) => t.type.name) };
  }
  catch (error) {
    console.error(`Fetch Snorlax failed: ${error}`);
    return null;
  }
}

/*
async function getPokemonByLocation({ location }: { location: string }) {
  // TODO: implement fetching pokemon by location
  return []
}
  */

async function fetchFirstName(gender: string): Promise<string | null> {
  try {
    //Nationality could be changed later if wanted
    const response = await fetch(`https://randomuser.me/api/?gender=${gender}&nat=US`);

    if(!response.ok){
      console.error(`Fetch failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(data);
    return(data.results[0].name.first);
  }
  catch (error){
    console.error(`Fetch first name failed: ${error}`);
    return null;
  }
}