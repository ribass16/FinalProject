import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ActionHandler from './components/ActionHandler';
import ChatBot from './components/ChatBot';

// Auth pages
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import VerifyEmail from './pages/public/VerifyEmail';
import EmailAction from './pages/public/EmailAction';

// Admin Components
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CarsManagement from "./pages/CarsManagement";
import CarForm from "./pages/CarForm";
import Agendamentos from "./pages/Appointments";
import Relatorios from "./pages/Reports";
import Calendario from "./pages/Calendar";

// Public Components
import PublicLayout from "./components/public/PublicLayout";
import Home from "./pages/public/Home";
import Inventory from "./pages/public/Inventory";
import CarDetails from "./pages/public/CarDetails";
import Contact from "./pages/public/Contact";
import Favoritos from "./pages/public/Favorites";
import Profile from "./pages/public/Profile";

import "./App.css";

function App() {
  const ChatbotVisibility = () => {
    const location = useLocation();
    return !location.pathname.startsWith('/admin') ? <ChatBot /> : null;
  };
  return (
    <Router>
      <AuthProvider>
        <ActionHandler>
          <Routes>
        {/* Rotas Públicas */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/cars"
          element={
            <PublicLayout>
              <Inventory />
            </PublicLayout>
          }
        />
        <Route
          path="/cars/:id"
          element={
            <PublicLayout>
              <CarDetails />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />
        {/* route /agendar removed — using modal on car details instead */}
        <Route path="/favoritos" element={<Favoritos />} />
        <Route 
          path="/profile" 
          element={
            <PublicLayout>
              <Profile />
            </PublicLayout>
          } 
        />
        {/* email-verified route removed - email verification disabled */}

        {/* Rotas admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout title="Dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cars"
          element={
            <ProtectedRoute>
              <Layout title="Gestão de Carros">
                <CarsManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-car"
          element={
            <ProtectedRoute>
              <Layout title="Adicionar Carro">
                <CarForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-car/:id"
          element={
            <ProtectedRoute>
              <Layout title="Editar Carro">
                <CarForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agendamentos"
          element={
            <ProtectedRoute>
              <Layout title="Agendamentos">
                <Agendamentos />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/relatorios"
          element={
            <ProtectedRoute>
              <Layout title="Relatórios">
                <Relatorios />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/calendario"
          element={
            <ProtectedRoute>
              <Layout title="Calendário">
                <Calendario />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/__/auth/action" element={<EmailAction />} />
        </Routes>
        </ActionHandler>
        <ChatbotVisibility />
      </AuthProvider>
    </Router>
  );
}

export default App;
