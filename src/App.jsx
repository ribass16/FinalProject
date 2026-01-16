import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Admin Components
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CarsManagement from "./pages/CarsManagement";
import CarForm from "./pages/CarForm";
import Agendamentos from "./pages/Agendamentos";
import Relatorios from "./pages/Relatorios";
import Calendario from "./pages/Calendario";

// Public Components
import PublicLayout from "./components/public/PublicLayout";
import Home from "./pages/public/Home";
import Inventory from "./pages/public/Inventory";
import CarDetails from "./pages/public/CarDetails";
import Contact from "./pages/public/Contact";
import Favoritos from "./pages/public/Favoritos";
import Profile from "./pages/public/Profile";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
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
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cars"
          element={
            <ProtectedRoute>
              <Layout>
                <CarsManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-car"
          element={
            <ProtectedRoute>
              <Layout>
                <CarForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-car/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <CarForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agendamentos"
          element={
            <ProtectedRoute>
              <Layout>
                <Agendamentos />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/relatorios"
          element={
            <ProtectedRoute>
              <Layout>
                <Relatorios />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/calendario"
          element={
            <ProtectedRoute>
              <Layout>
                <Calendario />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
