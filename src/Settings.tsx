import { useEffect, useState } from 'react'

interface Settings {
    allLocationAreas: string[] | null
    locationArea: string
    setLocationArea: (value: string) => void
    gender: 'male' | 'female' | 'both'
    setGender: (value: 'male' | 'female' | 'both') => void
    pokemonType: string | null;
    setPokemonType: (value:string) => void
    onBack: () => void
}


export function Settings({
    allLocationAreas,
    locationArea,
    setLocationArea,
    gender,
    setGender,
    pokemonType,
    setPokemonType,
    onBack
}: Settings) {
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)

    // Filter locations based on search
    const filteredLocations = allLocationAreas
      ? allLocationAreas.filter(loc => 
          loc.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10) // Limit to 10 results
      : []

    const handleLocationSelect = (location: string) => {
      setLocationArea(location)
      setSearchTerm('')
      setShowDropdown(false)
    }


    return(
        <>
        <div className="heading-row">
            <img className="flame-image" src="/flame.png"></img>
            <h1>Pokemon Tinder</h1>  
        </div>

                <div className="settings-container">
            <h2>Settings</h2>
            <div className="settings">
                <div className="locationArea">
                    <label>Location Area: </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setShowDropdown(true)
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder={locationArea || "Search locations..."}
                      />

                      {showDropdown && searchTerm && filteredLocations.length > 0 && (
                        <div style={{
                            //TODO: Dropdown is too messy. Separate out styles.
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          zIndex: 1000
                        }}>
                          {filteredLocations.map((loc) => (
                            <div
                              key={loc}
                              onClick={() => handleLocationSelect(loc)}
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #eee'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                              {loc}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', marginTop: '5px', color: '#666' }}>
                      Current: {locationArea}
                    </div>
                </div>
                <div className="gender">
                    <label>Gender: </label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as any)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="both">Both</option>
                    </select>
                </div>
                <div className="pokemonType">
                    <label>Pokemon type: </label>
                    <input value={pokemonType} onChange={(e) => setPokemonType(e.target.value)}></input>
                </div>
            </div>
        </div>
        <button onClick={onBack}>Back to App</button>
        </>
  ) 
}

