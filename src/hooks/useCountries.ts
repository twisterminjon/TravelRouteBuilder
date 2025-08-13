import { useState, useEffect } from 'react';
import { Country } from '../types';
import { CountriesAPI } from '../services/CountriesAPI';

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCountries = async (query: string) => {
    if (!query.trim()) {
      setCountries([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await CountriesAPI.searchCountries(query);
      setCountries(data);
    } catch (err) {
      setError('Failed to search countries');
    } finally {
      setLoading(false);
    }
  };

  return {
    countries,
    loading,
    error,
    searchCountries
  };
};