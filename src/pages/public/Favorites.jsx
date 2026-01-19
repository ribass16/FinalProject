import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeFavoritos, removeFavorito } from '../../services/favoritesService';
import { subscribeAutomoveis } from '../../services/firestoreService';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';

const Favoritos = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [carros, setCarros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const unsubscribeFavoritos = subscribeFavoritos(user.uid, setFavoritos);
    const unsubscribeCarros = subscribeAutomoveis(setCarros);

    setLoading(false);

    return () => {
      unsubscribeFavoritos();
      unsubscribeCarros();
    };
  }, [user, navigate]);

  const carrosFavoritos = carros.filter(carro => 
    favoritos.some(fav => fav.carId === carro.id)
  );

  const handleRemoveFavorito = async (carId) => {
    const result = await removeFavorito(user.uid, carId);
    if (!result.success) {
      alert('Erro ao remover dos favoritos');
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Carregando...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Meus Favoritos
          </h1>
          <p className="text-xl text-gray-600">
            {carrosFavoritos.length} {carrosFavoritos.length === 1 ? 'carro salvo' : 'carros salvos'}
          </p>
        </div>

        {carrosFavoritos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-600 mb-6">
              Começa a adicionar carros aos favoritos para vê-los aqui!
            </p>
            <button
              onClick={() => navigate('/inventory')}
              className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-8 py-3 rounded-xl font-bold hover:from-gray-800 hover:to-gray-600 transition-all"
            >
              Ver Inventário
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {carrosFavoritos.map(carro => (
              <div key={carro.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative">
                  <img
                    src={carro.image || (carro.images && carro.images[0]) || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}
                    alt={`${carro.brand} ${carro.model}`}
                    className="w-full h-56 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFavorito(carro.id)}
                    className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all shadow-lg"
                    title="Remover dos favoritos"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {carro.brand} {carro.model}
                  </h3>
                  <p className="text-3xl font-black text-gray-900 mb-4">
                    €{parseInt(carro.price).toLocaleString('pt-PT')}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{carro.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🛣️</span>
                      <span>{parseInt(carro.km || carro.mileage || 0).toLocaleString('pt-PT')} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⛽</span>
                      <span>{carro.fuel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⚙️</span>
                      <span>{carro.transmission}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/cars/${carro.id}`)}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-800 hover:to-gray-600 transition-all"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Favoritos;
