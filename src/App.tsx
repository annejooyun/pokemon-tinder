import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState<string | null>(null)


useEffect(() => {
  fetchSnorlax().then(result => {
    if (result) {
      setData(result)
    } else {
      setError('Failed to fetch Pokemon')
    }
  })
}, [])

  return (
    <div className="app">
    <h1>Pokemon Tinder</h1>
    {!data && !error && <p>Loading...</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {data && <PokemonDisplay data={data} />}
  </div>
)
  
  
}

export default App

function PokemonDisplay({ data }: { data: Pokemon }) {

  return (
    <div className="card-container">
      <h2 className="name">{data.name}</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}



type Pokemon = {
    id: number;
    name: string;
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
    return null
    }
    const data = await response.json();
    return {id: data["id"], name: data["name"], types: data["types"]};
  }
  catch (error) {
    console.error(`Fetch failed: ${error}`);
    return null;
  }
}

/*
async function getPokemonByLocation({ location }: { location: string }) {
  // TODO: implement fetching pokemon by location
  return []
}
  */