import { useState } from "react";

interface Settings {
  allLocations: string[] | null;
  allPokemonTypes: string[] | null;
  location: string;
  setLocation: (value: string) => void;
  gender: "male" | "female" | "both";
  setGender: (value: "male" | "female" | "both") => void;
  pokemonType: string;
  setPokemonType: (value: string) => void;
  onBack: () => void;
}

export function Settings({
  allLocations,
  allPokemonTypes,
  location,
  setLocation,
  gender,
  setGender,
  pokemonType,
  setPokemonType,
  onBack,
}: Settings) {
  // Location dropdown
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Gender dropdown
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const genderOptions: ("male" | "female" | "both")[] = [
    "male",
    "female",
    "both",
  ];

  // Pokemon type dropdown
  const [pokemonTypeSearchTerm, setPokemonTypeSearchTerm] = useState("");
  const [showPokemonTypeDropdown, setShowPokemonTypeDropdown] = useState(false);

  // Filter locations based on search
  let filteredLocations = allLocations
    ? allLocations
        .filter((loc) =>
          loc.toLowerCase().includes(locationSearchTerm.toLowerCase()),
        )
        .slice(0, 10) // Limit to 10 results
    : [];

  // Format
  filteredLocations = filteredLocations.map(
    (loc) => loc[0].toUpperCase() + loc.slice(1).replaceAll("-", " "),
  );

  // Filter Pokemon types based on search
  let filteredPokemonTypes = allPokemonTypes
    ? allPokemonTypes
        .filter((loc) =>
          loc.toLowerCase().includes(pokemonTypeSearchTerm.toLowerCase()),
        )
        .slice(0, 10) // Limit to 10 results
    : [];

  //Format
  filteredPokemonTypes = filteredPokemonTypes.map(
    (loc) => loc[0].toUpperCase() + loc.slice(1),
  );

  const handleLocationSelect = (location: string) => {
    setLocation(location);
    setLocationSearchTerm("");
    setShowLocationDropdown(false);
  };

  const handleGenderSelect = (selectedGender: "male" | "female" | "both") => {
    setGender(selectedGender);
    setShowGenderDropdown(false);
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

            <div className="current-text">
              Current:{" "}
              {location[0].toUpperCase() +
                location.slice(1).replaceAll("-", " ")}
            </div>
          </div>

          <div className="gender">
            <label>Gender: </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={gender}
                onFocus={() => setShowGenderDropdown(true)}
                onChange={(e) => {
                  setGender(e.target.value as "male" | "female" | "both");
                  setShowGenderDropdown(true);
                }}
                placeholder="Select gender..."
                className="settings-input"
              />

              {showGenderDropdown && (
                <div className="dropdown">
                  {genderOptions.map((gender) => (
                    <div
                      key={gender}
                      onClick={() => handleGenderSelect(gender)}
                      className="dropdown-item"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      {gender[0].toUpperCase() + gender.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="current-text">
              Current: {gender[0].toUpperCase() + gender.slice(1)}
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
            <div className="current-text">
              Current: {pokemonType[0].toUpperCase() + pokemonType.slice(1)}
            </div>
          </div>
        </div>
      </div>
      <button onClick={onBack}>Back to App</button>
    </>
  );
}
