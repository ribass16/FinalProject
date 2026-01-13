import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { createUserProfile } from '../../services/userService'; 
import { getUserProfile } from '../../services/userService';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [waitingVerification, setWaitingVerification] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const verificationInterval = useRef(null);

  // Limpar intervalo ao desmontar
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
            
            // Redirecionar baseado no role
            if (userRole === 'admin') {
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
  }, [waitingVerification, currentUser, userRole, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.length !== 9) {
      newErrors.telefone = 'Telefone deve ter 9 dígitos';
    }
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      console.log('Registando utilizador...', formData.email);
      const userCredential = await register(formData.email, formData.password);
      console.log('Utilizador criado:', userCredential.user.uid);
      console.log('Email enviado para:', formData.email);
      
      // Define role baseado no email
      const isAdmin = formData.email.toLowerCase().includes('admin');
      
      const profileData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        role: isAdmin ? 'admin' : 'cliente'
      };
      
      console.log('Criando perfil no Firestore:', profileData);
      
      const result = await createUserProfile(userCredential.user.uid, profileData);
      
      if (result.success) {
        console.log('Perfil criado com sucesso!');
        
        // Guardar dados para redirecionamento posterior
        setCurrentUser(userCredential.user);
        setUserRole(isAdmin ? 'admin' : 'cliente');
        
        // Mostrar tela de verificação
        setWaitingVerification(true);
      } else {
        console.error('Erro ao criar perfil:', result.error);
        alert('Conta criada mas erro ao salvar perfil: ' + result.error);
      }
    } catch (err) {
      console.error('Erro no registo:', err);
      alert(err.message || 'Erro ao registar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-10">
            <div className="text-center">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full p-3 mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Criar Conta</h2>
              <p className="text-gray-300 text-sm">Regista-te para aceder ao painel</p>
            </div>
          </div>

          {/* Formulário */}
          <div className="px-8 py-8">
            {waitingVerification ? (
              // Tela de verificação de email
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
                    <svg className="w-12 h-12 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Verifica o teu Email</h3>
                  <p className="text-gray-600">Enviámos um email para</p>
                  <p className="text-gray-900 font-semibold mt-1">{currentUser?.email}</p>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl px-6 py-5">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-yellow-900 font-semibold mb-2">Por favor, verifica o teu email</p>
                      <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                        <li>Abre a tua caixa de entrada</li>
                        <li>Procura o email de verificação (verifica também o spam)</li>
                        <li>Clica no link de confirmação</li>
                        <li>Aguarda... serás redirecionado automaticamente</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm text-blue-800 font-medium">
                      A aguardar verificação do email...
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
                  className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors py-2"
                >
                  Cancelar e voltar
                </button>
              </div>
            ) : (
              // Formulário de registro normal
              <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all outline-none"
                />
                {errors.nome && <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg> {errors.nome}
                </p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  maxLength={9}
                  placeholder="912345678"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all outline-none"
                />
                {errors.telefone && <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg> {errors.telefone}
                </p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all outline-none"
                />
                {errors.password && <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg> {errors.password}
                </p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repete a senha"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all outline-none"
                />
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg> {errors.confirmPassword}
                </p>}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Dica:</strong> Para criar conta de administrador, usa um email que contenha "admin" (ex: admin@stand.com)</span>
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3.5 rounded-xl font-bold text-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>
            )}

            {!waitingVerification && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Já tens conta?{' '}
                  <Link to="/login" className="text-gray-900 font-bold hover:underline">
                    Entrar aqui
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
