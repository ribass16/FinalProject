import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ActionHandler = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const oobCode = params.get('oobCode');
    const isOnActionPage = location.pathname === '/__/auth/action';

    // Se tiver parametros  de acao do Firebase manda para a pagina certa
    if (mode && oobCode && !isOnActionPage) {
      if (mode === 'resetPassword' || mode === 'verifyEmail') {
        navigate(`/__/auth/action${location.search}`, { replace: true });
      }
    }
  }, [location, navigate]);

  return children;
};

export default ActionHandler;
