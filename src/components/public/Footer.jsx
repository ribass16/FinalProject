import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
  <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
                <div className="mb-4">
              <h3 className="text-2xl font-black">Amaralcar</h3>
              <p className="text-sm text-blue-300">O seu stand de confiança</p>
            </div>
            <p className="text-gray-300 mb-4">
              Encontre o carro dos seus sonhos com as melhores condições do mercado. 
              Qualidade, confiança e transparência em cada negócio.
            </p>
            <div className="flex gap-4 mt-2">
                <a href="https://www.instagram.com/amaralcar_2021/?igsh=MXZsa2w2bDV0YnhmbA%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                   className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
                  </svg>
                </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">
                  → Início
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">
                  → Ver Carros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">
                  → Contacto
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">
                  → Área Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">Contactos</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Av. João de Belas 37C,<br/>2605-209 Belas</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+351912345678" className="hover:text-white">+351 912 345 678</a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:amaralcarpopup@gmail.com" className="hover:text-white">amaralcarpopup@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>Seg-Sex: 9h-19h<br/>Sáb: 9h-13h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800/50 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} <span className="font-bold text-white">Amaralcar</span>. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
