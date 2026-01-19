import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-900 p-6">
      <Sidebar />
      <main className="flex-1 ml-72">
        {/* Main content card com curvas extremas */}
        <div className="h-[calc(100vh-48px)] bg-white rounded-[50px] shadow-2xl overflow-hidden flex flex-col">
          {/* Header interno */}
          <div className="h-20 border-b border-gray-100 flex items-center justify-between px-12">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full"></div>
            </div>
          </div>

          {/* Conteúdo com animação de slide */}
          <div key={location.pathname} className="flex-1 overflow-y-auto px-12 py-8 animate-slideIn">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
