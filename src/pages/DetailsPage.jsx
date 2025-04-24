import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCode, getCountriesByCodes } from '../services/api';
import { getCountryInfo } from '../services/gemini';
import CountryGallery from '../components/CountryGallery';
import ChatBox from '../components/ChatBox';
import NewsFeed from '../components/NewsFeed';

function DetailsPage() {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [aiInfo, setAiInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryData = await getCountryByCode(id);
        setCountry(countryData);

        if (countryData.borders?.length) {
          const bordersData = await getCountriesByCodes(countryData.borders);
          setBorderCountries(bordersData);
        }

        const ai = await getCountryInfo(countryData);
        setAiInfo(ai);
      } catch (err) {
        console.error(err);
        setError('Could not load country info.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-16 w-16 border-t-4 border-[#3498DB] border-solid rounded-full" />
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center px-4">
        <div>
          <h2 className="text-red-600 text-xl mb-4">{error || 'Country not found.'}</h2>
          <Link to="/" className="bg-[#3498DB] text-white px-4 py-2 rounded-md">Back to Home</Link>
        </div>
      </div>
    );
  }

  const formatPopulation = (n) => n.toLocaleString();
  const getLanguages = (l) => l ? Object.values(l).join(', ') : 'N/A';
  const getCurrencies = (c) =>
    c ? Object.values(c).map(cur => `${cur.name} (${cur.symbol || ''})`).join(', ') : 'N/A';

  const formatAiInfo = (text) => {
    return text.split('\n').map((section, index) => {
      const [title, ...content] = section.split(':');
      if (!content.length) return null;
      return (
        <div key={index} className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{title.trim()}</h3>
          <p className="text-gray-700 leading-relaxed">{content.join(':').trim()}</p>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={country.flags.svg || country.flags.png}
          alt={country.name.common}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4">{country.name.common}</h1>
            <p className="text-lg sm:text-xl md:text-2xl mt-2 opacity-80">{country.name.official}</p>
          </div>
        </div>
      </div>

      {/* Country Info Overview Section */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Flag */}
          <div className="flex justify-center">
            <img
              src={country.flags.svg || country.flags.png}
              alt={`${country.name.common} flag`}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-md"
            />
          </div>

          {/* Details */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">{country.name.official}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
              <div><strong>Population:</strong> {formatPopulation(country.population)}</div>
              <div><strong>Capital:</strong> {country.capital?.join(', ') || 'N/A'}</div>
              <div><strong>Region:</strong> {country.region}</div>
              <div><strong>Subregion:</strong> {country.subregion}</div>
              <div><strong>Currencies:</strong> {getCurrencies(country.currencies)}</div>
              <div><strong>Languages:</strong> {getLanguages(country.languages)}</div>
              <div><strong>Top-level Domain:</strong> {country.tld?.join(', ') || 'N/A'}</div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-3">Border Countries:</h4>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map((b) => (
                  <Link
                    to={`/country/${b.cca3}`}
                    key={b.cca3}
                    className="bg-gray-100 text-[#3498DB] px-3 py-1 rounded-md hover:bg-gray-200 transition"
                  >
                    {b.name.common}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* LEFT SIDE - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Country Overview</h2>
            <div className="prose max-w-none">
              {formatAiInfo(aiInfo)}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
            <h3 className="text-2xl font-semibold mb-6">Ask About {country.name.common}</h3>
            <div className="w-full">
              <ChatBox
                countryData={country}
                population={formatPopulation(country.population)}
                region={country.region}
                capital={country.capital?.join(', ') || 'N/A'}
                languages={getLanguages(country.languages)}
                currencies={getCurrencies(country.currencies)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Widgets */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6">Photo Gallery</h3>
            <CountryGallery countryName={country.name.common} />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6">News Feed</h3>
            <div className="w-full max-h-[500px] overflow-y-auto">
              <NewsFeed countryName={country.name.common} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
