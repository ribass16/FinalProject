import { useEffect, useState } from "react";
import { subscribeAutomoveis } from "../services/firestoreService";
import { subscribeAgendamentos } from "../services/appointmentService";
import { useAuth } from '../contexts/authContextObject';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribeCars = subscribeAutomoveis((allCars) => {
      setCars(allCars);
      setLoading(false);
    });

    const unsubscribeAgendamentos = subscribeAgendamentos((allAgendamentos) => {
      setAgendamentos(allAgendamentos);
    });

    return () => {
      unsubscribeCars();
      unsubscribeAgendamentos();
    };
  }, []);

  const totalCars = cars.length;
  const availableCars = cars.filter((car) => car.available).length;
  const pendingAgendamentos = agendamentos.filter((ag) => ag.status === "pendente").length;
  
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
      <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-0"></h2>
          <p className="text-gray-600 mt-1">Bem-vindo, <span className="font-medium text-gray-900">{user?.displayName || user?.email}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total de Carros</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{totalCars}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Disponíveis</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{availableCars}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Agendamentos Pendentes</p>
              <p className="mt-2 text-3xl font-bold text-orange-600">{pendingAgendamentos}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">€{totalInventoryValue.toLocaleString()}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 lg:col-span-1 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Carros por Categoria</h2>
          <div className="space-y-3">
            {Object.entries(carsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700 font-medium">{category}</span>
                <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{count}</span>
              </div>
            ))}
            {Object.keys(carsByCategory).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Sem dados disponíveis</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 lg:col-span-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Últimos Carros Adicionados</h2>
            <button
              onClick={() => navigate("/admin/add-car")}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Adicionar
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
