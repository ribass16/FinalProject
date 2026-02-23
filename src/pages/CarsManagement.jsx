import { useEffect, useState } from "react";
import { subscribeAutomoveis, deleteAutomovel } from "../services/firestoreService";
import { useNavigate } from "react-router-dom";
import { getPrimaryCarImage, handleCarImageError } from "../utils/imageUtils";

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
      <div className="flex justify-between items-center mb-8">
        <div>
          {/* Title is shown in the Layout header; avoid repeating here */}
        </div>
        <button
          onClick={() => navigate("/admin/add-car")}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-lg"
        >
          + Adicionar Carro
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-gray-900 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos ({cars.length})
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "available"
                ? "bg-gray-900 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Disponíveis ({cars.filter((c) => c.available).length})
          </button>
          <button
            onClick={() => setFilter("unavailable")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "unavailable"
                ? "bg-gray-900 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Indisponíveis ({cars.filter((c) => !c.available).length})
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* responsividade para telemovel */}
        <div className="md:hidden space-y-3 p-4">
          {filteredCars.length === 0 ? (
            <div className="text-center text-sm text-gray-500">Nenhum carro encontrado</div>
          ) : (
            filteredCars.map((car) => (
              <div key={car.id} className="border border-gray-100 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={getPrimaryCarImage(car)}
                    alt={`${car.brand} ${car.model}`}
                    onError={handleCarImageError}
                    className="w-16 h-12 object-cover rounded-md"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{car.brand} {car.model}</div>
                    <div className="text-xs text-gray-500">{car.year} • €{car.price?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${car.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {car.available ? 'Disponível' : 'Indisponível'}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/edit-car/${car.id}`, { state: { car } })} className="bg-gray-900 text-white px-3 py-1 text-xs rounded-md">Editar</button>
                    <button onClick={() => handleDelete(car.id, car.brand, car.model)} className="bg-red-600 text-white px-3 py-1 text-xs rounded-md">Apagar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Imagem
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ano
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                      <img
                        src={getPrimaryCarImage(car)}
                        alt={`${car.brand} ${car.model}`}
                        onError={handleCarImageError}
                        className="w-12 h-12 object-cover rounded-md"
                      />
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
