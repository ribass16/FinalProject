import { useState, useEffect } from 'react';
import { createAgendamento } from '../services/agendamentoService';
import { useForm } from '../hooks/useForm';
import { validateAgendamento } from '../utils/validators';
import { useAuth } from '../contexts/AuthContext';

const AgendarModal = ({ isOpen, onClose, carId, carName }) => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { userProfile } = useAuth();

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

  // Pre-preenche dados se usuario estiver logado
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

  const onSubmit = async () => {
    setSubmitting(true);
    const result = await createAgendamento(values);
    
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
                Telefone *
              </label>
              <input
                type="tel"
                name="telefone"
                value={values.telefone}
                onChange={handleChange}
                maxLength={9}
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
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
              </select>
              {errors.hora && <p className="text-red-600 text-sm mt-1">{errors.hora}</p>}
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
