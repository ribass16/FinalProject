# CarPoint

CarPoint e uma plataforma web moderna para gestao e visualizacao de veiculos de um stand automovel.
Permite aos clientes explorar o inventario, interagir com os veiculos e agendar visitas, enquanto fornece ao administrador um painel completo de controlo.

## 🔗 Aceder ao projeto

https://carpoint-b8b54.web.app/

## 📌 Funcionalidades

### 👤 Utilizador (Publico)

- 🔎 Pesquisa e filtragem de veiculos
- 🚗 Visualizacao detalhada de carros
- ❤️ Sistema de favoritos
- 📅 Agendamento de visitas
- ⭐ Submissao de reviews
- 💬 Chatbot integrado para apoio rapido
- 📞 Contacto direto (WhatsApp / chamada / email)
- 👤 Registo e autenticacao de utilizadores

### 🔐 Administracao (Dashboard)

- 📊 Dashboard com estatisticas gerais
- 🚘 Gestao completa de veiculos (CRUD)
- 🖼️ Upload de imagens
- 📅 Gestao de agendamentos
- 🗓️ Visualizacao em calendario
- 📄 Exportacao de relatorios em PDF
- ⭐ Gestao de reviews

## 🧭 Estrutura da Aplicacao

### 🌐 Paginas Publicas

- Home - Destaques e navegacao rapida
- Inventory - Catalogo com filtros avancados
- Car Details - Informacao detalhada do veiculo
- Favorites - Lista de carros guardados
- Contact - Informacao e localizacao
- Auth - Login, registo e perfil

### 🛠️ Dashboard (Admin)

- Dashboard - Visao geral
- Cars Management - Gestao de veiculos
- Car Form - Criacao/edicao de carros
- Appointments - Gestao de marcacoes
- Calendar - Visualizacao temporal
- Reports - Exportacao de relatorios

## ⚙️ Tecnologias Utilizadas

- Frontend: React
- Backend/DB: Firebase (Firestore)
- Autenticacao: Firebase Auth
- Storage: Firebase Storage
- Email: EmailJS
- PDF: jsPDF
- Deploy: Firebase Hosting

## 🔄 Fluxos Principais

### Utilizador

1. Navega pelo inventario
2. Aplica filtros
3. Visualiza detalhes do carro
4. Agenda visita ou adiciona aos favoritos

### Administrador

1. Acede ao dashboard
2. Gere veiculos
3. Confirma ou rejeita agendamentos
4. Exporta relatorios

## 🤖 Funcionalidades Extra

- Chatbot com respostas automaticas
- Sistema de reviews de clientes
- Interface responsiva
- Integracao com mapas
- Exportacao de dados em PDF

## 🔐 Seguranca

- Utilizacao de variaveis de ambiente (.env)
- Protecao de rotas com autenticacao
- Regras de seguranca no Firebase
- Separacao entre utilizadores e administradores

## 🚀 Instalacao Local

```bash
# Clonar repositorio
git clone <repo-url>

# Entrar na pasta
cd carpoint

# Instalar dependencias
npm install

# Executar projeto
npm run dev
```

## 📁 Configuracao

Criar um ficheiro .env com:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=

VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
```

## 📦 Build

```bash
npm run build
```
