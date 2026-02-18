import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatbotStateMachine, { STATES } from '../services/chatbotStateMachine';
import { sendChatbotLeadEmail } from '../services/emailService';
import { createAgendamento } from '../services/appointmentService';
import { subscribeAutomoveis } from '../services/firestoreService';
import { useAuth } from '../contexts/authContextObject';

/**
 * Componente ChatBot - Widget flutuante
 * Gerencia a interação com o utilizador e exibe as mensagens
 */
const ChatBot = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  // Estado do widget
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cars, setCars] = useState([]);

  // Referência da máquina de estados
  const stateMachineRef = useRef(null);
  const messagesEndRef = useRef(null);
  const appointmentCreatedRef = useRef(false);

  /**
   * Inicializar a conversa
   */
  function initializeChat() {
    const stateMachine = stateMachineRef.current;
    const response = stateMachine.processInput('', null);

    const botMessage = {
      type: 'bot',
      text: response.message,
      options: response.options,
      timestamp: new Date()
    };

    setMessages([botMessage]);
  }

  /**
   * Subscrever aos carros reais da base de dados
   */
  useEffect(() => {
    const unsubscribe = subscribeAutomoveis((automoveis) => {
      // debug logs removed
      setCars(automoveis);
      // Atualizar a máquina de estados com os carros reais
      if (stateMachineRef.current) {
        stateMachineRef.current.updateCars(automoveis);
      }
    });

    return () => unsubscribe?.();
  }, []);

  /**
   * Inicializar a máquina de estados quando os carros estiverem carregados
   */
  useEffect(() => {
    if (cars.length > 0 && !stateMachineRef.current) {
      stateMachineRef.current = new ChatbotStateMachine(cars);
    }
  }, [cars]);

  /**
   * Inicializar ou fechar o chatbot
   */
  useEffect(() => {
    if (isOpen && messages.length === 0 && stateMachineRef.current) {
      // Reset do estado quando abre (para começar nova conversa)
      stateMachineRef.current.reset();
      appointmentCreatedRef.current = false;
      
      // Re-passar dados do utilizador após reset
      if (userProfile) {
        stateMachineRef.current.setLoggedInUser(userProfile);
      }
      
      initializeChat();
    }
  }, [isOpen, userProfile, messages.length]);

  /**
   * Auto-scroll para a última mensagem
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* duplicate initializeChat removed */

  /**
   * Processar resposta do utilizador
   */
  const handleUserResponse = async (inputKey = null) => {
    const stateMachine = stateMachineRef.current;
    const userInput = inputValue.trim();

    // Validar se há input necessário
    if (inputKey === null && userInput === '') {
      return;
    }

    // Adicionar mensagem do utilizador
    const userMessage = {
      type: 'user',
      text: inputKey ? null : userInput, // Se for opção, não mostrar texto
      optionLabel: inputKey ? messages[messages.length - 1].options.find(o => o.key === inputKey)?.label : null,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Pequeno delay para simular processamento
    setTimeout(() => {
      const response = stateMachine.processInput(userInput, inputKey);

      // Se houver redirecionamento (seleção de carro)
      if (response.redirectTo) {
        // debug log removed
        setIsOpen(false);
        setMessages([]);
        stateMachineRef.current.reset();
        navigate(response.redirectTo);
        setIsLoading(false);
        return;
      }

      // Adicionar mensagem do bot
      const botMessage = {
        type: 'bot',
        text: response.message,
        options: response.options,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);

      // Se chegou ao sucesso e tem dados de visita, enviar email e registar agendamento
      if (response.nextState === STATES.SUCCESS && stateMachine.lead.email) {
        handleSendLead(stateMachine.lead);
      }
    }, 300);
  };

  /**
   * Enviar dados do lead por email
   */
  const handleCreateAgendamento = async (lead) => {
    if (appointmentCreatedRef.current) return;

    const payload = {
      nome: lead.name,
      email: lead.email,
      telefone: userProfile?.telefone || lead.phone || 'Não informado',
      data: lead.visitDate,
      hora: lead.visitTime,
      carroNome: lead.carName || lead.carType || 'Não especificado',
      carroInteresse: lead.carType || 'Não especificado',
      mensagem: 'Agendamento criado pelo chatbot',
      origem: 'chatbot',
      userId: user?.uid || null
    };

    const result = await createAgendamento(payload);
    if (result.success) {
      appointmentCreatedRef.current = true;
    } else {
      console.error('Erro ao criar agendamento do chatbot:', result.error);
    }
  };

  const handleSendLead = async (lead) => {
    try {
      await handleCreateAgendamento(lead);
      await sendChatbotLeadEmail(lead);
      // Lead sent successfully
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
    }
  };

  /**
   * Fechar o chatbot
   */
  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
    stateMachineRef.current.reset();
    appointmentCreatedRef.current = false;
  };

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-40"
          title="Abrir chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Janela do chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Amaralcar Bot</h3>
                <p className="text-xs text-blue-100">Sempre disponível</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 chat-scrollbar">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-center">Carregando...</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-gray-900 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.optionLabel || msg.text}</p>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Opções ou Input */}
          <div className="border-t bg-white p-4 space-y-2">
            {messages.length > 0 && messages[messages.length - 1].options?.length > 0 ? (
              // Mostrar opções
              <div className="space-y-2">
                {messages[messages.length - 1].options.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleUserResponse(option.key)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-lg border border-gray-200 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              // Mostrar input de texto
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUserResponse()}
                  placeholder="Escrever mensagem..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 disabled:bg-gray-100"
                />
                <button
                  onClick={() => handleUserResponse()}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
