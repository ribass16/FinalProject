import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { addAutomovel, updateAutomovel } from "../services/firestoreService";
import { uploadMultipleImages } from "../services/imgbbService";

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
    images: [],
    description: "",
    mileage: "",
    engineCapacity: "",
    seats: "",
    bodyType: "",
    fuel: "Gasolina",
    power: "",
    doors: "",
    vin: "",
    monthYear: "",
    transmission: "Manual",
    color: "",
    origin: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);

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
        images: carToEdit.images || [],
        description: carToEdit.description || "",
        mileage: carToEdit.mileage || "",
        engineCapacity: carToEdit.engineCapacity || "",
        seats: carToEdit.seats || "",
        bodyType: carToEdit.bodyType || "",
        fuel: carToEdit.fuel || "Gasolina",
        power: carToEdit.power || "",
        doors: carToEdit.doors || "",
        vin: carToEdit.vin || "",
        monthYear: carToEdit.monthYear || "",
        transmission: carToEdit.transmission || "Manual",
        color: carToEdit.color || "",
        origin: carToEdit.origin || "",
      });
      
      // Carregar previews das imagens existentes
      if (carToEdit.images && carToEdit.images.length > 0) {
        setImagePreviews(carToEdit.images);
      }
    }
  }, [isEditMode, carToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
      
      // Criar previews locais
      const previews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    if (imageFiles.length > 0) {
      const newFiles = Array.from(imageFiles).filter((_, i) => i !== index);
      setImageFiles(newFiles);
    }
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

    let imageUrls = [...(formData.images || [])];

    // Se houver ficheiros para upload, fazer upload primeiro
    if (imageFiles.length > 0) {
      setUploadProgress(true);
      
      const uploadResult = await uploadMultipleImages(imageFiles);
      setUploadProgress(false);
      
      if (uploadResult.success) {
        imageUrls = uploadResult.urls;
        
        if (uploadResult.failed > 0) {
          alert(`${uploadResult.failed} de ${uploadResult.total} imagens falharam. Continuando com as restantes.`);
        }
      } else {
        alert('Erro ao fazer upload: ' + (uploadResult.errors ? uploadResult.errors.join(', ') : 'Erro desconhecido'));
        setLoading(false);
        return;
      }
    }

    // Compatibilidade: usar primeira imagem como 'image' principal
    const mainImage = imageUrls[0] || formData.image || "";

    const parseIntOrNull = (value) => {
      if (value === "" || value === null || value === undefined) return null;
      const parsed = parseInt(value, 10);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const carData = {
      ...formData,
      price: parseFloat(formData.price),
      year: parseInt(formData.year, 10),
      mileage: parseIntOrNull(formData.mileage),
      engineCapacity: parseIntOrNull(formData.engineCapacity),
      seats: parseIntOrNull(formData.seats),
      power: parseIntOrNull(formData.power),
      doors: parseIntOrNull(formData.doors),
      bodyType: formData.bodyType || formData.category,
      image: mainImage,
      images: imageUrls,
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
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/cars")}
          className="text-gray-600 hover:text-gray-900 font-semibold mb-4 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Voltar</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Editar Carro" : "Adicionar Novo Carro"}
        </h1>
        <p className="text-gray-600 mt-2">Preencha as informações do veículo com atenção</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: BMW, Mercedes, Audi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: Serie 3, Classe C"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ano
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preço (€) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: 25000"
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Station">Station</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quilometragem (km)
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: 50000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Combustível
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Diesel">Diesel</option>
                <option value="Elétrico">Elétrico</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transmissão
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
              >
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cilindrada (cc)
              </label>
              <input
                type="number"
                name="engineCapacity"
                value={formData.engineCapacity}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: 1968"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Potência (cv)
              </label>
              <input
                type="number"
                name="power"
                value={formData.power}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: 122"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lugares
              </label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: 5"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Portas
              </label>
              <input
                type="number"
                name="doors"
                value={formData.doors}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: 5"
                min="1"
              />
            </div>


            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                VIN
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: WBA3B5C50EP123456"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mês/Ano
              </label>
              <input
                type="text"
                name="monthYear"
                value={formData.monthYear}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: Out / 2021"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cor
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: Branco"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Origem
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                placeholder="Ex: Nacional"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Imagens do Carro
            </label>
            
            {/* Upload de múltiplos ficheiros */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <label className="cursor-pointer">
                  <span className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all inline-block">
                    Escolher Imagens do PC
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-3">JPG, PNG ou WEBP (máx. 32MB cada)</p>
                <p className="text-xs text-gray-400 mt-1">Pode selecionar várias imagens</p>
                {imageFiles.length > 0 && (
                  <p className="text-sm text-green-600 font-medium mt-2">{imageFiles.length} {imageFiles.length === 1 ? 'imagem selecionada' : 'imagens selecionadas'}</p>
                )}
              </div>
            </div>

            {/* Preview das imagens */}
            {imagePreviews.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Pré-visualização ({imagePreviews.length} {imagePreviews.length === 1 ? 'imagem' : 'imagens'})</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none"
              rows="4"
              placeholder="Descrição detalhada do veículo, características, equipamentos..."
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
            />
            <label className="text-sm font-semibold text-gray-700">
              Carro disponível para venda
            </label>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || uploadProgress}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-lg transition-all hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {uploadProgress ? "A fazer upload das imagens..." : loading ? "A processar..." : isEditMode ? "Atualizar Carro" : "Adicionar Carro"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/cars")}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 font-bold py-4 rounded-lg transition-all hover:shadow-md"
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
