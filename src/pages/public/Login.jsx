import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm'; 
import { validateLogin } from '../../utils/validators'; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Formulario com validacao
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    validateLogin
  );

  const onSubmit = async () => {
    try {
      await login(values.email, values.password);
      navigate('/admin');
    } catch (err) {
      alert(err.message || 'Erro ao iniciar sessão');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sessão</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Senha"
              className="w-full px-4 py-3 border rounded-lg"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <button className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700">
            Entrar
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Não tens conta? <Link to="/register" className="text-red-600 hover:underline">Regista-te</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
