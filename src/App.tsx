import { useEffect, useState } from 'react'
import './App.css'
import { Settings } from './Settings'
import * as Pokemon from './Pokemon'

// Local storage for user preferences
function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key)
    return saved ? (saved as T) : defaultValue
  })
  
  useEffect(() => {
    localStorage.setItem(key, value as string)
  }, [key, value])
  
  return [value, setValue]
}

function App() {
  // UI state
  const [currentPage, setCurrentPage] = useState<'app' | 'settings' | 'login'>('app')
  const [error, setError] = useState<string | null>(null)

  // Pokemon data
  const [pokemon, setPokemon] = useState(null)
  const [allLocationAreas, setAllLocationAreas] = useState<string[] | null>(null)

  // First name data
  const [firstName, setFirstName] = useState(null)

  // User preferences
  const [locationArea, setLocationArea] = useLocalStorage('pokemon-location-area', 'canalave-city-canalave-gym')
  const [gender, setGender] = useLocalStorage<'male' | 'female' | 'both'>('pokemon-gender', 'male')
  const [pokemonType, setPokemonType] = useLocalStorage('pokemon-type', null)
  

  // Save location area to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemon-location-area', locationArea)
  }, [locationArea])

  // Save gender to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemon-gender', gender)
  }, [gender])

  // Save type in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemon-type', pokemonType)
  }, [pokemonType])


  // Fetch initial Pokemon and location areas
  useEffect(() => {
  const loadData = async () => {
    try {
      const [allLocationAreas, fetchedPokemon, fetchedFirstName] = await Promise.all([
        Pokemon.fetchAllLocationAreas(),
        Pokemon.fetchPokemonFromLocationArea(locationArea, pokemonType),
        fetchFirstName(gender)
      ])
      setAllLocationAreas(allLocationAreas)
      setPokemon(fetchedPokemon)
      setFirstName(fetchedFirstName)
      setError(null)
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to fetch Pokemon')
    }
  }
  loadData()
}, [locationArea, gender])

  
  return (
    <div className="app">
      {currentPage == 'app' && (
        <>
          <div className="heading-row">
            <img className="flame-image" src="/flame.png"></img>
            <h1>Pokemon Tinder</h1>  
          </div>
          
          {!pokemon && !error && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {pokemon && <Pokemon.PokemonDisplay pokemon={pokemon} firstName={firstName} location={locationArea}/>} 
          <button onClick={() => setCurrentPage('settings')}>Settings</button>
        </>
      )}
      {currentPage === 'settings' && (
        <Settings 
          allLocationAreas={allLocationAreas}
          locationArea={locationArea}
          setLocationArea={setLocationArea}
          gender={gender}
          setGender={setGender}
          pokemonType={pokemonType}
          setPokemonType={setPokemonType}
          onBack={() => setCurrentPage('app')}
  />
)}
  </div>

)
}


export default App




async function fetchFirstName(gender: string): Promise<string | null> {
  let url = "";
  if (gender === "both") {
    url = `https://randomuser.me/api/?nat=US`;
  }
  else {
    url = `https://randomuser.me/api/?gender=${gender}&nat=US`;
  }
  try {
    //Nationality could be changed later if wanted
    const response = await fetch(url);

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
