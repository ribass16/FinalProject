import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth, applyActionCode, checkActionCode } from 'firebase/auth';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const auth = getAuth();
  
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessingLink, setIsProcessingLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Processar link do email mesmo sem sessão ativa
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const oobCode = params.get('oobCode');

    if (mode === 'verifyEmail' && oobCode) {
      setIsProcessingLink(true);
      handleActionCode(oobCode);
      return;
    }

    const verified = params.get('verified');
    if (verified === 'true' && user) {
      checkEmailVerification();
    }
  }, [location, user, handleActionCode, checkEmailVerification]);

  // Ouvir sinalização de verificação feita noutra aba
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'email_verification_done') {
        // Mostrar modal e redirecionar localmente
        setIsVerified(true);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/login?verified=true');
        }, 2500);
      }
    };

    window.addEventListener('storage', onStorage);

    // Se já existir a flag (caso a ação tenha ocorrido antes de ouvirmos)
    try {
      const flag = localStorage.getItem('email_verification_done');
      if (flag) {
        setIsVerified(true);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/login?verified=true');
        }, 2500);
      }
    } catch {
      // ignora
    }

    return () => window.removeEventListener('storage', onStorage);
  }, [navigate]);

  // Verificação periódica a cada 3 segundos
  useEffect(() => {
    if (!isVerified && user && !isProcessingLink) {
      const interval = setInterval(() => {
        checkEmailVerification();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isVerified, user, isProcessingLink, checkEmailVerification]);

  const checkEmailVerification = useCallback(async () => {
    try {
      if (!auth.currentUser) return;

      // Recarregar o utilizador para obter emailVerified atualizado
      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        setIsVerified(true);
        setShowModal(true);

        // Fechar modal e redirecionar após 3 segundos
        setTimeout(() => {
          setShowModal(false);
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
    }
  }, [auth, navigate]);

  const handleActionCode = useCallback(async (oobCode) => {
    try {
      await checkActionCode(auth, oobCode);
      await applyActionCode(auth, oobCode);
      setIsVerified(true);
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate('/login?verified=true');
      }, 2500);
    } catch (error) {
      console.error('Erro ao aplicar código:', error);
      setErrorMsg(error.code === 'auth/invalid-action-code'
        ? 'Link inválido ou já utilizado.'
        : 'Erro ao verificar email.');
    } finally {
      setIsProcessingLink(false);
    }
  }, [auth, navigate]);

  return (
    <>
      {/* Modal de Sucesso */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl transform scale-100 transition-all">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4 animate-bounce">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Verificado! <span className="text-green-600">✓</span></h2>
            <p className="text-gray-700 mb-4">A tua conta está pronta para usar.</p>
            <p className="text-sm text-gray-500">Redirecionando...</p>
          </div>
        </div>
      )}

      {/* Página Principal */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-10">
              <div className="text-center">
                <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full p-3 mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Verificar Email</h2>
                <p className="text-gray-300 text-sm">Verifica a tua caixa de entrada</p>
              </div>
            </div>

            <div className="px-8 py-8">
              {user?.email && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    Enviámos um email de verificação para:
                    <br />
                    <strong className="text-blue-700">{user.email}</strong>
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center text-sm text-red-800">
                  {errorMsg}
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
                <div className="inline-block animate-spin mb-3">
                  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Aguardando verificação...
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Clica no link que enviámos para o teu email
                </p>
                <p className="text-xs text-gray-500">
                  Esta página atualiza automaticamente quando verificares
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-800 text-center">
                    <strong>✓ Assim que clicares no link</strong>, um popup aparecerá automaticamente e serás redirecionado!
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 text-center">
                    💡 Não recebeste? Verifica a pasta de spam/lixo
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  ← Voltar à página inicial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
