// src/components/public/CarCard.jsx
import { Link } from "react-router-dom";

const CarCard = ({ car }) => {
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
        
        <div className="absolute top-4 right-4">
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
            <p className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
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
