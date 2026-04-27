import { useEffect, useState } from "react";
import "./App.css";
import { Settings } from "./Settings";
import * as P from "./Pokemon";
import { Liked } from "./Liked";
import { Login } from "./Login";
import type { user } from "./Login";

// Local storage for user preferences
function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? (saved as T) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, value as string);
  }, [key, value]);

  return [value, setValue];
}

function App() {
  // Users
  const [allUsers, setAllUsers] = useState<user[]>([]);

  // UI state
  const [currentPage, setCurrentPage] = useState<
    "app" | "settings" | "liked" | "login"
  >("app");
  const [error, setError] = useState<string | null>(null);

  // Pokemon data
  const [allPokemonTypes, setAllPokemonTypes] = useState<string[] | null>(null);
  const [allLocationAreas, setAllLocationAreas] = useState<string[] | null>(
    null,
  );
  const [seenPokemon, setSeenPokemon] = useState<P.SeenPokemon[]>([]);

  // User preferences
  const [locationArea, setLocationArea] = useLocalStorage(
    "pokemon-location-area",
    "canalave-city-area",
  );
  const [gender, setGender] = useLocalStorage<"male" | "female" | "both">(
    "pokemon-gender",
    "male",
  );
  const [pokemonType, setPokemonType] = useLocalStorage(
    "pokemon-type",
    "water",
  );

  // Load all location areas once
  useEffect(() => {
    const load = async () => {
      try {
        const areas = await P.fetchAllLocationAreas();
        setAllLocationAreas(areas);
      } catch (error) {
        console.error(`Falied to load location areas: ${error}`);
      }
    };
    load();
  }, []);

  // Load all Pokemon types once
  useEffect(() => {
    const load = async () => {
      try {
        const types = await P.fetchAllPokemonTypes();
        setAllPokemonTypes(types);
      } catch (error) {
        console.error(`Failed to load Pokemon types ${error}`);
      }
    };
    load();
  }, []);

  // Save new users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("users", allUsers);
  }, [allUsers]);

  // Save location area to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pokemon-location-area", locationArea);
  }, [locationArea]);

  // Save gender to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pokemon-gender", gender);
  }, [gender]);

  // Save type in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pokemon-type", pokemonType);
  }, [pokemonType]);

  // Save seen Pokemon whenever it changes
  useEffect(() => {
    if (seenPokemon.length > 0) {
      localStorage.setItem("seen-pokemon", JSON.stringify(seenPokemon));
    }
  }, [seenPokemon]);

  let codeBlock = null;

  switch (currentPage) {
    case "app":
      codeBlock = (
        <>
          <P.Pokemon
            location={locationArea}
            pokemonType={pokemonType}
            gender={gender}
            error={error}
            setError={setError}
            seenPokemon={seenPokemon}
            setSeenPokemon={setSeenPokemon}
          />
          <div className="buttonFooter">
            <button onClick={() => setCurrentPage("settings")}>Settings</button>
            <button onClick={() => setCurrentPage("liked")}>
              Liked Pokemon
            </button>
            <button onClick={() => setCurrentPage("login")}>Log out</button>
          </div>
        </>
      );
      break;
    case "settings":
      codeBlock = (
        <Settings
          allLocationAreas={allLocationAreas}
          allPokemonTypes={allPokemonTypes}
          locationArea={locationArea}
          setLocationArea={setLocationArea}
          gender={gender}
          setGender={setGender}
          pokemonType={pokemonType}
          setPokemonType={setPokemonType}
          onBack={() => setCurrentPage("app")}
        />
      );
      break;
    case "login":
      codeBlock = (
        <Login
          setCurrentPage={setCurrentPage}
          allUsers={allUsers}
          setAllUsers={setAllUsers}
        />
      );
      break;
    case "liked":
      codeBlock = (
        <Liked seenPokemon={seenPokemon} setCurrentPage={setCurrentPage} />
      );
      break;
  }

  return (
    <div className="app">
      <div className="heading-row">
        <img className="flame-image" src="/flame.png"></img>
        <h1>Pokemon Tinder</h1>
      </div>
      {codeBlock}
    </div>
  );
}

export default App;
