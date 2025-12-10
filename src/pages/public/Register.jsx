import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showConsoleLink, setShowConsoleLink] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (!name.trim()) {
        setError('Por favor insere o teu nome.');
        return;
      }

      const userCredential = await register(email, password);
      // Atualizar displayName no perfil do utilizador
      try {
        await updateProfile(userCredential.user, { displayName: name.trim() });
      } catch (updErr) {
        console.warn('Não foi possível actualizar o perfil:', updErr);
      }

      navigate('/admin');
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/configuration-not-found') {
        setError('Método de autenticação não configurado no Firebase.');
        setShowConsoleLink(true);
      } else {
        setError(err.message || 'Erro ao registar');
        setShowConsoleLink(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Registar Conta</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        {showConsoleLink && (
          <div className="mb-3">
            <a
              href="https://console.firebase.google.com/project/carpoint-b8b54/authentication/providers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Abrir configuração de Sign-in no Firebase Console
            </a>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            required
            className="w-full px-4 py-3 border rounded-lg"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha (mínimo 6 caracteres)"
            required
            className="w-full px-4 py-3 border rounded-lg"
          />
          <button className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold">Criar Conta</button>
        </form>

        <p className="mt-4 text-sm text-gray-600">Já tens conta? <Link to="/login" className="text-red-600 hover:underline">Entrar</Link></p>
      </div>
    </div>
  );
};

export default Register;
