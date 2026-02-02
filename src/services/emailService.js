import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_CONFIRMADO = import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRMADO;
const TEMPLATE_RECUSADO = import.meta.env.VITE_EMAILJS_TEMPLATE_RECUSADO;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const TEMPLATE_CHATBOT_LEAD = import.meta.env.VITE_EMAILJS_TEMPLATE_CHATBOT_LEAD;

// Inicializa EmailJS
emailjs.init(PUBLIC_KEY);

// Envia email de agendamento confirmado
export const sendConfirmacaoEmail = async (agendamentoData) => {
  try {
    
    
    const templateParams = {
      customer_name: agendamentoData.nome,
      email: agendamentoData.email,
      car_name: agendamentoData.carroNome || agendamentoData.carName || 'Não especificado',
      date: agendamentoData.data,
      time: agendamentoData.hora,
    };

    // template params prepared

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_CONFIRMADO,
      templateParams,
      PUBLIC_KEY
    );

    // confirma se o email foi enviado
    return { success: true, response };
  } catch (error) {
    console.error('Erro ao enviar email de confirmacao:', error);
    return { success: false, error: error.message };
  }
};

// Envia email de agendamento recusado
export const sendRecusaEmail = async (agendamentoData) => {
  try {
    const templateParams = {
      customer_name: agendamentoData.nome,
      email: agendamentoData.email,
      car_name: agendamentoData.carroNome || agendamentoData.carName || 'Não especificado',
      date: agendamentoData.data,
      time: agendamentoData.hora,
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_RECUSADO,
      templateParams,
      PUBLIC_KEY
    );

    // refusal email sent
    return { success: true, response };
  } catch (error) {
    console.error('Erro ao enviar email de recusa:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envia email com dados do lead capturado pelo chatbot
 */
export const sendChatbotLeadEmail = async (lead) => {
  try {
    const isPlaceholder = TEMPLATE_CHATBOT_LEAD === 'template_chatbot_lead';
    const templateToUse = (!TEMPLATE_CHATBOT_LEAD || isPlaceholder)
      ? TEMPLATE_CONFIRMADO
      : TEMPLATE_CHATBOT_LEAD;

    if (!SERVICE_ID || !PUBLIC_KEY || !templateToUse) {
      console.error('EmailJS não configurado para o lead do chatbot. Verifique as variáveis de ambiente.');
      return { success: false, error: 'EmailJS não configurado para lead do chatbot' };
    }
    const templateParams = {
      // Campos compatíveis com templates já existentes
      customer_name: lead.name,
      email: lead.email,
      car_name: lead.carType || 'Não especificado',
      date: lead.visitDate,
      time: lead.visitTime,
      // Campos específicos do chatbot
      lead_name: lead.name,
      lead_email: lead.email,
      lead_phone: lead.phone || 'Não informado',
      car_type: lead.carType || 'Não especificado',
      budget: lead.budget || 'Não especificado',
      financing: lead.financing || 'Não informado',
      financing_term: lead.financingTerm || 'N/A',
      visit_date: lead.visitDate,
      visit_time: lead.visitTime,
      message: `Nova qualificação de lead do chatbot.\n\nDados do cliente:\n- Nome: ${lead.name}\n- Email: ${lead.email}\n- Tipo de viatura: ${lead.carType}\n- Orçamento: ${lead.budget}\n- Financiamento: ${lead.financing}\n- Prazo: ${lead.financingTerm || 'N/A'}\n- Data da visita: ${lead.visitDate}\n- Hora: ${lead.visitTime}`
    };

    const response = await emailjs.send(
      SERVICE_ID,
      templateToUse,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Lead enviado com sucesso:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Erro ao enviar lead do chatbot:', error);
    return { success: false, error: error.message };
  }
};
