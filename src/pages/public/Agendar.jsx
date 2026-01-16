// Agendar page removed — scheduling is handled via the AgendarModal on car details.
// Placeholder file to avoid breaking imports

const Agendar = () => null;

export default Agendar;
                  onChange={handleChange}
                  pattern="[0-9]*"
                  maxLength="9"
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="+351 912 345 678"
                />
                {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>}
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data Pretendida *
                </label>
                <input
                  type="date"
                  name="data"
                  value={values.data}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                {errors.data && <p className="text-red-600 text-sm mt-1">{errors.data}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hora Pretendida *
                </label>
                <select
                  name="hora"
                  value={values.hora}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="09:00" disabled={horariosOcupados.includes("09:00")}>
                    09:00 {horariosOcupados.includes("09:00") && "❌ Ocupado"}
                  </option>
                  <option value="10:00" disabled={horariosOcupados.includes("10:00")}>
                    10:00 {horariosOcupados.includes("10:00") && "❌ Ocupado"}
                  </option>
                  <option value="11:00" disabled={horariosOcupados.includes("11:00")}>
                    11:00 {horariosOcupados.includes("11:00") && "❌ Ocupado"}
                  </option>
                  <option value="12:00" disabled={horariosOcupados.includes("12:00")}>
                    12:00 {horariosOcupados.includes("12:00") && "❌ Ocupado"}
                  </option>
                  <option value="14:00" disabled={horariosOcupados.includes("14:00")}>
                    14:00 {horariosOcupados.includes("14:00") && "❌ Ocupado"}
                  </option>
                  <option value="15:00" disabled={horariosOcupados.includes("15:00")}>
                    15:00 {horariosOcupados.includes("15:00") && "❌ Ocupado"}
                  </option>
                  <option value="16:00" disabled={horariosOcupados.includes("16:00")}>
                    16:00 {horariosOcupados.includes("16:00") && "❌ Ocupado"}
                  </option>
                  <option value="17:00" disabled={horariosOcupados.includes("17:00")}>
                    17:00 {horariosOcupados.includes("17:00") && "❌ Ocupado"}
                  </option>
                  <option value="18:00" disabled={horariosOcupados.includes("18:00")}>
                    18:00 {horariosOcupados.includes("18:00") && "❌ Ocupado"}
                  </option>
                </select>
                {errors.hora && <p className="text-red-600 text-sm mt-1">{errors.hora}</p>}
                {horariosOcupados.length > 0 && values.data && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>
                        <strong>{horariosOcupados.length}</strong> horário(s) já reservado(s) nesta data
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Carro de Interesse
              </label>
              <input
                type="text"
                name="carroNome"
                value={values.carroNome}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-semibold text-gray-900"
                placeholder="Selecione um carro primeiro"
                readOnly
              />
            </div>

            {}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensagem Adicional (Opcional)
              </label>
              <textarea
                name="mensagem"
                value={values.mensagem}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                placeholder="Alguma informação adicional que gostaria de partilhar..."
              />
            </div>

            {}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gray-900 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'A enviar...' : 'Confirmar Agendamento'}
            </button>

            <p className="text-sm text-gray-500 text-center">
              * Campos obrigatórios
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Agendar;
