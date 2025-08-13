import axios from 'axios';
import { Country } from '../types';

const BASE_URL = 'https://restcountries.com/v3.1';

export class CountriesAPI {
  
  static async searchCountries(query: string): Promise<Country[]> {
    if (query.length < 2) return [];
    
    try {
      const response = await axios.get(`${BASE_URL}/name/${query}?fields=name,cca2,flags`);
      return response.data.map((country: any) => ({
        name: country.name.common,
        code: country.cca2,
        flag: country.flags.png
      }));
    } catch (error) {
      console.error('Error searching countries:', error);
      return [];
    }
  }
}