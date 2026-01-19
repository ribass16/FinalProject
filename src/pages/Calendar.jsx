import { useEffect, useMemo, useState } from 'react';
import { subscribeAgendamentos } from '../services/appointmentService';
import { subscribeAutomoveis } from '../services/firestoreService';



const HOURS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

// Horas que aparecem nas linhas do calendário

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
    agendamentos.forEach(a => {
      if (!a.data) return; // ignora se nao tiver data
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
  }, [agendamentos, days]);

  //  muda a data-âncora para semana anterior/próxima
  const prevWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d); };
  const nextWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d); };

  // Busca objeto do carro por id para mostrar imagem e detalhes no evento
  const findCar = (id) => cars.find(c => c.id === id) || null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={prevWeek} className="px-3 py-2 bg-gray-100 rounded">◀</button>
          <h2 className="text-2xl font-bold">{weekStart.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={nextWeek} className="px-3 py-2 bg-gray-100 rounded">▶</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-3 bg-gray-50"></div>
          {days.map(d => (
            <div key={d.iso} className="p-3 text-center font-semibold border-l border-gray-100">
              <div className="text-xs text-gray-500">{d.date.toLocaleDateString('pt-PT', { weekday: 'short' })}</div>
              <div className="mt-1 text-sm">{d.date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}</div>
            </div>
          ))}
        </div>

        {}
        <div className="grid grid-cols-8">
          {}
          <div className="p-2 border-r border-gray-100">
            <div className="flex flex-col">
              {HOURS.map((h) => (
                <div key={h} className="h-20 flex items-center text-xs text-gray-500 border-b border-gray-100">
                  {h}
                </div>
              ))}
            </div>
          </div>

          {}
          {days.map(d => (
            <div key={d.iso} className="p-2 border-l border-gray-100">
              <div className="flex flex-col">
                {HOURS.map((h) => (
                  <div key={h} className="h-24 border-b border-gray-100 relative">
                    {}
                    <div className="flex flex-col gap-2 p-1 overflow-hidden max-h-full">
                      {eventsByDay[d.iso] && eventsByDay[d.iso].filter(ev => {
                        if (!ev.hora) return false;
                        const evHour = ev.hora.length === 4 ? '0' + ev.hora : ev.hora;
                        return evHour.startsWith(h);
                      }).map(ev => {
                        const car = findCar(ev.carroId) || {};
                        const statusColor = ev.status === 'confirmado' ? 'border-green-500' : ev.status === 'cancelado' ? 'border-red-500' : ev.status === 'concluido' ? 'border-blue-500' : 'border-indigo-500';
                        return (
                          <div key={ev.id} className={`flex gap-3 items-start bg-white rounded-lg shadow-sm p-2 border-l-4 ${statusColor}`}> 
                            <div className="w-16 h-12 flex-shrink-0 overflow-hidden rounded">
                              {car.image ? (
                                <img src={car.image} alt={(car.brand||'') + ' ' + (car.model||'')} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">🚗</div>
                              )}
                            </div>
                            <div className="flex-1 text-xs">
                              <div className="font-bold text-sm leading-5 truncate">{ev.carroNome || (car.brand && car.model ? car.brand + ' ' + car.model : 'Carro')}</div>
                              <div className="text-gray-500 text-xs">{ev.hora} — {ev.nome}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendario;
