import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, applyActionCode, checkActionCode } from 'firebase/auth';

const EmailAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const [status, setStatus] = useState('loading'); 
  const [message, setMessage] = useState('');

  useEffect(() => {
    handleEmailAction();
  }, []);

  const handleEmailAction = async () => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const oobCode = params.get('oobCode');

    if (!oobCode) {
      setStatus('error');
      setMessage('Link inválido ou expirado');
      return;
    }

    try {
      // Verificar o código primeiro
      await checkActionCode(auth, oobCode);

      // se o modo for verificação de email 
      if (mode === 'verifyEmail') {
        await applyActionCode(auth, oobCode);
        setStatus('success');
        setMessage('Email verificado com sucesso!');

        // Sinalizar para outras abas que a verificação foi concluída
        try {
          localStorage.setItem('email_verification_done', Date.now().toString());
        } catch (e) {
          console.warn('Não foi possível gravar em localStorage:', e);
        }

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      }
    } catch (error) {
      console.error('Erro:', error);
      setStatus('error');
      setMessage(error.code === 'auth/invalid-action-code' 
        ? 'Link inválido ou já utilizado' 
        : 'Erro ao verificar email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="inline-block animate-spin mb-4">
              <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verificando email...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4 animate-bounce">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Verificado! ✅</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecionando para o login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-block bg-red-100 rounded-full p-4 mb-4">
              <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ir para Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailAction;
