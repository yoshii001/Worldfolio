import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FilterMenu from '../components/FilterMenu';
import CountryList from '../components/CountryList';
import { 
  getAllCountries, 
  searchCountriesByName, 
  filterCountriesByRegion,
  filterCountriesByLanguage 
} from '../services/api';

function HomePage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const fetchInitialCountries = async () => {
      setLoading(true);
      try {
        const data = await getAllCountries();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCountries();
  }, []);

  const handleSearch = async (query) => {
    if (!query) return;
    
    setSearchQuery(query);
    setSelectedRegion('');
    setSelectedLanguage('');
    setActiveFilter('search');
    setLoading(true);
    
    try {
      const data = await searchCountriesByName(query);
      setCountries(data);
    } catch (error) {
      console.error('Error searching countries:', error);
      setError('No countries found matching your search.');
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = async (region) => {
    if (!region) {
      setActiveFilter('all');
      setSelectedRegion('');
      fetchAllCountries();
      return;
    }
    
    setSelectedRegion(region);
    setSelectedLanguage('');
    setSearchQuery('');
    setActiveFilter('region');
    setLoading(true);
    
    try {
      const data = await filterCountriesByRegion(region);
      setCountries(data);
    } catch (error) {
      console.error('Error filtering by region:', error);
      setError('Failed to load countries for this region.');
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (language) => {
    if (!language) {
      setActiveFilter('all');
      setSelectedLanguage('');
      fetchAllCountries();
      return;
    }
    
    setSelectedLanguage(language);
    setSelectedRegion('');
    setSearchQuery('');
    setActiveFilter('language');
    setLoading(true);
    
    try {
      const data = await filterCountriesByLanguage(language);
      setCountries(data);
    } catch (error) {
      console.error('Error filtering by language:', error);
      setError('Failed to load countries for this language.');
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCountries = async () => {
    setLoading(true);
    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching all countries:', error);
      setError('Failed to load countries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://i.ibb.co/N2NgTLzx/worldbg.jpg")',
            transform: 'translateZ(-1px) scale(2)',
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Explore the World with Worldfolio
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90 animate-slide-up">
              Discover countries, cultures, and data from around the globe
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto animate-fade-in">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter Controls */}
        <div className="mb-8">
          <FilterMenu 
            onRegionChange={handleRegionChange} 
            onLanguageChange={handleLanguageChange} 
          />
          
          {/* Active Filter Indicators */}
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilter === 'search' && searchQuery && (
              <div className="inline-flex items-center bg-[#3498DB] bg-opacity-10 text-[#2C3E50] px-3 py-1 rounded-full text-sm">
                <span>Search: {searchQuery}</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                    fetchAllCountries();
                  }}
                  className="ml-2 text-[#E74C3C] hover:text-[#2C3E50]"
                >
                  ×
                </button>
              </div>
            )}
            
            {activeFilter === 'region' && selectedRegion && (
              <div className="inline-flex items-center bg-[#3498DB] bg-opacity-10 text-[#2C3E50] px-3 py-1 rounded-full text-sm">
                <span>Region: {selectedRegion}</span>
                <button
                  onClick={() => {
                    setSelectedRegion('');
                    setActiveFilter('all');
                    fetchAllCountries();
                  }}
                  className="ml-2 text-[#E74C3C] hover:text-[#2C3E50]"
                >
                  ×
                </button>
              </div>
            )}
            
            {activeFilter === 'language' && selectedLanguage && (
              <div className="inline-flex items-center bg-[#3498DB] bg-opacity-10 text-[#2C3E50] px-3 py-1 rounded-full text-sm">
                <span>Language: {selectedLanguage}</span>
                <button
                  onClick={() => {
                    setSelectedLanguage('');
                    setActiveFilter('all');
                    fetchAllCountries();
                  }}
                  className="ml-2 text-[#E74C3C] hover:text-[#2C3E50]"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Countries Grid */}
        <CountryList 
          countries={countries} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  );
}

export default HomePage;