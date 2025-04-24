import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';
import { getSearchSuggestions } from '../services/gemini';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) return setSuggestions([]);
      try {
        const results = await getSearchSuggestions(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSuggestions(searchTerm);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (value) => {
    setSearchTerm(value);
    onSearch(value);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20} />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search country here..."
          className="w-full py-3 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-300 backdrop-blur-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
      </div>

      {showSuggestions && searchTerm.length > 1 && (
        <ul className="absolute w-full mt-2 bg-white/80 text-gray-800 backdrop-blur-xl rounded-xl shadow-md overflow-hidden z-50">
          {suggestions.length > 0 ? (
            suggestions.map((item, i) => (
              <li
                key={i}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition"
                onClick={() => handleSuggestionClick(item)}
              >
                {item}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-center text-gray-500">No suggestions found</li>
          )}
        </ul>
      )}
    </form>
  );
}

export default SearchBar;
