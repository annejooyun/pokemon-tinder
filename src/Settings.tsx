interface Settings {
  locationArea: string
  setLocationArea: (value: string) => void
  gender: 'male' | 'female' | 'both'
  setGender: (value: 'male' | 'female' | 'both') => void
  pokemonType: string | null;
  setPokemonType: (value:string) => void
  onBack: () => void
}


export function Settings({
    locationArea,
    setLocationArea,
    gender,
    setGender,
    pokemonType,
    setPokemonType,
    onBack
}: Settings) {

    return(
        <div className="settings">
            <h1>Settings</h1>

            <div className="locationArea">
                <label>Location Area: </label>
                <input value={locationArea} onChange={(e) => setLocationArea(e.target.value)}></input>
            </div>
            <br></br>
            <div className="gender">
                <label>Gender: </label>
                <select value={gender} onChange={(e) => setGender(e.target.value as any)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="both">Both</option>
                </select>
            </div>
            <br></br>
            <div className="pokemonType">
                <label>Pokemon type: </label>
                <input value={pokemonType} onChange={(e) => setPokemonType(e.target.value)}></input>
            </div>
            <br></br>
            <button onClick={onBack}>Back to App</button>
        </div>
  ) 
}

