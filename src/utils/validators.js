// Verificao de email
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Verifica min de caracteres 
export const validatePassword = (password) => password.length >= 6;

// Valida formulario login
export const validateLogin = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Email inválido';
  }
  if (!values.password) {
    errors.password = 'Senha é obrigatória';
  } else if (!validatePassword(values.password)) {
    errors.password = 'Senha deve ter no mínimo 6 caracteres';
  }
  return errors;
};

// Valida formulario registo
export const validateRegister = (values) => {
  const errors = validateLogin(values);
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem';
  }
  return errors;
};

// Valida formulario carro
export const validateCar = (values) => {
  const errors = {};
  if (!values.marca) errors.marca = 'Marca é obrigatória';
  if (!values.modelo) errors.modelo = 'Modelo é obrigatório';
  if (!values.ano) errors.ano = 'Ano é obrigatório';
  if (!values.preco) errors.preco = 'Preço é obrigatório';
  if (!values.km) errors.km = 'Quilometragem é obrigatória';
  if (!values.combustivel) errors.combustivel = 'Combustível é obrigatório';
  if (!values.transmissao) errors.transmissao = 'Transmissão é obrigatória';
  return errors;
};

// Valida formulario contacto
export const validateContact = (values) => {
  const errors = {};
  if (!values.name) errors.name = 'Nome é obrigatório';
  if (!values.email) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Email inválido';
  }
  if (!values.message) {
    errors.message = 'Mensagem é obrigatória';
  } else if (values.message.length < 10) {
    errors.message = 'Mensagem muito curta (mínimo 10 caracteres)';
  }
  return errors;
};

// Valida formulario agendamento
export const validateAgendamento = (values) => {
  const errors = {};
  if (!values.nome) errors.nome = 'Nome é obrigatório';
  if (!values.email) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Email inválido';
  }
  if (!values.telefone) {
    errors.telefone = 'Telefone é obrigatório';
  } else if (values.telefone.length !== 9) {
    errors.telefone = 'Telefone deve ter exatamente 9 dígitos';
  }
  if (!values.data) errors.data = 'Data é obrigatória';
  if (!values.hora) errors.hora = 'Hora é obrigatória';
  return errors;
};
