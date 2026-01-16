import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUserProfile } from "../../services/userService";
import { getUserAgendamentos, updateAgendamentoStatus } from "../../services/agendamentoService";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../../components/ReviewModal";
import { hasUserReviewed } from "../../services/reviewService";

const Profile = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [reviewedAgendamentos, setReviewedAgendamentos] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        nome: userProfile.nome || "",
        telefone: userProfile.telefone || "",
      });
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      if (user) {
        setLoadingAgendamentos(true);
        const result = await getUserAgendamentos(user.uid);
        if (result.success) {
          // Filtrar apenas agendamentos nao concluídos
          const activeAgendamentos = result.data.filter(a => a.status !== 'concluido');
          setAgendamentos(activeAgendamentos);
          
          // Verificar quais agendamentos já têm review
          const reviewChecks = await Promise.all(
            result.data.map(async (agendamento) => {
              const reviewResult = await hasUserReviewed(user.uid, agendamento.id);
              return reviewResult.hasReviewed ? agendamento.id : null;
            })
          );
          setReviewedAgendamentos(reviewChecks.filter(id => id !== null));
        }
        setLoadingAgendamentos(false);
      }
    };

    fetchAgendamentos();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMarkAsCompleted = async (agendamentoId) => {
    if (window.confirm('Tem certeza que deseja marcar este agendamento como concluído?')) {
      const result = await updateAgendamentoStatus(agendamentoId, 'concluido');
      if (result.success) {
        // Buscar dados do agendamento antes de remover
        const agendamento = agendamentos.find(a => a.id === agendamentoId);
        
        // Remover agendamento da lista
        setAgendamentos(agendamentos.filter(a => a.id !== agendamentoId));
        
        // Abrir modal de review
        setSelectedAgendamento(agendamento);
        setShowReviewModal(true);
      } else {
        setMessage({ type: 'error', text: 'Erro ao atualizar agendamento.' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await updateUserProfile(user.uid, formData);
      if (result.success) {
        await refreshProfile();
        setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: "Erro ao atualizar perfil." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao atualizar perfil." });
    }

    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800 border-green-300";
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-300";
      case "concluido":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "pendente":
        return "Pendente";
      case "cancelado":
        return "Cancelado";
      case "concluido":
        return "Concluído";
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-6">
            Por favor, faça login para ver seu perfil.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Voltar
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Meu Perfil</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Informações Pessoais
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Editar
                  </button>
                )}
              </div>

              {message.text && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telemóvel
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      maxLength={9}
                      pattern="[0-9]*"
                      onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      O email não pode ser alterado
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                    >
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          nome: userProfile?.nome || "",
                          telefone: userProfile?.telefone || "",
                        });
                        setMessage({ type: "", text: "" });
                      }}
                      className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-500 mb-1">Nome</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {userProfile?.nome || "Não informado"}
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-lg text-gray-900">{user.email}</p>
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-gray-500 mb-1">Telefone</p>
                    <p className="text-lg text-gray-900">
                      {userProfile?.telefone || "Não informado"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-lg p-8 text-white h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6">Estatísticas</h3>
              <div className="space-y-4 flex-1">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Agendamentos Ativos</p>
                  <p className="text-3xl font-bold mt-1">{agendamentos.length}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Pendentes</p>
                  <p className="text-3xl font-bold mt-1">
                    {agendamentos.filter((a) => a.status === "pendente").length}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-80">Confirmados</p>
                  <p className="text-3xl font-bold mt-1">
                    {agendamentos.filter((a) => a.status === "confirmado").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agendamentos */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Meus Agendamentos
            </h2>

            {loadingAgendamentos ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="text-gray-600 mt-4">Carregando agendamentos...</p>
              </div>
            ) : agendamentos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  Você ainda não tem agendamentos.
                </p>
                <button
                  onClick={() => navigate("/cars")}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Ver Carros Disponíveis
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {agendamentos.map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {agendamento.carroNome || agendamento.carName || "Carro"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {agendamento.data} às {agendamento.hora}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                          agendamento.status
                        )}`}
                      >
                        {getStatusText(agendamento.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="font-semibold text-gray-900">
                          {agendamento.data || "Não definida"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="font-semibold text-gray-900">
                          {agendamento.hora || "Não definido"}
                        </p>
                      </div>
                      {agendamento.tipoAgendamento && (
                        <div>
                          <p className="text-sm text-gray-500">Tipo</p>
                          <p className="font-semibold text-gray-900 capitalize">
                            {agendamento.tipoAgendamento}
                          </p>
                        </div>
                      )}
                      {agendamento.createdAt && (
                        <div>
                          <p className="text-sm text-gray-500">Criado em</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(agendamento.createdAt).toLocaleDateString(
                              "pt-PT"
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {agendamento.observacoes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">Observações</p>
                        <p className="text-gray-900 mt-1">
                          {agendamento.observacoes}
                        </p>
                      </div>
                    )}

                    {/* botao para marcar como concluído */}
                    {agendamento.status === 'confirmado' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleMarkAsCompleted(agendamento.id)}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Marcar como Concluído</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedAgendamento && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedAgendamento(null);
          }}
          agendamento={selectedAgendamento}
        />
      )}
    </div>
  );
};

export default Profile;
