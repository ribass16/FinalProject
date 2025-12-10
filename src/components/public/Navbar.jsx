// src/components/public/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const navLinks = [
    { path: "/", label: "Início", icon: "🏠" },
    { path: "/cars", label: "Carros", icon: "🚗" },
    { path: "/contact", label: "Contacto", icon: "📞" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
            <span className="text-4xl">🏎️</span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Amaralcar
              </h1>
              <p className="text-xs text-gray-500">O seu stand de confiança</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                if (user) {
                  navigate('/admin');
                } else {
                  navigate('/login');
                }
              }}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <span>🔐</span>
              <span>{user ? 'Admin' : 'Entrar'}</span>
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-3xl"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-semibold mb-2 transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (user) navigate('/admin');
                else navigate('/login');
              }}
              className="block w-full text-left bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold"
            >
              <span className="mr-2">🔐</span>
              {user ? 'Admin' : 'Entrar'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
