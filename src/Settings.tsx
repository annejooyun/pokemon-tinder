interface Settings {
  locationArea: string
  setLocationArea: (value: string) => void
  gender: 'male' | 'female' | 'both'
  setGender: (value: 'male' | 'female' | 'both') => void
  onBack: () => void
}


export function Settings({
  locationArea,
  setLocationArea,
  gender,
  setGender,
  onBack
}: Settings) {

  return(
    <div className="settings">
      <h1>Settings</h1>

      <div>
        <label>Location Area: </label>
        <input value={locationArea} onChange={(e) => setLocationArea(e.target.value)}></input>
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

