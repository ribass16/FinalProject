import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm'; 
import { validateLogin } from '../../utils/validators';
import { getUserProfile } from '../../services/userService'; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [waitingVerification, setWaitingVerification] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const verificationInterval = useRef(null);
  
  // Formulario com validacao
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    validateLogin
  );

  // Limpar intervalo ao desmontar componente
  useEffect(() => {
    return () => {
      if (verificationInterval.current) {
        clearInterval(verificationInterval.current);
      }
    };
  }, []);

  // Verificar email periodicamente
  useEffect(() => {
    if (waitingVerification && currentUser) {
      verificationInterval.current = setInterval(async () => {
        try {
          await currentUser.reload();
          
          if (currentUser.emailVerified) {
            clearInterval(verificationInterval.current);
            setWaitingVerification(false);
            
            // Busca perfil para verificar role
            const profileResult = await getUserProfile(currentUser.uid);
            
            if (profileResult.success && profileResult.data.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          }
        } catch (error) {
          console.error('Erro ao verificar email:', error);
        }
      }, 3000); // Verificar a cada 3 segundos
    }

    return () => {
      if (verificationInterval.current) {
        clearInterval(verificationInterval.current);
      }
    };
  }, [waitingVerification, currentUser, navigate]);

  const onSubmit = async () => {
    try {
      const userCredential = await login(values.email, values.password);
      
      // Busca perfil para verificar role
      const profileResult = await getUserProfile(userCredential.user.uid);
      
      // Admin não precisa verificar email
      const isAdmin = profileResult.success && profileResult.data.role === 'admin';
      
      // Verificar se o email foi confirmado (exceto para admin)
      if (!userCredential.user.emailVerified && !isAdmin) {
        setCurrentUser(userCredential.user);
        setWaitingVerification(true);
        return;
      }
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err.message || 'Erro ao iniciar sessão');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-10">
            <div className="text-center">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full p-3 mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Bem-vindo</h2>
              <p className="text-gray-300 text-sm">Inicia sessão para aceder ao painel</p>
            </div>
          </div>

          {/* Formulário */}
          <div className="px-8 py-8">
            {waitingVerification ? (
              // Mensagem de verificação de email
              <div className="space-y-5">
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl px-6 py-5">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-yellow-900 text-lg mb-2">Verifique o seu email</h3>
                      <p className="text-yellow-800 text-sm mb-3">
                        Foi enviado um email de verificação para <strong>{currentUser?.email}</strong>
                      </p>
                      <p className="text-yellow-700 text-sm">
                        Por favor, verifica o teu email e clica no link de confirmação. O sistema irá detectar automaticamente quando confirmares.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm text-blue-800 font-medium">
                      A aguardar verificação...
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setWaitingVerification(false);
                    setCurrentUser(null);
                    if (verificationInterval.current) {
                      clearInterval(verificationInterval.current);
                    }
                  }}
                  className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Cancelar e voltar ao login
                </button>
              </div>
            ) : (
              // Formulário de login normal
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all outline-none"
                />
                {errors.email && <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg> {errors.email}
                </p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all outline-none"
                />
                {errors.password && <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg> {errors.password}
                </p>}
              </div>

              <button className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3.5 rounded-xl font-bold text-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                Entrar
              </button>
            </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Não tens conta?{' '}
                <Link to="/register" className="text-gray-900 font-bold hover:underline">
                  Regista-te aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
