import { useEffect, useMemo, useState } from 'react';
import { subscribeAgendamentos } from '../services/appointmentService';
import { subscribeAutomoveis } from '../services/firestoreService';
import { getPrimaryCarImage, handleCarImageError } from '../utils/imageUtils';

const HOURS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

// Configuração de cores para estados (melhor contraste e acessibilidade)
const STATUS_STYLES = {
  pendente: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    text: 'text-amber-800',
    badge: 'bg-amber-400',
    icon: '⏳'
  },
  confirmado: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    text: 'text-emerald-800',
    badge: 'bg-emerald-500',
    icon: '✓'
  },
  cancelado: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-800',
    badge: 'bg-red-500',
    icon: '✕'
  },
  concluido: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-800',
    badge: 'bg-blue-500',
    icon: '✓'
  }
};

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(d.setDate(diff));
};




const formatDay = (d) => d.toISOString().split('T')[0];




const Calendario = () => {
  
  const [agendamentos, setAgendamentos] = useState([]);
  const [cars, setCars] = useState([]);
  const [anchor, setAnchor] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [hoveredEvent, setHoveredEvent] = useState(null);

  
  useEffect(() => {
    const unsubA = subscribeAgendamentos((items) => setAgendamentos(items));
    const unsubC = subscribeAutomoveis((items) => setCars(items));
    return () => { unsubA(); unsubC(); };
  }, []);

  // Calcula o primeiro dia da semana e gera os 7 dias a mostrar
  const weekStart = useMemo(() => startOfWeek(anchor), [anchor]);
  const days = useMemo(() => {
    return [...Array(7)].map((_,i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return { date: d, iso: formatDay(d), label: d.toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: 'short' }) };
    });
  }, [weekStart]);

  // Agrupa agendamentos por dia e ordena por hora dentro de cada dia
  const eventsByDay = useMemo(() => {
    const map = {};
    days.forEach(d => map[d.iso] = []);
    
    // Aplica filtro de status
    const filtered = filterStatus === 'all' 
      ? agendamentos 
      : agendamentos.filter(a => a.status === filterStatus);
    
    filtered.forEach(a => {
      if (!a.data) return;
      const day = a.data;
      if (!map[day]) return;
      map[day].push(a);
    });
   
    for (const k in map) {
      map[k].sort((x,y) => {
        const toM = (t) => { if(!t) return 0; const [h,m]=t.split(':').map(Number); return h*60 + (m||0); };
        return toM(x.hora) - toM(y.hora);
      });
    }
    return map;
  }, [agendamentos, days, filterStatus]);

  //  muda a data-âncora para semana anterior/próxima
  const prevWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d); };
  const nextWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d); };

  // Busca objeto do carro por id para mostrar imagem e detalhes no evento
  const findCar = (id) => cars.find(c => c.id === id) || null;

  // Estatísticas rápidas
  const stats = useMemo(() => {
    const total = agendamentos.length;
    const pendente = agendamentos.filter(a => a.status === 'pendente').length;
    const confirmado = agendamentos.filter(a => a.status === 'confirmado').length;
    const concluido = agendamentos.filter(a => a.status === 'concluido').length;
    const cancelado = agendamentos.filter(a => a.status === 'cancelado').length;
    return { total, pendente, confirmado, concluido, cancelado };
  }, [agendamentos]);

  return (
    <div className="space-y-6">
      {/* Header com navegação e estatísticas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={prevWeek} 
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            ◀
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {weekStart.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
          </h2>
          <button 
            onClick={nextWeek} 
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            ▶
          </button>
        </div>

        {/* Filtros rápidos */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filterStatus === 'all' 
                ? 'bg-gray-900 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('pendente')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filterStatus === 'pendente' 
                ? 'bg-amber-500 text-white' 
                : 'bg-white border border-amber-300 text-amber-700 hover:bg-amber-50'
            }`}
          >
            Pendentes ({stats.pendente})
          </button>
          <button
            onClick={() => setFilterStatus('confirmado')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filterStatus === 'confirmado' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Confirmados ({stats.confirmado})
          </button>
          <button
            onClick={() => setFilterStatus('concluido')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filterStatus === 'concluido' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50'
            }`}
          >
            Concluídos ({stats.concluido})
          </button>
        </div>
      </div>

      {/* Calendário */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Cabeçalho dos dias */}
        <div className="grid grid-cols-8 border-b-2 border-gray-300 bg-gray-50">
          <div className="p-3"></div>
          {days.map(d => {
            const isToday = d.iso === formatDay(new Date());
            return (
              <div 
                key={d.iso} 
                className={`p-3 text-center font-bold border-l border-gray-200 ${
                  isToday ? 'bg-blue-100' : ''
                }`}
              >
                <div className="text-xs uppercase tracking-wide text-gray-600">
                  {d.date.toLocaleDateString('pt-PT', { weekday: 'short' })}
                </div>
                <div className={`mt-1 text-lg font-black ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {d.date.toLocaleDateString('pt-PT', { day: '2-digit' })}
                </div>
                <div className="text-xs text-gray-500">
                  {d.date.toLocaleDateString('pt-PT', { month: 'short' })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid de horários */}
        <div className="grid grid-cols-8 relative">
          {/* Coluna de horas */}
          <div className="border-r-2 border-gray-200 bg-gray-50">
            <div className="flex flex-col">
              {HOURS.map((h) => (
                <div 
                  key={h} 
                  className="min-h-24 flex items-start justify-end pr-3 pt-2 text-sm font-semibold text-gray-600 border-b border-gray-200"
                >
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Colunas de dias */}
          {days.map(d => {
            const isToday = d.iso === formatDay(new Date());
            return (
              <div 
                key={d.iso} 
                className={`border-l border-gray-200 ${isToday ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex flex-col">
                  {HOURS.map((h) => {
                    const eventsInSlot = eventsByDay[d.iso]?.filter(ev => {
                      if (!ev.hora) return false;
                      const evHour = ev.hora.length === 4 ? '0' + ev.hora : ev.hora;
                      return evHour.startsWith(h);
                    }) || [];
                    
                    const hasMultiple = eventsInSlot.length > 1;

                    return (
                      <div 
                        key={h} 
                        className="min-h-24 border-b border-gray-200 p-1 relative group"
                      >
                        {eventsInSlot.length === 0 ? (
                          <div className="h-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-xs text-gray-400 text-center pt-8">+</div>
                          </div>
                        ) : hasMultiple ? (
                          // Múltiplos eventos - modo compacto com expansão
                          <div className="relative">
                            <div className="flex flex-col gap-1">
                              {eventsInSlot.slice(0, 1).map(ev => {
                                const car = findCar(ev.carroId) || {};
                                const style = STATUS_STYLES[ev.status] || STATUS_STYLES.pendente;
                                return (
                                  <div
                                    key={ev.id}
                                    onClick={() => setSelectedEvent(ev)}
                                    onMouseEnter={() => setHoveredEvent(ev.id)}
                                    onMouseLeave={() => setHoveredEvent(null)}
                                    className={`${style.bg} ${style.border} border-l-4 rounded-lg p-2 cursor-pointer hover:shadow-lg transition-all relative`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">{style.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className={`text-xs font-bold ${style.text} truncate`}>
                                          {ev.carroNome || `${car.brand} ${car.model}`}
                                        </div>
                                        <div className="text-xs text-gray-600 truncate">
                                          {ev.hora} • {ev.nome}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <button
                              onClick={() => setSelectedEvent(eventsInSlot[0])}
                              className="mt-1 w-full bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded hover:bg-gray-800 transition-colors"
                            >
                              +{eventsInSlot.length - 1} mais
                            </button>
                          </div>
                        ) : (
                          // Evento único - modo normal
                          eventsInSlot.map(ev => {
                            const car = findCar(ev.carroId) || {};
                            const style = STATUS_STYLES[ev.status] || STATUS_STYLES.pendente;
                            const isHovered = hoveredEvent === ev.id;
                            
                            return (
                              <div key={ev.id} className="relative">
                                <div
                                  onClick={() => setSelectedEvent(ev)}
                                  onMouseEnter={() => setHoveredEvent(ev.id)}
                                  onMouseLeave={() => setHoveredEvent(null)}
                                  className={`${style.bg} ${style.border} border-l-4 rounded-lg p-2 cursor-pointer hover:shadow-lg transition-all`}
                                >
                                  <div className="flex gap-2 items-start">
                                    <div className="w-12 h-10 flex-shrink-0 overflow-hidden rounded">
                                      <img 
                                        src={getPrimaryCarImage(car)} 
                                        alt={`${car.brand} ${car.model}`}
                                        onError={handleCarImageError}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm">{style.icon}</span>
                                        <span className={`text-xs font-bold ${style.text} truncate`}>
                                          {ev.carroNome || `${car.brand} ${car.model}`}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-700 font-semibold">{ev.hora}</div>
                                      <div className="text-xs text-gray-600 truncate">{ev.nome}</div>
                                      {ev.telefone && (
                                        <div className="text-xs text-gray-500 mt-1">{ev.telefone}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Tooltip expandido ao hover */}
                                {isHovered && (
                                  <div className="absolute z-50 left-0 top-full mt-1 bg-gray-900 text-white p-3 rounded-lg shadow-2xl min-w-64 max-w-sm">
                                    <div className="text-sm font-bold mb-2">
                                      {ev.carroNome || `${car.brand} ${car.model}`}
                                    </div>
                                    <div className="space-y-1 text-xs">
                                      <div><strong>Cliente:</strong> {ev.nome}</div>
                                      <div><strong>Hora:</strong> {ev.hora}</div>
                                      <div><strong>Telefone:</strong> {ev.telefone || 'N/A'}</div>
                                      <div><strong>Email:</strong> {ev.email || 'N/A'}</div>
                                      <div><strong>Status:</strong> <span className={`${style.badge} px-2 py-0.5 rounded text-white`}>{ev.status}</span></div>
                                      {ev.observacoes && (
                                        <div className="mt-2 pt-2 border-t border-gray-700">
                                          <strong>Observações:</strong> {ev.observacoes}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de detalhes rápidos */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">Detalhes do Agendamento</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Informações do carro */}
              {(() => {
                const car = findCar(selectedEvent.carroId) || {};
                const style = STATUS_STYLES[selectedEvent.status] || STATUS_STYLES.pendente;
                
                return (
                  <>
                    <div className="w-full h-48 rounded-xl overflow-hidden">
                      <img 
                        src={getPrimaryCarImage(car)} 
                        alt={`${car.brand} ${car.model}`}
                        onError={handleCarImageError}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className={`${style.bg} ${style.border} border-l-4 rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{style.icon}</span>
                        <span className={`text-lg font-bold ${style.text}`}>
                          {selectedEvent.carroNome || `${car.brand} ${car.model}`}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className={`ml-2 ${style.badge} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                            {selectedEvent.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Data:</span>
                          <span className="ml-2 font-semibold">{selectedEvent.data}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Hora:</span>
                          <span className="ml-2 font-semibold">{selectedEvent.hora}</span>
                        </div>
                      </div>
                    </div>

                    {/* Informações do cliente */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-3">Informações do Cliente</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-semibold">{selectedEvent.nome}</span>
                        </div>
                        {selectedEvent.email && (
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a href={`mailto:${selectedEvent.email}`} className="text-blue-600 hover:underline">
                              {selectedEvent.email}
                            </a>
                          </div>
                        )}
                        {selectedEvent.telefone && (
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:${selectedEvent.telefone}`} className="text-blue-600 hover:underline">
                              {selectedEvent.telefone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Observações */}
                    {selectedEvent.observacoes && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900 mb-2">Observações</h4>
                        <p className="text-sm text-gray-700">{selectedEvent.observacoes}</p>
                      </div>
                    )}

                    {/* Ações rápidas */}
                    <div className="flex gap-3 pt-4 border-t">
                      <a
                        href={`https://wa.me/${selectedEvent.telefone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href={`mailto:${selectedEvent.email}`}
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </a>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
