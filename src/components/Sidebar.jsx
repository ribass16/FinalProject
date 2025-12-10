// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/cars", label: "Gestão de Carros" },
    { path: "/admin/add-car", label: "Adicionar Carro" },
  ];

  const isActive = (path) => location.pathname === path;

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
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">Amaralcar © 2025</p>
      </div>
    </aside>
  );
};

export default Sidebar;
