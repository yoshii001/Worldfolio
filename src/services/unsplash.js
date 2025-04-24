import axios from 'axios';

const UNSPLASH_API_KEY = 'uj0nBu9IbLLGy3hNz4BqVVa90jk6g34I1CTxHT2rtwM';
const BASE_URL = 'https://api.unsplash.com';

// Create axios instance with base URL and authorization
const unsplashApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
  }
});

// Get country images from Unsplash
export const getCountryImages = async (countryName) => {
  try {
    const response = await unsplashApi.get('/search/photos', {
      params: {
        query: countryName,
        per_page: 5,
        orientation: 'landscape',
      }
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching images for ${countryName}:`, error);
    return []; // Return empty array on error
  }
};

export default unsplashApi;