import { useState, useEffect } from 'react';
import { getCountryNews } from '../services/news';

function NewsFeed({ countryName }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const newsData = await getCountryNews(countryName);
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news.');
      } finally {
        setLoading(false);
      }
    };

    if (countryName) {
      fetchNews();
    }
  }, [countryName]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600 text-sm">No recent news available for {countryName}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.slice(0, 5).map((article, index) => (
        <a 
          key={index} 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row">
              {article.urlToImage && (
                <div className="sm:w-1/3 h-48 sm:h-32">
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-4 sm:w-2/3">
                <div className="flex flex-wrap items-center text-xs text-gray-500 mb-2">
                  <span className="mr-2">{article.source.name}</span>
                  <span className="mr-2">•</span>
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {article.description}
                </p>
                <span className="text-primary-600 text-xs sm:text-sm font-medium">Read more →</span>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default NewsFeed;