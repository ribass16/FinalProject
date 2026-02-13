import { useState } from 'react';
import { createReview } from '../services/reviewService';
import { useAuth } from '../contexts/authContextObject';

const ReviewModal = ({ isOpen, onClose, agendamento }) => {
  const { user, userProfile } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert('Por favor, escreve um comentário');
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        userId: user.uid,
        userName: userProfile.nome,
        agendamentoId: agendamento.id,
        carroId: agendamento.carroId,
        carroNome: agendamento.carName || agendamento.carroNome || 'Carro',
        rating: rating,
        comment: comment.trim()
      };

      const result = await createReview(reviewData);

      if (result.success) {
        alert('Review enviada com sucesso! 🎉');
        setRating(5);
        setComment('');
        onClose();
      } else {
        alert('Erro ao enviar review: ' + result.error);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Deixar Review</h2>
            <p className="text-sm text-gray-600 mt-1">{agendamento.carName || agendamento.carroNome || 'Carro'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Avaliação
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-10 h-10 ${
                      star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                    stroke="currentColor"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Comentário */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Comentário *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partilha a tua experiência..."
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'A enviar...' : 'Enviar Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
