import axios from 'axios';

const NEWS_API_KEY = '1f4208df316cff84589b0b273085f0f0';
const BASE_URL = 'https://gnews.io/api/v4';

// Create axios instance
const newsApi = axios.create({
  baseURL: BASE_URL,
});

// Get news related to a country
export const getCountryNews = async (countryName) => {
  try {
    const response = await newsApi.get('/search', {
      params: {
        q: countryName,
        lang: 'en',
        country: 'us',
        max: 10,
        apikey: NEWS_API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error(`Error fetching news for ${countryName}:`, error);
    return []; // Return empty array on error
  }
};

export default {
  getCountryNews,
};