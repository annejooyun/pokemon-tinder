import { useState } from "react";

interface Settings {
  allLocationAreas: string[] | null;
  allPokemonTypes: string[] | null;
  locationArea: string;
  setLocationArea: (value: string) => void;
  gender: "male" | "female" | "both";
  setGender: (value: "male" | "female" | "both") => void;
  pokemonType: string | null;
  setPokemonType: (value: string) => void;
  onBack: () => void;
}

export function Settings({
  allLocationAreas,
  allPokemonTypes,
  locationArea,
  setLocationArea,
  gender,
  setGender,
  pokemonType,
  setPokemonType,
  onBack,
}: Settings) {
  // Location dropdown
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Pokemon type dropdown
  const [pokemonTypeSearchTerm, setPokemonTypeSearchTerm] = useState("");
  const [showPokemonTypeDropdown, setShowPokemonTypeDropdown] = useState(false);

  // Filter locations based on search
  const filteredLocations = allLocationAreas
    ? allLocationAreas
        .filter((loc) =>
          loc.toLowerCase().includes(locationSearchTerm.toLowerCase()),
        )
        .slice(0, 10) // Limit to 10 results
    : [];

  // Filter Pokemon types based on search
  const filteredPokemonTypes = allPokemonTypes
    ? allPokemonTypes
        .filter((loc) =>
          loc.toLowerCase().includes(pokemonTypeSearchTerm.toLowerCase()),
        )
        .slice(0, 10) // Limit to 10 results
    : [];

  const handleLocationSelect = (location: string) => {
    setLocationArea(location);
    setLocationSearchTerm("");
    setShowLocationDropdown(false);
  };

  const handlePokemonTypeSelect = (type: string) => {
    setPokemonType(type);
    setPokemonTypeSearchTerm("");
    setShowPokemonTypeDropdown(false);
  };

  return (
    <>
      <div className="container">
        <h2>Settings</h2>
        <div className="settings">
          <div className="location-area">
            <label>Location Area: </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={locationSearchTerm}
                onChange={(e) => {
                  setLocationSearchTerm(e.target.value);
                  setShowLocationDropdown(true);
                }}
                onFocus={() => setShowLocationDropdown(true)}
                placeholder={"Search locations..."}
                className="settings-input"
              />

              {showLocationDropdown &&
                locationSearchTerm &&
                filteredLocations.length > 0 && (
                  <div className="dropdown">
                    {filteredLocations.map((loc) => (
                      <div
                        key={loc}
                        onClick={() => handleLocationSelect(loc)}
                        className="dropdown-item"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "white")
                        }
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
            </div>
            <div className="current-text">Current: {locationArea}</div>
          </div>
          <div className="gender">
            <label>Gender: </label>
            <div>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          <div className="pokemon-type">
            <label>Pokemon type: </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={pokemonTypeSearchTerm}
                onChange={(e) => {
                  setPokemonTypeSearchTerm(e.target.value);
                  setShowPokemonTypeDropdown(true);
                }}
                onFocus={() => setShowPokemonTypeDropdown(true)}
                placeholder={"Search Pokemon types..."}
                className="settings-input"
              />

              {showPokemonTypeDropdown &&
                pokemonTypeSearchTerm &&
                filteredPokemonTypes.length > 0 && (
                  <div className="dropdown">
                    {filteredPokemonTypes.map((loc) => (
                      <div
                        key={loc}
                        onClick={() => handlePokemonTypeSelect(loc)}
                        className="dropdown-item"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "white")
                        }
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
            </div>
            <div className="current-text">Current: {pokemonType}</div>
          </div>
        </div>
      </div>
      <button onClick={onBack}>Back to App</button>
    </>
  );
}
