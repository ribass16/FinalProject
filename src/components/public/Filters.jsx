// src/components/public/Filters.jsx
const Filters = ({ filters, setFilters, cars }) => {
  const categories = [...new Set(cars.map(car => car.category).filter(Boolean))];
  
  const priceRanges = [
    { label: "Todos os preços", min: 0, max: Infinity },
    { label: "Até €10.000", min: 0, max: 10000 },
    { label: "€10.000 - €20.000", min: 10000, max: 20000 },
    { label: "€20.000 - €30.000", min: 20000, max: 30000 },
    { label: "€30.000 - €50.000", min: 30000, max: 50000 },
    { label: "Mais de €50.000", min: 50000, max: Infinity },
  ];

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
  };

  const handleAvailabilityChange = (availability) => {
    setFilters({ ...filters, availability });
  };

  const handlePriceRangeChange = (range) => {
    setFilters({ ...filters, priceRange: range });
  };

  const clearFilters = () => {
    setFilters({ category: "all", availability: "all", priceRange: { min: 0, max: Infinity } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>🔍</span>
          <span>Filtros</span>
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
        >
          <span>🔄</span>
          <span>Limpar Filtros</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Categoria</label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Disponibilidade</label>
          <select
            value={filters.availability}
            onChange={(e) => handleAvailabilityChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          >
            <option value="all">Todos</option>
            <option value="available">Apenas Disponíveis</option>
            <option value="unavailable">Indisponíveis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Intervalo de Preço</label>
          <select
            value={JSON.stringify(filters.priceRange)}
            onChange={(e) => handlePriceRangeChange(JSON.parse(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          >
            {priceRanges.map((range, index) => (
              <option key={index} value={JSON.stringify({ min: range.min, max: range.max })}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
