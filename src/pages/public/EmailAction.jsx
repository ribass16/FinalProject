import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, applyActionCode, checkActionCode, confirmPasswordReset } from 'firebase/auth';

const EmailAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const [status, setStatus] = useState('loading'); 
  const [message, setMessage] = useState('');
  const [modeState, setModeState] = useState(null);
  const [oobCodeState, setOobCodeState] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    handleEmailAction();
  }, []);

  const handleEmailAction = async () => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const oobCode = params.get('oobCode');
    setModeState(mode);
    setOobCodeState(oobCode);

    console.log('DEBUG - mode:', mode, 'oobCode:', oobCode); // DEBUG

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

      // Se for recuperação de senha, mostramos o formulário para nova senha
      if (mode === 'resetPassword') {
        setStatus('reset');
        setMessage('Por favor, insere a nova senha.');
        return;
      }
    } catch (error) {
      console.error('Erro:', error);
      setStatus('error');
      setMessage(error.code === 'auth/invalid-action-code' 
        ? 'Link inválido ou já utilizado' 
        : 'Erro ao processar a ação do email');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCodeState, newPassword);
      setStatus('success');
      setMessage('Senha atualizada com sucesso! Redirecionando para login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      console.error('Erro ao confirmar nova senha:', error);
      setStatus('error');
      setMessage(error.code === 'auth/weak-password' ? 'Senha fraca.' : 'Erro ao atualizar senha.');
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

        {status === 'reset' && (
          <>
            <div className="inline-block bg-indigo-100 rounded-full p-4 mb-4">
              <svg className="w-16 h-16 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Redefinir Senha</h2>
            <p className="text-gray-700 mb-4">{message}</p>

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nova senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar senha</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-gray-900 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {message && !message.includes('Por favor') && (
                <div className="text-sm text-red-600">{message}</div>
              )}

              <div className="flex gap-3 justify-center">
                <button type="button" onClick={() => navigate('/login')} className="px-4 py-3 border-2 border-gray-200 rounded-xl">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl">Atualizar</button>
              </div>
            </form>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4 animate-bounce">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Senha Atualizada! <span className="text-green-600">✓</span></h2>
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
