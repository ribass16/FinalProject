//filtros
const Filters = ({ filters, setFilters, cars }) => {
  const categories = [...new Set(cars.map(car => car.category).filter(Boolean))];
  
  const maxPrice = 200000; 
  
  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
  };

  const handleAvailabilityChange = (availability) => {
    setFilters({ ...filters, availability });
  };

  const handleMinPriceChange = (value) => {
    const minPrice = value === "" ? 0 : Number(value);
    setFilters({ 
      ...filters, 
      priceRange: { 
        min: minPrice, 
        max: filters.priceRange.max 
      } 
    });
  };

  const handleMaxPriceChange = (value) => {
    const maxPrice = value === "" ? Infinity : Number(value);
    setFilters({ 
      ...filters, 
      priceRange: { 
        min: filters.priceRange.min, 
        max: maxPrice 
      } 
    });
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
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max={maxPrice}
              value={filters.priceRange.min}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              placeholder="Min"
              className="w-1/2 px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min="0"
              max={maxPrice}
              value={filters.priceRange.max === Infinity ? "" : filters.priceRange.max}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              placeholder="Max"
              className="w-1/2 px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            €{filters.priceRange.min.toLocaleString()} - {filters.priceRange.max === Infinity ? "Sem limite" : `€${filters.priceRange.max.toLocaleString()}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
