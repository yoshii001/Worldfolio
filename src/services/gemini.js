import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyCggqSwo9CYaI15HWae5v4OL39-hFxvJIc';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const getCountryInfo = async (countryData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { 
                text: `Tell me more about this country: ${JSON.stringify(countryData)}. 
                       Format your response in sections:
                       
                       1. Brief Overview
                       2. Geography and Climate
                       3. Culture and People
                       4. Economy
                       5. Interesting Facts
                       
                       Keep each section concise with 2-3 sentences max.
                       Do not include any HTML tags or markdown formatting in your response.
                       Start each section with the section name followed by a colon.`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]) {
      return response.data.candidates[0].content.parts[0].text;
    }
    
    return 'No information available for this country.';
  } catch (error) {
    console.error('Error fetching AI country information:', error);
    return 'Failed to fetch country information from AI.';
  }
};

export const getSearchSuggestions = async (query) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { 
                text: `Given the search query "${query}", suggest 5 similar country names that might be relevant. 
                       Return only the country names separated by commas.`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]) {
      return response.data.candidates[0].content.parts[0].text.split(',').map(s => s.trim());
    }
    
    return [];
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
};

export const askCountryQuestion = async (countryData, question) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { 
                text: `Given this country data: ${JSON.stringify(countryData)}.
                       Answer this question: ${question}
                       Keep your answer brief and informative.
                       Do not include any HTML tags or markdown formatting in your response.`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]) {
      return response.data.candidates[0].content.parts[0].text;
    }
    
    return 'Sorry, I could not generate an answer to your question.';
  } catch (error) {
    console.error('Error asking AI question about country:', error);
    return 'Failed to get an answer from the AI assistant.';
  }
};

export default {
  getCountryInfo,
  askCountryQuestion,
  getSearchSuggestions
};