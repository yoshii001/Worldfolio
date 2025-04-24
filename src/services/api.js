import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// Fetch all countries with limited fields
export const getAllCountries = async () => {
  try {
    const response = await api.get('/all?fields=name,population,region,languages,flags,capital,cca3');
    return response.data;
  } catch (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }
};

// Search countries by name
export const searchCountriesByName = async (name) => {
  try {
    const response = await api.get(`/name/${name}?fields=name,population,region,languages,flags,capital,cca3`);
    return response.data;
  } catch (error) {
    console.error(`Error searching countries by name (${name}):`, error);
    if (error.response && error.response.status === 404) {
      return []; // Return empty array if no countries found
    }
    throw error;
  }
};

// Filter countries by region
export const filterCountriesByRegion = async (region) => {
  try {
    const response = await api.get(`/region/${region}?fields=name,population,region,languages,flags,capital,cca3`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries by region (${region}):`, error);
    throw error;
  }
};

// Filter countries by language
export const filterCountriesByLanguage = async (language) => {
  try {
    const response = await api.get(`/lang/${language}?fields=name,population,region,languages,flags,capital,cca3`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries by language (${language}):`, error);
    throw error;
  }
};

// Get detailed country information by country code
export const getCountryByCode = async (code) => {
  try {
    const response = await api.get(`/alpha/${code}?fields=name,population,region,languages,flags,capital,currencies,borders,timezones,subregion,tld,cca3`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching country by code (${code}):`, error);
    throw error;
  }
};

// Get countries by multiple codes (for borders)
export const getCountriesByCodes = async (codes) => {
  if (!codes || codes.length === 0) return [];
  
  try {
    const codesParam = codes.join(',');
    const response = await api.get(`/alpha?codes=${codesParam}&fields=name,cca3`);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries by codes:', error);
    throw error;
  }
};

export default api;