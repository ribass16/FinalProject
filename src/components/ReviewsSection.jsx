import { useState, useEffect } from 'react';
import { getRecentReviews } from '../services/reviewService';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const result = await getRecentReviews(3);
      if (result.success) {
        setReviews(result.data);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            stroke="currentColor"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Não mostra nada se não houver reviews
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            O Que Dizem os Nossos Clientes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Veja as experiências de quem já confiou em nós
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Stars */}
              <div className="mb-4">
                {renderStars(review.rating)}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 line-clamp-4 leading-relaxed">
                "{review.comment}"
              </p>

              {/* User Info */}
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-gray-900 mb-1">{review.userName}</p>
                <p className="text-sm text-gray-500">{review.carroNome}</p>
              </div>

              {/* Date */}
              <div className="mt-3">
                <p className="text-xs text-gray-400">
                  {review.createdAt && new Date(review.createdAt.seconds * 1000).toLocaleDateString('pt-PT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Quote Icon */}
        <div className="text-center mt-12">
          <svg className="w-12 h-12 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
