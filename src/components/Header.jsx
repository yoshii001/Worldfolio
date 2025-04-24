import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#2C3E50] shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Worldfolio
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-white hover:text-[#E74C3C] transition-colors duration-300 ${
              location.pathname === '/' ? 'font-medium text-[#3498DB]' : ''
            }`}
          >
            Home
          </Link>
          {currentUser ? (
            <>
              <span className="text-white">
                {currentUser.email}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-[#3498DB] hover:bg-[#E74C3C] text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className={`text-white hover:text-[#E74C3C] transition-colors duration-300 ${
                location.pathname === '/login' ? 'font-medium text-[#3498DB]' : ''
              }`}
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#2C3E50] shadow-lg py-4 px-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-white hover:text-[#E74C3C] transition-colors duration-300 ${
                location.pathname === '/' ? 'font-medium text-[#3498DB]' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {currentUser ? (
              <>
                <span className="text-white">
                  {currentUser.email}
                </span>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-[#3498DB] hover:bg-[#E74C3C] text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`text-white hover:text-[#E74C3C] transition-colors duration-300 ${
                  location.pathname === '/login' ? 'font-medium text-[#3498DB]' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;