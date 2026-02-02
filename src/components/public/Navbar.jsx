import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";
import { useRef, useState as useStateLocal } from 'react';

const ImgFallback = ({ sources = [], fallback, alt = '', className = '' }) => {
  const [srcIndex, setSrcIndex] = useStateLocal(0);
  const tried = useRef(new Set());

  const handleError = (e) => {
    tried.current.add(sources[srcIndex]);
    const next = sources.findIndex((s, i) => !tried.current.has(s) && i > srcIndex);
    if (next !== -1) {
      setSrcIndex(next);
    } else {
      e.currentTarget.onerror = null;
      e.currentTarget.src = fallback;
    }
  };

  return (
    <img
      src={sources[srcIndex]}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
};

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfilePulse, setShowProfilePulse] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  // scroll para o topo ao mudar de pag
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Verificar se e um novo utilizador e mostrar animação
  useEffect(() => {
    if (user && userProfile) {
      const isNewUser = localStorage.getItem(`newUser_${user.uid}`);
      if (isNewUser === 'true') {
        setShowProfilePulse(true);
        // Remover animação após 10 segundos
        setTimeout(() => {
          setShowProfilePulse(false);
          localStorage.removeItem(`newUser_${user.uid}`);
        }, 10000);
      }
    }
  }, [user, userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const navLinks = [
    { path: "/", label: "Início" },
    { path: "/cars", label: "Carros" },
    { path: "/contact", label: "Contacto" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
            <ImgFallback
              sources={["/logo.png", "/amaralcar.png", "/amaralcar-logo.png"]}
              fallback={logo}
              className="h-16 sm:h-18 w-auto object-contain"
              alt="Amaralcar"
            />
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
                <span>{link.label}</span>
              </Link>
            ))}
            
            {user && userProfile?.role === 'cliente' && (
              <Link
                to="/favoritos"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isActive('/favoritos')
                    ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >

                <span>Favoritos</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                {userProfile?.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                  >
                    <span>🔐</span>
                    <span>Área Admin</span>
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={() => navigate('/profile')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      isActive('/profile')
                        ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } ${showProfilePulse ? 'animate-pulse ring-4 ring-blue-400' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{userProfile?.nome || user.email}</span>
                  </button>
                  {showProfilePulse && (
                    <div className="absolute -top-1 -right-1">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <span>Entrar</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-900 p-2"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
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
                {link.label}
              </Link>
            ))}
            
            {user && userProfile?.role === 'cliente' && (
              <Link
                to="/favoritos"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-semibold mb-2 transition-all duration-300 ${
                  isActive('/favoritos')
                    ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Favoritos
              </Link>
            )}

            {user ? (
              <>
                {userProfile?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="block w-full text-left bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold mb-2"
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/profile');
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-semibold mb-2 transition-all duration-300 ${
                    isActive('/profile')
                      ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } ${showProfilePulse ? 'animate-pulse ring-4 ring-blue-400' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{userProfile?.nome || user.email}</span>
                    {showProfilePulse && (
                      <span className="ml-auto relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/login');
                }}
                className="block w-full text-left bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold"
              >
                Entrar
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
