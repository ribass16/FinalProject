import { useEffect, useState } from "react";
import { subscribeAutomoveis, deleteAutomovel } from "../services/firestoreService";
import { useNavigate } from "react-router-dom";

const CarsManagement = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeAutomoveis((allCars) => {
      setCars(allCars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id, brand, model) => {
    if (window.confirm(`Tem certeza que deseja apagar ${brand} ${model}?`)) {
      const result = await deleteAutomovel(id);
      if (result.success) {
        alert("Carro apagado com sucesso!");
      } else {
        alert("Erro ao apagar: " + result.error);
      }
    }
  };

  const filteredCars = cars.filter((car) => {
    if (filter === "available") return car.available;
    if (filter === "unavailable") return !car.available;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestão de Carros</h1>
          <p className="text-sm text-gray-600 mt-1">Gerir, editar e organizar o inventário</p>
        </div>
        <button
          onClick={() => navigate("/admin/add-car")}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Adicionar Carro
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos ({cars.length})
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === "available"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Disponíveis ({cars.filter((c) => c.available).length})
          </button>
          <button
            onClick={() => setFilter("unavailable")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === "unavailable"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Indisponíveis ({cars.filter((c) => !c.available).length})
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Imagem
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Marca
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Modelo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Ano
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Preço
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Categoria
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-400">
                    Nenhum carro encontrado
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      {car.image ? (
                        <img
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                          Sem foto
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {car.brand}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{car.model}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{car.year}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      €{car.price?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {car.category || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          car.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {car.available ? "Disponível" : "Indisponível"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/edit-car/${car.id}`, { state: { car } })}
                          className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(car.id, car.brand, car.model)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          Apagar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CarsManagement;
