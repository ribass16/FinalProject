const Filters = ({ filters, setFilters, cars }) => {
  const categories = [...new Set(cars.map(car => car.category).filter(Boolean))];
  const brands = [...new Set(cars.map(car => car.brand).filter(Boolean))];
  const modelsByBrand = (brand) => [...new Set(cars.filter(c => !brand || brand === 'all' ? true : c.brand === brand).map(car => car.model).filter(Boolean))];

  const maxPrice = 200000;
  const currentYear = new Date().getFullYear();

  const handleChange = (patch) => {
    setFilters({ ...filters, ...patch });
  };

  const handlePriceChange = (minOrMax, value) => {
    const num = value === '' ? (minOrMax === 'min' ? 0 : Infinity) : Number(value);
    setFilters({ ...filters, priceRange: { ...filters.priceRange, [minOrMax]: num } });
  };

  const handleYearChange = (minOrMax, value) => {
    const num = value === '' ? (minOrMax === 'min' ? 0 : Infinity) : Number(value);
    setFilters({ ...filters, yearRange: { ...filters.yearRange, [minOrMax]: num } });
  };

  const handleMileageChange = (minOrMax, value) => {
    const num = value === '' ? (minOrMax === 'min' ? 0 : Infinity) : Number(value);
    setFilters({ ...filters, mileageRange: { ...filters.mileageRange, [minOrMax]: num } });
  };

  const toggleArrayValue = (key, value) => {
    const arr = filters[key] || [];
    if (arr.includes(value)) {
      setFilters({ ...filters, [key]: arr.filter(v => v !== value) });
    } else {
      setFilters({ ...filters, [key]: [...arr, value] });
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      availability: "all",
      brand: "all",
      model: "all",
      priceRange: { min: 0, max: Infinity },
      yearRange: { min: 0, max: Infinity },
      mileageRange: { min: 0, max: Infinity },
      fuelTypes: [],
      transmissions: []
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Filtros</h3>
        <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">Limpar Filtros</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Marca</label>
          <select value={filters.brand || 'all'} onChange={(e) => handleChange({ brand: e.target.value, model: 'all' })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium">
            <option value="all">Todas as Marcas</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Modelo</label>
          <select value={filters.model || 'all'} onChange={(e) => handleChange({ model: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium">
            <option value="all">Todos os Modelos</option>
            {modelsByBrand(filters.brand).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Intervalo de Preço</label>
          <div className="flex gap-2 items-center">
            <input type="number" min="0" max={maxPrice} value={filters.priceRange?.min} onChange={(e) => handlePriceChange('min', e.target.value)} placeholder="Min" className="w-1/2 px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" />
            <span className="text-gray-400">-</span>
            <input type="number" min="0" max={maxPrice} value={filters.priceRange?.max === Infinity ? '' : filters.priceRange?.max} onChange={(e) => handlePriceChange('max', e.target.value)} placeholder="Max" className="w-1/2 px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">€{filters.priceRange?.min?.toLocaleString()} - {filters.priceRange?.max === Infinity ? "Sem limite" : `€${filters.priceRange?.max?.toLocaleString()}`}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Ano (mín – máx)</label>
          <div className="flex gap-2">
            <input type="number" min="1900" max={currentYear} value={filters.yearRange?.min} onChange={(e) => handleYearChange('min', e.target.value)} placeholder="Min" className="w-1/2 px-3 py-3 border-2 border-gray-300 rounded-xl" />
            <span className="text-gray-400">-</span>
            <input type="number" min="1900" max={currentYear} value={filters.yearRange?.max === Infinity ? '' : filters.yearRange?.max} onChange={(e) => handleYearChange('max', e.target.value)} placeholder="Max" className="w-1/2 px-3 py-3 border-2 border-gray-300 rounded-xl" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Quilometragem (mín – máx)</label>
          <div className="flex gap-2">
            <input type="number" min="0" value={filters.mileageRange?.min} onChange={(e) => handleMileageChange('min', e.target.value)} placeholder="Min" className="w-1/2 px-3 py-3 border-2 border-gray-300 rounded-xl" />
            <span className="text-gray-400">-</span>
            <input type="number" min="0" value={filters.mileageRange?.max === Infinity ? '' : filters.mileageRange?.max} onChange={(e) => handleMileageChange('max', e.target.value)} placeholder="Max" className="w-1/2 px-3 py-3 border-2 border-gray-300 rounded-xl" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Combustível</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Gasolina','Diesel','Híbrido','Elétrico'].map(f => (
              <button key={f} type="button" onClick={() => toggleArrayValue('fuelTypes', f)} className={`px-3 py-2 rounded-xl border ${filters.fuelTypes?.includes(f) ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Tipo de Caixa</label>
          <div className="flex gap-2 justify-center">
            {['Manual','Automática'].map(t => (
              <button key={t} type="button" onClick={() => toggleArrayValue('transmissions', t)} className={`px-4 py-2 rounded-xl border ${filters.transmissions?.includes(t) ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
