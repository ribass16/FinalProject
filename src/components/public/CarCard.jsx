import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { addFavorito, removeFavorito, isFavorito } from "../../services/favoritesService";

const CarCard = ({ car }) => {
  const { user, userProfile } = useAuth();
  const [favoritoState, setFavoritoState] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && userProfile?.role === 'cliente') {
      isFavorito(user.uid, car.id).then(setFavoritoState);
    }
  }, [user, userProfile, car.id]);

  const handleToggleFavorito = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Faz login para adicionar aos favoritos!');
      return;
    }

    if (userProfile?.role !== 'cliente') {
      return;
    }

    setLoading(true);
    try {
      if (favoritoState) {
        const result = await removeFavorito(user.uid, car.id);
        if (result.success) {
          setFavoritoState(false);
        }
      } else {
        const result = await addFavorito(user.uid, car.id);
        if (result.success) {
          setFavoritoState(true);
        } else if (result.error === "Carro ja esta nos favoritos") {
          setFavoritoState(true);
        }
      }
    } catch (error) {
      console.error('Erro ao toggle favorito:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Link
      to={`/cars/${car.id}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
    >
      <div className="relative h-56 overflow-hidden bg-gray-200">
        {car.image ? (
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🚗
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex gap-2">
          {user && userProfile?.role === 'cliente' && (
            <button
              onClick={handleToggleFavorito}
              disabled={loading}
              className={`p-2 rounded-full shadow-lg transition-all duration-300 ${
                favoritoState
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
              }`}
              title={favoritoState ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <svg className="w-5 h-5" fill={favoritoState ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
              car.available
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
            }`}
          >
            {car.available ? "✓ Disponível" : "✕ Indisponível"}
          </span>
        </div>

        {car.category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-black/70 text-white backdrop-blur-sm">
              {car.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
          {car.brand} {car.model}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <span>📅</span>
            <span>{car.year}</span>
          </span>
          {car.mileage && (
            <span className="flex items-center gap-1">
              <span>🛣️</span>
              <span>{car.mileage?.toLocaleString()} km</span>
            </span>
          )}
          {car.fuel && (
            <span className="flex items-center gap-1">
              <span>⛽</span>
              <span>{car.fuel}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Preço</p>
            <p className="text-3xl font-black text-gray-900">
              €{car.price?.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-lg font-semibold group-hover:shadow-lg transition-shadow">
            Ver Detalhes →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
