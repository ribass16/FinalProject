
// Estados do chatbot
export const STATES = {
  START: 'start',
  MAIN_MENU: 'mainMenu',
  CAR_TYPE: 'carType',
  BUDGET: 'budget',
  BROWSE_CARS: 'browseCars',
  FINANCING: 'financing',
  FINANCING_TERM: 'financingTerm',
  SCHEDULE_VISIT: 'scheduleVisit',
  COLLECT_NAME: 'collectName',
  COLLECT_EMAIL: 'collectEmail',
  COLLECT_DATE: 'collectDate',
  COLLECT_TIME: 'collectTime',
  CONFIRM_DATA: 'confirmData',
  SUCCESS: 'success'
};

// Estrutura de um lead
export const createEmptyLead = () => ({
  carType: null,
  budget: null,
  financing: null,
  financingTerm: null,
  visitScheduled: null,
  name: null,
  email: null,
  visitDate: null,
  visitTime: null
});


export class ChatbotStateMachine {
  constructor(cars = []) {
    this.currentState = STATES.START;
    this.lead = createEmptyLead();
    this.allCars = cars; // Carros reais da aplicação
    this.userLoggedIn = false;
  }

  //Puxar os dados se tiver com conta 
  setLoggedInUser(userData) {
    if (userData) {
      this.userLoggedIn = true;
      this.lead.name = userData.nome || userData.name || '';
      this.lead.email = userData.email || '';
    }
  }

  updateCars(cars) {
    this.allCars = cars;
    // debug logs apagadas
  }

  //filtrar carros por orcamento
  getCarsByBudget(budgetKey) {
    if (!this.allCars || this.allCars.length === 0) {
      return [];
    }

    // Filtrar carros por orcamento baseado no preço real 
    let filtered = [];
    if (budgetKey === 'budget_low') {
      filtered = this.allCars.filter(c => {
        const price = c.price !== undefined ? c.price : c.preco;
        return price >= 3000 && price <= 5000;
      });
    } else if (budgetKey === 'budget_mid') {
      filtered = this.allCars.filter(c => {
        const price = c.price !== undefined ? c.price : c.preco;
        return price > 5000 && price <= 10000;
      });
    } else if (budgetKey === 'budget_high') {
      filtered = this.allCars.filter(c => {
        const price = c.price !== undefined ? c.price : c.preco;
        return price > 10000 && price <= 20000;
      });
    } else if (budgetKey === 'budget_vhigh') {
      filtered = this.allCars.filter(c => {
        const price = c.price !== undefined ? c.price : c.preco;
        return price > 20000;
      });
    }

    // Se foi selecionado um tipo de carro filtrar também por categoria
    if (this.lead.carType) {
      filtered = filtered.filter(c => c.category === this.lead.carType);
    }

    

    return filtered;
  }

  getVisitCarOptions() {
    if (!this.allCars || this.allCars.length === 0) return [];

    const availableCars = this.allCars.filter(c => c.available !== false);
    const topCars = availableCars.slice(0, 8);

    return topCars.map(car => ({
      key: `visitcar_${car.id}`,
      label: `${car.brand || ''} ${car.model || ''} - €${(car.price || car.preco)?.toLocaleString('pt-PT')}`,
      carId: car.id,
      carName: `${car.brand} ${car.model}`
    }));
  }

