import React, { useState } from 'react';
import { useCountries } from '../hooks/useCountries';
import { Country } from '../types';

interface CountrySearchProps {
  onCountrySelect: (country: Country) => void;
}

const CountrySearch: React.FC<CountrySearchProps> = ({ onCountrySelect }) => {
  const [query, setQuery] = useState('');
  const { countries, loading, error, searchCountries } = useCountries();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchCountries(value);
  };

  const handleCountryClick = (country: Country) => {
    onCountrySelect(country);
  };

  return (
    <div style={{ padding: '20px', width: '300px' }}>
      <h3>Search</h3>
      
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="country name..."
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {countries.map((country) => (
          <div
            key={country.code}
            onClick={() => handleCountryClick(country)}
            style={{
              padding: '8px',
              border: '1px solid #eee',
              margin: '2px 0',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <img 
              src={country.flag} 
              alt={`${country.name} flag`}
              style={{ width: '24px', height: '16px' }}
            />
            <span>{country.name} ({country.code})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountrySearch;