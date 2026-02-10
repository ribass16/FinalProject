import { useEffect, useState } from "react";
import { subscribeAutomoveis } from "../../services/firestoreService";
import CarCard from "../../components/public/CarCard";
import Filters from "../../components/public/Filters";

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    availability: "all",
    priceRange: { min: 0, max: Infinity },
  });

  useEffect(() => {
    const unsubscribe = subscribeAutomoveis((allCars) => {
      setCars(allCars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...cars];

    // Filtro de categoria
    if (filters.category !== "all") {
      filtered = filtered.filter((car) => car.category === filters.category);
    }

    // Filtro de disponibilidade
    if (filters.availability === "available") {
      filtered = filtered.filter((car) => car.available);
    } else if (filters.availability === "unavailable") {
      filtered = filtered.filter((car) => !car.available);
    }

    // Filtro de preco
    filtered = filtered.filter(
      (car) =>
        car.price >= filters.priceRange.min &&
        car.price <= filters.priceRange.max
    );

    setTimeout(() => setFilteredCars(filtered), 0);
  }, [cars, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">A carregar carros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Catálogo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore a nossa coleção completa de veículos
          </p>
        </div>

        <Filters filters={filters} setFilters={setFilters} cars={cars} />

        <div className="mb-6">
          <p className="text-gray-700 font-semibold text-lg">
            {filteredCars.length === 0
              ? "Nenhum carro encontrado"
              : `${filteredCars.length} ${filteredCars.length === 1 ? "carro encontrado" : "carros encontrados"}`}
          </p>
        </div>

        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, index) => (
              <div
                key={car.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Nenhum carro encontrado
            </h3>
            <p className="text-gray-600 mb-8">
              Tente ajustar os filtros para ver mais resultados
            </p>
            <button
              onClick={() =>
                setFilters({
                  category: "all",
                  availability: "all",
                  priceRange: { min: 0, max: Infinity },
                })
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
