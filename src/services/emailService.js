import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_CONFIRMADO = import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRMADO;
const TEMPLATE_RECUSADO = import.meta.env.VITE_EMAILJS_TEMPLATE_RECUSADO;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Inicializa EmailJS
emailjs.init(PUBLIC_KEY);

// Envia email de agendamento confirmado
export const sendConfirmacaoEmail = async (agendamentoData) => {
  try {
    console.log('=== DEBUG EMAIL ===');
    console.log('SERVICE_ID:', SERVICE_ID);
    console.log('TEMPLATE_CONFIRMADO:', TEMPLATE_CONFIRMADO);
    console.log('PUBLIC_KEY:', PUBLIC_KEY);
    console.log('Dados:', agendamentoData);
    
    const templateParams = {
      customer_name: agendamentoData.nome,
      email: agendamentoData.email,
      car_name: agendamentoData.carroNome || agendamentoData.carName || 'Não especificado',
      date: agendamentoData.data,
      time: agendamentoData.hora,
    };

    console.log('Template Params:', templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_CONFIRMADO,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Email de confirmacao enviado:', response);
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

    console.log('Email de recusa enviado:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Erro ao enviar email de recusa:', error);
    return { success: false, error: error.message };
  }
};
