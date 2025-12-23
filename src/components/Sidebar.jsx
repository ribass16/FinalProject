// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/cars", label: "Gestão de Carros" },
    { path: "/admin/add-car", label: "Adicionar Carro" },
    { path: "/admin/agendamentos", label: "Agendamentos" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50">
      <div className="flex items-center px-6 h-16 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Amaralcar</h1>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Separador */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Ver site publico */}
        <Link
          to="/"
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Voltar ao Site
        </Link>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-3">
        {/* Botao de Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Sair
        </button>
        
        {user?.email && (
          <p className="text-xs text-gray-500 text-center truncate">{user.email}</p>
        )}
        
        <p className="text-xs text-gray-500 text-center">Amaralcar © 2025</p>
      </div>
    </aside>
  );
};

export default Sidebar;
