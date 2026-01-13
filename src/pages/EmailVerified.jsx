import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EmailVerified = () => {
  const { user } = useAuth();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setVerified(true);
        }
      }
    };

    checkVerification();
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">
          Email Verificado!
        </h2>
        <p className="text-gray-600 mb-6">
          O teu email foi verificado com sucesso.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            💡 <strong>Podes fechar esta aba</strong> e voltar à página anterior. 
            Vais ser redirecionado automaticamente!
          </p>
        </div>
        <button
          onClick={() => window.close()}
          className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-600 transition-all"
        >
          Fechar Esta Aba
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
