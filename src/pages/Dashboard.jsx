import { useEffect, useState } from "react";
import { subscribeAutomoveis } from "../services/firestoreService";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeAutomoveis((allCars) => {
      setCars(allCars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalCars = cars.length;
  const availableCars = cars.filter((car) => car.available).length;
  const unavailableCars = totalCars - availableCars;
  
  // Calcular valor total dos carros
  const totalInventoryValue = cars.reduce((sum, car) => sum + (car.price || 0), 0);
  
  // Carros categoria
  const carsByCategory = cars.reduce((acc, car) => {
    const category = car.category || "Outros";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Últimos 5 carros adicionados
  const recentCars = cars.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Bem-vindo, {user?.displayName || user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total de Carros</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{totalCars}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Disponíveis</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{availableCars}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Indisponíveis</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{unavailableCars}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Valor Total</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">€{totalInventoryValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:col-span-1">
          <h2 className="text-sm font-semibold mb-4 text-gray-900">Carros por Categoria</h2>
          <div className="space-y-2">
            {Object.entries(carsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{category}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
            {Object.keys(carsByCategory).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Sem dados disponíveis</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Últimos Carros</h2>
            <button
              onClick={() => navigate("/admin/add-car")}
              className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            >
              Adicionar
            </button>
          </div>
          <div className="space-y-3">
            {recentCars.length > 0 ? (
              recentCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                  onClick={() => navigate("/admin/cars")}
                >
                  <div className="flex items-center gap-3">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.brand}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sem foto</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-xs text-gray-500">Ano: {car.year}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-gray-900">
                      €{car.price?.toLocaleString()}
                    </p>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${
                        car.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {car.available ? "Disponível" : "Indisponível"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Nenhum carro adicionado ainda</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-3 text-gray-900">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => navigate("/admin/add-car")}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            Adicionar Carro
          </button>
          <button
            onClick={() => navigate("/admin/cars")}
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            Gerir Carros
          </button>
          <button
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            Relatórios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
