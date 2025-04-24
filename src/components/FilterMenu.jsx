import { useState, useEffect } from 'react';

function FilterMenu({ onRegionChange, onLanguageChange }) {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languages, setLanguages] = useState([]);
  
  const regions = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania'
  ];

  // Common languages to filter by
  const commonLanguages = [
    'English',
    'Spanish',
    'French',
    'Arabic',
    'Chinese',
    'Russian',
    'Portuguese',
    'German',
    'Japanese',
    'Hindi'
  ];

  useEffect(() => {
    setLanguages(commonLanguages);
  }, []);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    onRegionChange(region);
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    onLanguageChange(language);
  };

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      {/* Region Filter */}
      <div className="relative">
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="appearance-none block w-full px-4 py-3 pr-8 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          <option value="">Filter by Region</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {/* Language Filter */}
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="appearance-none block w-full px-4 py-3 pr-8 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          <option value="">Filter by Language</option>
          {languages.map(language => (
            <option key={language} value={language.toLowerCase()}>{language}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default FilterMenu;