  processInput(userInput = '', inputKey = null) {
    // Novo estado após processar input
    let nextState = this.currentState;
    let message = '';
    let options = [];

    // debug logs removed
    if (this.currentState === STATES.START) {
      message = 'Olá! 👋 Em que posso ajudá-lo?';
      options = [
        { key: 'cars', label: '🚗 Ver Viaturas' },
        { key: 'visit', label: '📅 Marcar Visita' },
        { key: 'contact', label: '📞 Contactos' }
      ];
      nextState = STATES.MAIN_MENU;
    }

    // Menu Inicial
    else if (this.currentState === STATES.MAIN_MENU && inputKey) {
      if (inputKey === 'cars') {
        message = 'Que tipo de viatura procura?';
        options = [
          { key: 'sedan', label: '🚗 Sedan' },
          { key: 'suv', label: '🚙 SUV' },
          { key: 'hatchback', label: '🚗 Hatchback' },
          { key: 'coupe', label: '🏎️ Coupe' },
          { key: 'station', label: '🚘 Station' }
        ];
        nextState = STATES.CAR_TYPE;
      } else if (inputKey === 'visit') {
        // Se utilizador está logado, pula para data; caso contrário, pede nome
        if (this.userLoggedIn && this.lead.name && this.lead.email) {
          message = `Perfeito, ${this.lead.name}! Que data prefere para a visita? (DD/MM/YYYY)`;
          options = [];
          nextState = STATES.COLLECT_DATE;
        } else {
          message = 'Ótimo! Para marcar uma visita, preciso de alguns dados.\n\nQual é o seu nome?';
          options = [];
          nextState = STATES.COLLECT_NAME;
        }
      } else if (inputKey === 'contact') {
        message = '📞 **Contactos**\n\n📱 Telemóvel: +351 916 081 792\n📧 Email: amralcarpopup@gmail.com\n📍 Instagram: @amaralcar_2021\n🕐 Horário: Segunda-Sexta 09:30-19:30 | Sábado-Domingo Encerrado\n🗺️ Morada: Av. João de Belas 37C, 2605-209 Belas, Portugal';
        options = [
          { key: 'back_menu', label: '← Voltar' }
        ];
        nextState = STATES.MAIN_MENU;
      } else if (inputKey === 'back_menu') {
        message = 'Como posso ajudá-lo? 😊';
        options = [
          { key: 'cars', label: '🚗 Ver Viaturas' },
          { key: 'visit', label: '📅 Marcar Visita' },
          { key: 'contact', label: '📞 Contactos' }
        ];
        nextState = STATES.MAIN_MENU;
      }
    }

    // Menu Tipo de Carro
    else if (this.currentState === STATES.CAR_TYPE && inputKey) {
      if (inputKey === 'back_menu') {
        message = 'Como posso ajudá-lo? 😊';
        options = [
          { key: 'cars', label: '🚗 Ver Viaturas' },
          { key: 'visit', label: '📅 Marcar Visita' },
          { key: 'contact', label: '📞 Contactos' }
        ];
        nextState = STATES.MAIN_MENU;
      } else {
        const carTypes = { sedan: 'Sedan', suv: 'SUV', hatchback: 'Hatchback', coupe: 'Coupe', station: 'Station' };
        this.lead.carType = carTypes[inputKey];
        message = `Perfeito! Procura um ${this.lead.carType}.\n\nQual é o seu orçamento?`;
        options = [
          { key: 'budget_low', label: '💰 3.000€ - 5.000€' },
          { key: 'budget_mid', label: '💰 5.000€ - 10.000€' },
          { key: 'budget_high', label: '💰 10.000€ - 20.000€' },
          { key: 'budget_vhigh', label: '💰 Acima de 20.000€' },
          { key: 'back_menu', label: '← Voltar' }
        ];
        nextState = STATES.BUDGET;
      }
    }

    // Menu Orçamento
    else if (this.currentState === STATES.BUDGET && inputKey) {
      if (inputKey === 'back_menu') {
        message = 'Como posso ajudá-lo? 😊';
        options = [
          { key: 'cars', label: '🚗 Ver Viaturas' },
          { key: 'visit', label: '📅 Marcar Visita' },
          { key: 'contact', label: '📞 Contactos' }
        ];
        nextState = STATES.MAIN_MENU;
      } else {
        const budgets = {
          budget_low: '3.000€ - 5.000€',
          budget_mid: '5.000€ - 10.000€',
          budget_high: '10.000€ - 20.000€',
          budget_vhigh: '> 20.000€'
        };
        this.lead.budget = budgets[inputKey];
        
        // Obter carros disponíveis com esse orçamento
        const cars = this.getCarsByBudget(inputKey);
        
        if (cars.length === 0) {
          message = `Desculpe, não temos carros disponíveis nessa faixa de preço.\n\nQuer tentar outro orçamento?`;
          options = [
            { key: 'budget_low', label: '💰 3.000€ - 5.000€' },
            { key: 'budget_mid', label: '💰 5.000€ - 10.000€' },
            { key: 'budget_high', label: '💰 10.000€ - 20.000€' },
            { key: 'budget_vhigh', label: '💰 Acima de 20.000€' },
            { key: 'back_menu', label: '← Voltar' }
          ];
          nextState = STATES.BUDGET;
        } else {
          message = `Ótimo! Encontrei ${cars.length} carro(s) disponível(is) com esse orçamento:\n\nQual gostaria de ver?`;
          options = cars.map(car => ({
            key: `car_${car.id}`,
            label: `${car.brand || ''} ${car.model || ''} - €${(car.price || car.preco)?.toLocaleString('pt-PT')}`,
            carId: car.id,
            carName: `${car.brand} ${car.model}`,
            carPrice: car.price || car.preco
          }));
          options.push({ key: 'back_menu', label: '← Voltar' });
          nextState = STATES.BROWSE_CARS;
        }
      }
    }

    // Menu Navegação de Carros
    else if (this.currentState === STATES.BROWSE_CARS && inputKey) {
      if (inputKey === 'back_menu') {
        message = 'Como posso ajudá-lo? 😊';
        options = [
          { key: 'cars', label: '🚗 Ver Viaturas' },
          { key: 'visit', label: '📅 Marcar Visita' },
          { key: 'contact', label: '📞 Contactos' }
        ];
        nextState = STATES.MAIN_MENU;
      } else {
        // Extrair ID do carro do inputKey (é uma string do Firestore)
        const carId = inputKey.replace('car_', '');
        
        // debug logs removed
        
        message = 'Redirecting...';
        options = [];
        nextState = STATES.BROWSE_CARS;
        
        // Retorna com signal especial para redirecionar
        const response = {
          message,
          options,
          nextState,
          lead: { ...this.lead },
          redirectTo: `/cars/${carId}`
        };
        
        // Atualizar estado
        this.currentState = nextState;
        return response;
      }
    }

    // Menu Financiamento
    else if (this.currentState === STATES.FINANCING && inputKey) {
      if (inputKey === 'financing_yes') {
        this.lead.financing = 'Sim';
        message = 'Qual prazo de financiamento prefere?';
        options = [
          { key: 'term_36', label: '36 meses' },
          { key: 'term_48', label: '48 meses' },
          { key: 'term_60', label: '60 meses' }
        ];
        nextState = STATES.FINANCING_TERM;
      } else {
        this.lead.financing = 'Não';
        message = 'Entendi! Pretende marcar uma visita?';
        options = [
          { key: 'visit_yes', label: '✓ Sim' },
          { key: 'visit_no', label: '✗ Não' }
        ];
        nextState = STATES.SCHEDULE_VISIT;
      }
    }

    // Menu Prazo de Financiamento
    else if (this.currentState === STATES.FINANCING_TERM && inputKey) {
      const terms = { term_36: '36 meses', term_48: '48 meses', term_60: '60 meses' };
      this.lead.financingTerm = terms[inputKey];
      message = `Prazo: ${this.lead.financingTerm}\n\nDeseja marcar uma visita?`;
      options = [
        { key: 'visit_yes', label: '✓ Sim' },
        { key: 'visit_no', label: '✗ Não' }
      ];
      nextState = STATES.SCHEDULE_VISIT;
    }

    // Menu Agendar Visita
    else if (this.currentState === STATES.SCHEDULE_VISIT && inputKey) {
      if (inputKey === 'visit_yes') {
        this.lead.visitScheduled = 'Sim';
        message = 'Perfeito! Para agendar, preciso de alguns dados.\n\nQual é o seu nome?';
        options = [];
        nextState = STATES.COLLECT_NAME;
      } else {
        this.lead.visitScheduled = 'Não';
        message = '✓ Obrigado pelo seu interesse! Entraremos em contacto em breve.';
        options = [
          { key: 'restart', label: '🔄 Começar de novo' }
        ];
        nextState = STATES.SUCCESS;
      }
    }

    // Menu Coletar Nome
    else if (this.currentState === STATES.COLLECT_NAME) {
      if (inputKey === 'back_menu') {
        message = 'Como posso ajudá-lo? 😊';
        options = [
          { key: 'cars', label: '🚗 Ver Viaturas' },
          { key: 'visit', label: '📅 Marcar Visita' },
          { key: 'contact', label: '📞 Contactos' }
        ];
        nextState = STATES.MAIN_MENU;
      } else if (userInput.trim().length < 2) {
        message = 'Por favor, insira um nome válido.';
        options = [];
        nextState = STATES.COLLECT_NAME;
      } else {
        this.lead.name = userInput.trim();
        message = 'Obrigado! Qual é o seu email?';
        options = [];
        nextState = STATES.COLLECT_EMAIL;
      }
    }

    // Menu Coletar Email
    else if (this.currentState === STATES.COLLECT_EMAIL) {
      if (inputKey === 'back_menu') {
        message = 'Como posso ajudá-lo? 😊';
        options = [
          { key: 'cars', label: '🚗 Ver Viaturas' },
          { key: 'visit', label: '📅 Marcar Visita' },
          { key: 'contact', label: '📞 Contactos' }
        ];
        nextState = STATES.MAIN_MENU;
      } else if (!this.isValidEmail(userInput)) {
        message = 'Por favor, insira um email válido.';
        options = [
          { key: 'back_menu', label: '← Voltar' }
        ];
        nextState = STATES.COLLECT_EMAIL;
      } else {
        this.lead.email = userInput.trim();
        message = 'Perfeito! Que data prefere para a visita? (DD/MM/YYYY)';
        options = [
          { key: 'back_menu', label: '← Voltar' }
        ];
        nextState = STATES.COLLECT_DATE;
      }
    }

    // Menu Coletar Data
    else if (this.currentState === STATES.COLLECT_DATE) {
      if (inputKey === 'back_menu') {
        message = 'Como posso ajudá-lo? 😊';
        options = [
          { key: 'cars', label: '🚗 Ver Viaturas' },
          { key: 'visit', label: '📅 Marcar Visita' },
          { key: 'contact', label: '📞 Contactos' }
        ];
        nextState = STATES.MAIN_MENU;
      } else if (!this.isValidDate(userInput)) {
        message = 'Por favor, insira uma data válida (DD/MM/YYYY).';
        options = [
          { key: 'back_menu', label: '← Voltar' }
        ];
        nextState = STATES.COLLECT_DATE;
      } else {
        this.lead.visitDate = userInput.trim();
        this.lead.visitTime = null;
        const availableSlots = this.getAvailableTimeSlots(this.lead.visitDate);
        if (!availableSlots.length) {
          const [d, m, y] = this.lead.visitDate.split('/').map(Number);
          const selectedDate = new Date(y, m - 1, d);
          const dayOfWeek = selectedDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const today = new Date();
          const isToday = selectedDate.toDateString() === today.toDateString();

          if (isWeekend) {
            message = 'Não há vagas para essa data porque estamos fechados ao fim de semana. Escolha uma data de segunda a sexta.';
          } else if (isToday) {
            message = 'Hoje já não há horários disponíveis. Escolha outra data.';
          } else {
            message = 'Não há vagas disponíveis para essa data. Por favor, escolha outra data.';
          }
          options = [
            { key: 'back_menu', label: '← Voltar' }
          ];
          nextState = STATES.COLLECT_DATE;
        } else {
          message = 'Selecione um horário disponível:';
          options = availableSlots.map((time) => ({
            key: `time_${time.replace(':', '_')}`,
            label: time
          }));
          options.push({ key: 'back_date', label: '← Alterar data' });
          nextState = STATES.COLLECT_TIME;
        }
      }
    }

    // Menu Coletar Hora
    else if (this.currentState === STATES.COLLECT_TIME && inputKey) {
      if (inputKey === 'back_date') {
        message = 'Perfeito! Que data prefere para a visita? (DD/MM/YYYY)';
        options = [
          { key: 'back_menu', label: '← Voltar' }
        ];
        nextState = STATES.COLLECT_DATE;
      } else {
        this.lead.visitTime = inputKey.replace('time_', '').replace('_', ':');
        message = this.getConfirmationMessage();
        options = [
          { key: 'confirm_yes', label: '✓ Confirmar' },
          { key: 'confirm_no', label: '✗ Cancelar' },
          { key: 'back_menu', label: '← Voltar' }
        ];
        nextState = STATES.CONFIRM_DATA;
      }
    }

    // Menu Confirmar Dados
    else if (this.currentState === STATES.CONFIRM_DATA && inputKey) {
      if (inputKey === 'confirm_yes') {
        message = '✓ Obrigado! O seu agendamento foi registado.\nEntraremos em contacto em breve! 🚗';
        options = [
          { key: 'restart', label: '🔄 Começar de novo' }
        ];
        nextState = STATES.SUCCESS;
      } else {
        message = 'Tudo bem! Como posso ajudá-lo? 😊';
        options = [
          { key: 'cars', label: '🚗 Ver Viaturas' },
          { key: 'visit', label: '📅 Marcar Visita' },
          { key: 'contact', label: '📞 Contactos' }
        ];
        nextState = STATES.MAIN_MENU;
      }
    }

    // Menu Sucesso
    else if (this.currentState === STATES.SUCCESS && inputKey === 'restart') {
      this.reset();
      message = 'Olá! 👋 Em que posso ajudá-lo?';
      options = [
        { key: 'cars', label: '🚗 Ver Viaturas' },
        { key: 'visit', label: '📅 Marcar Visita' },
        { key: 'contact', label: '📞 Contactos' }
      ];
      nextState = STATES.MAIN_MENU;
    }

    
    else {
      message = 'Desculpe, não compreendi. Tente novamente.';
      options = [];
    }

    // Atualizar estado
    this.currentState = nextState;

    return {
      message,
      options,
      nextState,
      lead: { ...this.lead }
    };
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getAvailableTimeSlots(dateString) {
    const slots = ['09:30', '10:30', '11:30', '14:30', '15:30', '16:30', '17:30'];
    if (!this.isValidDate(dateString)) return [];

    const [day, month, year] = dateString.split('/').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const dayOfWeek = selectedDate.getDay();

    // fim de semanas fechados
    if (dayOfWeek === 0 || dayOfWeek === 6) return [];

    const now = new Date();
    const isToday = now.toDateString() === selectedDate.toDateString();

    if (!isToday) return slots;

    // Se for hoje, remover horas ja passadas
    return slots.filter((time) => {
      const [h, m] = time.split(':').map(Number);
      const slotDate = new Date(year, month - 1, day, h, m, 0, 0);
      return slotDate.getTime() > now.getTime();
    });
  }

  isValidDate(dateString) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;

    const [day, month, year] = dateString.split('/').map(Number);
    
    // Validar mês e dia
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;

    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Data tem que ser hoje ou no futuro
    return date instanceof Date && 
           date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day &&
           date >= today;
  }

  getConfirmationMessage() {
    let msg = '📋 **Confirme os seus dados:**\n\n';
    msg += `👤 Nome: ${this.lead.name}\n`;
    msg += `📧 Email: ${this.lead.email}\n`;
    msg += `📅 Data: ${this.lead.visitDate}\n`;
    msg += `⏰ Hora: ${this.lead.visitTime}\n\n`;
    if (this.lead.carType) msg += `🚗 Tipo: ${this.lead.carType}\n`;
    if (this.lead.budget) msg += `💰 Orçamento: ${this.lead.budget}\n`;
    if (this.lead.financing) msg += `💳 Financiamento: ${this.lead.financing}\n`;
    if (this.lead.financingTerm) msg += `⏳ Prazo: ${this.lead.financingTerm}\n`;
    msg += '\nEstá tudo correto?';
    return msg;
  }

  getLead() {
    return { ...this.lead };
  }

  reset() {
    this.currentState = STATES.START;
    this.lead = createEmptyLead();
  }
}

export default ChatbotStateMachine;
