import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { addAutomovel, updateAutomovel } from "../services/firestoreService";

const CarForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = !!id;
  const carToEdit = location.state?.car;

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    category: "Sedan",
    available: true,
    image: "",
    description: "",
    mileage: "",
    fuel: "Gasolina",
    transmission: "Manual",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && carToEdit) {
      setFormData({
        brand: carToEdit.brand || "",
        model: carToEdit.model || "",
        year: carToEdit.year || new Date().getFullYear(),
        price: carToEdit.price || "",
        category: carToEdit.category || "Sedan",
        available: carToEdit.available !== undefined ? carToEdit.available : true,
        image: carToEdit.image || "",
        description: carToEdit.description || "",
        mileage: carToEdit.mileage || "",
        fuel: carToEdit.fuel || "Gasolina",
        transmission: carToEdit.transmission || "Manual",
      });
    }
  }, [isEditMode, carToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validacao 
    if (!formData.brand || !formData.model || !formData.price) {
      alert("Por favor, preencha os campos obrigatórios: Marca, Modelo e Preço");
      setLoading(false);
      return;
    }

    const carData = {
      ...formData,
      price: parseFloat(formData.price),
      year: parseInt(formData.year),
      mileage: formData.mileage ? parseInt(formData.mileage) : 0,
    };

    let result;
    if (isEditMode) {
      result = await updateAutomovel(id, carData);
    } else {
      result = await addAutomovel(carData);
    }

    setLoading(false);

    if (result.success) {
      alert(isEditMode ? "Carro atualizado com sucesso!" : "Carro adicionado com sucesso!");
      navigate("/admin/cars");
    } else {
      alert("Erro: " + result.error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/cars")}
          className="text-gray-600 hover:text-gray-900 font-medium mb-4 flex items-center gap-2 text-sm"
        >
          <span>←</span>
          <span>Voltar</span>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? "Editar Carro" : "Adicionar Carro"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">Preencha as informações do veículo</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Marca *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Ex: BMW, Mercedes, Audi"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Ex: Serie 3, Classe C"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ano
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Preço (€) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Ex: 25000"
                min="0"
                step="100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Station">Station</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Desportivo">Desportivo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Quilometragem (km)
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Ex: 50000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Combustível
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Diesel">Diesel</option>
                <option value="Elétrico">Elétrico</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Transmissão
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              URL da Imagem
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-32 h-24 object-cover rounded-md border border-gray-200"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              rows="3"
              placeholder="Descrição detalhada do veículo..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-1 focus:ring-gray-900"
            />
            <label className="text-sm font-medium text-gray-700">
              Carro disponível para venda
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-md text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "A processar..." : isEditMode ? "Atualizar Carro" : "Adicionar Carro"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/cars")}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium py-2 rounded-md text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarForm;
