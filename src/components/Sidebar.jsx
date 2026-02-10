import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { subscribeAgendamentos } from "../services/appointmentService";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  const menuItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/cars", label: "Gestão de Carros" },
    { path: "/admin/add-car", label: "Adicionar Carro" },
    { path: "/admin/agendamentos", label: "Agendamentos", hasBadge: true },
    { path: "/admin/relatorios", label: "Relatórios" },
    { path: "/admin/calendario", label: "Calendário" },
  ];

  const isActive = (path) => location.pathname === path;

  // Monitorar agendamentos pendentes
  useEffect(() => {
    const unsubscribe = subscribeAgendamentos((agendamentos) => {
      const pending = agendamentos.filter((a) => a.status === "pendente").length;
      setPendingCount(pending);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-900 text-white z-50">
      {/* Logo */}
      <div className="flex flex-col justify-center px-6 h-24 border-b border-slate-700">
        <div className="text-2xl font-extrabold leading-none">
          <span className="text-red-500">Amaral</span>
          <span className="text-white">CAR</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">Comercio de Automoveis</div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4 flex flex-col h-[calc(100vh-200px)]">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-6">Navegação</p>
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span>{item.label}</span>
                {item.hasBadge && pendingCount > 0 && (
                  <span className="ml-auto flex items-center justify-center min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs font-bold rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Separador */}
        <div className="my-6 border-t border-slate-700"></div>

        {/* Ver site publico */}
        <Link
          to="/"
          className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all duration-200"
        >
          Voltar ao Site
        </Link>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900 space-y-3">
        {/* Admin Box */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2.5">
          {/* User Info */}
          {user?.email && (
            <div className="text-xs space-y-0.5">
              <p className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Admin</p>
              <p className="text-slate-200 font-medium truncate text-xs">{user.email}</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all duration-200"
        >
          Sair
        </button>

        {/* Copyright */}
        <p className="text-xs text-slate-500 text-center">Amaralcar © 2025</p>
      </div>
    </aside>
  );
};

export default Sidebar;
