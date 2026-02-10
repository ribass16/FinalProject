import { useEffect, useState } from 'react';
import { subscribeAgendamentos, updateAgendamentoStatus, deleteAgendamento } from '../services/appointmentService';
import { sendConfirmacaoEmail, sendRecusaEmail } from '../services/emailService';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const unsubscribe = subscribeAgendamentos((data) => {
      // Mantém concluídos no snapshot para permitir animar saída local
      setAgendamentos(data);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id, novoStatus, agendamento) => {
    const result = await updateAgendamentoStatus(id, novoStatus);
    if (result.success) {
      // Envia email se for confirmado ou cancelado
      if (novoStatus === 'confirmado') {
        await sendConfirmacaoEmail(agendamento);
      } else if (novoStatus === 'cancelado') {
        await sendRecusaEmail(agendamento);
      }

      // Concluídos somem imediatamente via filtro
    } else {
      alert('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja apagar este agendamento?')) {
      const result = await deleteAgendamento(id);
      if (!result.success) {
        alert('Erro ao eliminar agendamento');
      }
    }
  };

  const agendamentosFiltrados = agendamentos.filter((ag) => {
    // Oculta concluídos do fluxo normal
    if (ag.status === 'concluido') return false;

    if (filtro === 'todos') return true;
    return ag.status === filtro;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-200">
        <div className="flex gap-3">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              filtro === 'todos' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({agendamentos.filter(a => a.status !== 'concluido').length})
          </button>
          <button
            onClick={() => setFiltro('pendente')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtro === 'pendente' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendentes ({agendamentos.filter(a => a.status === 'pendente').length})
          </button>
          <button
            onClick={() => setFiltro('confirmado')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtro === 'confirmado' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Confirmados ({agendamentos.filter(a => a.status === 'confirmado').length})
          </button>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      {agendamentosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <p className="text-xl text-gray-600">Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {agendamentosFiltrados.map((agendamento) => (
            <div
              key={agendamento.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{agendamento.nome}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(agendamento.status)}`}>
                      {agendamento.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Carro</p>
                      <p className="text-gray-900 font-bold text-lg">{agendamento.carroNome || 'Não especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{agendamento.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telemóvel</p>
                      <p className="text-gray-900 font-medium">{agendamento.telefone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data e Hora</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(agendamento.data).toLocaleDateString('pt-PT')} às {agendamento.hora}
                      </p>
                    </div>
                  </div>

                  {agendamento.carroInteresse && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Carro de Interesse</p>
                      <p className="text-gray-900 font-medium">{agendamento.carroInteresse}</p>
                    </div>
                  )}

                  {agendamento.mensagem && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Mensagem</p>
                      <p className="text-gray-700">{agendamento.mensagem}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {agendamento.status === 'pendente' && (
                      <button
                        onClick={() => handleUpdateStatus(agendamento.id, 'confirmado', agendamento)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Confirmar
                      </button>
                    )}
                    {agendamento.status === 'confirmado' && (
                      <button
                        onClick={() => handleUpdateStatus(agendamento.id, 'concluido', agendamento)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Marcar como Concluído
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(agendamento.id, 'cancelado', agendamento)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDelete(agendamento.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agendamentos;
