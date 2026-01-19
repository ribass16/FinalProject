import { useState, useEffect, useRef } from 'react';
import { createAgendamento } from '../services/appointmentService';
import { useForm } from '../hooks/useForm';
import { validateAgendamento } from '../utils/validators';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebaseClient';
import { collection, onSnapshot } from 'firebase/firestore';

// Calendário customizado
const CustomCalendar = ({ value, onChange, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showOpenNotice, setShowOpenNotice] = useState(false);
  const openNoticeTimer = useRef(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Dias do mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Dias do mes atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Selecione uma data';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleDateClick = (date) => {
    if (!date) return;
    if (isDateDisabled(date)) return;
    if (formatDate(date) >= formatDate(new Date(minDate))) {
      onChange({ target: { name: 'data', value: formatDate(date) } });
      setShowCalendar(false);
      if (openNoticeTimer.current) { clearTimeout(openNoticeTimer.current); openNoticeTimer.current = null; }
      setShowOpenNotice(false);
    }
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    if (formatDate(date) < formatDate(new Date(minDate))) return true;
    const day = date.getDay();
    if (day === 0 || day === 6) return true;
    return false;
  };

  const toggleCalendar = () => {
    const willOpen = !showCalendar;
    setShowCalendar(willOpen);
    if (willOpen) {
      setShowOpenNotice(true);
      if (openNoticeTimer.current) clearTimeout(openNoticeTimer.current);
      openNoticeTimer.current = setTimeout(() => setShowOpenNotice(false), 4000);
    } else {
      if (openNoticeTimer.current) { clearTimeout(openNoticeTimer.current); openNoticeTimer.current = null; }
      setShowOpenNotice(false);
    }
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isSelected = (date) => {
    if (!date || !value) return false;
    return formatDate(date) === value;
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const days = getDaysInMonth(currentMonth);

  useEffect(() => { return () => { if (openNoticeTimer.current) clearTimeout(openNoticeTimer.current); }; }, []);

  return (
    <div className="relative">
      <div
        onClick={toggleCalendar}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent cursor-pointer bg-white hover:border-gray-400 transition-colors flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {formatDisplayDate(value)}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {showCalendar && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80">
          {showOpenNotice && (
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <div className="flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <div>O stand está fechado aos fins de semana — sábados e domingos indisponíveis.</div>
              </div>
            </div>
          )}
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="font-bold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, idx) => (
              <div key={idx} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={isDateDisabled(date)}
                className={`
                  p-2 text-sm rounded-lg transition-all
                  ${!date ? 'invisible' : ''}
                  ${isDateDisabled(date) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}
                  ${isSelected(date) ? 'bg-blue-600 text-white font-bold hover:bg-blue-700' : ''}
                  ${isToday(date) && !isSelected(date) ? 'border-2 border-blue-600 font-semibold' : ''}
                  ${!isDateDisabled(date) && !isSelected(date) && !isToday(date) ? 'text-gray-700' : ''}
                `}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                onChange({ target: { name: 'data', value: '' } });
                setShowCalendar(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => {
                const today = formatDate(new Date());
                onChange({ target: { name: 'data', value: today } });
                setShowCalendar(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AgendarModal = ({ isOpen, onClose, carId, carName }) => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const { user, userProfile } = useAuth();

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    {
      nome: '',
      email: '',
      telefone: '',
      data: '',
      hora: '',
      carroId: carId,
      carroNome: carName,
      mensagem: ''
    },
    validateAgendamento
  );

  // Pre-preenche dados se utilizador estiver logado
  useEffect(() => {
    if (userProfile && isOpen) {
      setValues(prev => ({
        ...prev,
        nome: userProfile.nome || '',
        email: userProfile.email || '',
        telefone: userProfile.telefone || ''
      }));
    }
  }, [userProfile, isOpen, setValues]);

  // Buscar horários ocupados GLOBALMENTE em tempo real (bloqueio entre todos os carros)
  useEffect(() => {
    if (!values.data || !isOpen) {
      setHorariosOcupados([]);
      return;
    }

    

    // Ve tos agendamentos todos e filtra no cliente pela data
    const unsubscribe = onSnapshot(collection(db, 'agendamentos'), (snapshot) => {
      const horariosSet = new Set();
      
      snapshot.docs.forEach(doc => {
        const agendamento = doc.data();
        
        // ve agendamentos e filtra localmente por data e status (pendente/confirmado)
        if (
          agendamento.data === values.data &&
          (agendamento.status === 'pendente' || agendamento.status === 'confirmado')
        ) {
          const hora = (agendamento.hora || '').trim();
          if (hora) {
            horariosSet.add(hora);
            
          }
        }
      });
      
      const todosHorarios = Array.from(horariosSet);
      
      setHorariosOcupados(todosHorarios);
    });

    
    return () => {
      
      unsubscribe();
    };
  }, [values.data, isOpen]);

  const onSubmit = async () => {
    setSubmitting(true);
    
    // Adiciona userId se o utilizador estiver logado
    const agendamentoData = {
      ...values,
      userId: user?.uid || null
    };
    
    const result = await createAgendamento(agendamentoData);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2500);
    } else {
      alert('Erro ao criar agendamento. Tente novamente.');
    }
    setSubmitting(false);
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Agendamento Confirmado!
          </h2>
          <p className="text-gray-600">
            Recebemos o seu pedido. Entraremos em contacto em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 animate-fadeIn">
        {}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Agendar Visita</h2>
            <p className="text-sm text-gray-600 mt-1">Preencha os dados abaixo</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-900">
            <p className="text-sm text-gray-600 mb-1">Carro selecionado</p>
            <p className="text-lg font-bold text-gray-900">{carName}</p>
          </div>

          {}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={values.nome}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="O seu nome"
            />
            {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telemóvel *
              </label>
              <input
                type="tel"
                name="telefone"
                value={values.telefone}
                onChange={handleChange}
                maxLength={9}
                pattern="[0-9]*"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="912345678"
              />
              {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>}
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Pretendida *
              </label>
              <CustomCalendar
                value={values.data}
                onChange={handleChange}
                minDate={new Date().toISOString().split('T')[0]}
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
              Mensagem Adicional (Opcional)
            </label>
            <textarea
              name="mensagem"
              value={values.mensagem}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              placeholder="Alguma informação adicional..."
            />
          </div>

          {}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'A enviar...' : 'Confirmar Agendamento'}
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            * Campos obrigatórios
          </p>
        </form>
      </div>
    </div>
  );
};

export default AgendarModal;
