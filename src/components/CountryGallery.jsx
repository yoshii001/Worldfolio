import { useState, useEffect } from 'react';
import { getCountryImages } from '../services/unsplash';

function CountryGallery({ countryName }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const imageData = await getCountryImages(countryName);
        setImages(imageData);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    if (countryName) {
      fetchImages();
    }
  }, [countryName]);

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((placeholder) => (
          <div 
            key={placeholder}
            className="relative pb-[66.25%] bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 animate-pulse">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                   style={{
                     backgroundSize: '200% 100%',
                     animation: 'shimmer 1.5s infinite linear'
                   }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">No images available for {countryName}.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => openLightbox(image)}
          >
            <div className="relative pb-[66.25%] bg-gradient-to-r from-gray-200 to-gray-300">
              <img
                src={image.urls.regular}
                alt={image.alt_description || `Image of ${countryName}`}
                className={`absolute h-full w-full object-cover transition-all duration-500 ${
                  loadedImages.has(image.id)
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105'
                }`}
                onLoad={() => handleImageLoad(image.id)}
                loading="lazy"
              />
              {!loadedImages.has(image.id) && (
                <div className="absolute inset-0 animate-pulse">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                       style={{
                         backgroundSize: '200% 100%',
                         animation: 'shimmer 1.5s infinite linear'
                       }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={closeLightbox}
            >
              ✕
            </button>
            <img
              src={selectedImage.urls.regular}
              alt={selectedImage.alt_description || `Image of ${countryName}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-white text-sm mt-2">
              {selectedImage.description || `Photo of ${countryName}`}
              {selectedImage.user && (
                <span className="block mt-1">
                  Photo by{' '}
                  <a
                    href={`https://unsplash.com/@${selectedImage.user.username}?utm_source=worldfolio&utm_medium=referral`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary-300"
                  >
                    {selectedImage.user.name}
                  </a>
                  {' '}on{' '}
                  <a
                    href="https://unsplash.com/?utm_source=worldfolio&utm_medium=referral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary-300"
                  >
                    Unsplash
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CountryGallery;