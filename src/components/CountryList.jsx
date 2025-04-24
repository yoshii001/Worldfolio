import { useState, useEffect } from 'react';
import CountryCard from './CountryCard';

function CountryList({ countries, loading, error }) {
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    if (countries && countries.length > 0) {
      setDisplayedCountries(countries.slice(0, visibleCount));
    }
  }, [countries, visibleCount]);

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 12);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="bg-yellow-50 p-8 rounded-lg text-center">
        <p className="text-yellow-700 text-lg">No countries found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayedCountries.map(country => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>
      
      {countries.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default CountryList;