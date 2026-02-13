import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      {}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu"
          className="p-2 rounded-md bg-white/10 hover:bg-white/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-lg font-bold">Admin</div>
        <div style={{ width: 36 }} />
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* responsividade para telemovel */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="md:ml-72">
        {}
        <div className="min-h-[calc(100vh-48px)] bg-white rounded-[50px] shadow-2xl overflow-hidden flex flex-col mx-4 md:mx-8 lg:mx-12">
          {/* Header interno */}
          <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6 md:px-12">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full" />
            </div>
          </div>

          {/* Conteúdo com animação de slide */}
          <div key={location.pathname} className="flex-1 overflow-y-auto px-4 md:px-12 py-6 md:py-8 animate-slideIn">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
