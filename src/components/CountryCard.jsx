import { Link } from 'react-router-dom';

function CountryCard({ country }) {
  // Format population with commas
  const formatPopulation = (population) => {
    return population.toLocaleString();
  };

  // Get languages as a comma-separated string
  const getLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  return (
    <Link to={`/country/${country.cca3}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
        {/* Country Flag */}
        <div className="h-48 overflow-hidden">
          <img 
            src={country.flags.svg || country.flags.png} 
            alt={`Flag of ${country.name.common}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        {/* Country Info */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {country.name.common}
          </h2>
          
          <div className="space-y-2">
            <p className="flex items-start">
              <span className="font-medium text-gray-700 mr-2 min-w-[120px]">Population:</span>
              <span className="text-gray-600">{formatPopulation(country.population)}</span>
            </p>
            
            <p className="flex items-start">
              <span className="font-medium text-gray-700 mr-2 min-w-[120px]">Region:</span>
              <span className="text-gray-600">{country.region}</span>
            </p>
            
            <p className="flex items-start">
              <span className="font-medium text-gray-700 mr-2 min-w-[120px]">Capital:</span>
              <span className="text-gray-600">
                {country.capital && country.capital.length > 0 
                  ? country.capital.join(', ') 
                  : 'N/A'}
              </span>
            </p>
            
            <p className="flex items-start">
              <span className="font-medium text-gray-700 mr-2 min-w-[120px]">Languages:</span>
              <span className="text-gray-600">{getLanguages(country.languages)}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CountryCard;