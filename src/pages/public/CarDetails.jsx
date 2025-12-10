import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseClient";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, "automoveis", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCar({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Carro não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar carro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">A carregar detalhes...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-8xl mb-6">😕</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Carro Não Encontrado
          </h2>
          <p className="text-gray-600 mb-8">
            O carro que procura não existe ou foi removido
          </p>
          <button
            onClick={() => navigate("/cars")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            ← Voltar à Listagem
          </button>
        </div>
      </div>
    );
  }

  const handleContact = () => {
    const message = `Olá! Estou interessado no ${car.brand} ${car.model} (${car.year})`;
    const whatsappUrl = `https://wa.me/351912345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailContact = () => {
    const subject = `Interessado em ${car.brand} ${car.model}`;
    const body = `Olá,\n\nEstou interessado no seguinte veículo:\n\n${car.brand} ${car.model} (${car.year})\nPreço: €${car.price?.toLocaleString()}\n\nAguardo o vosso contacto.\n\nObrigado!`;
    window.location.href = `mailto:info@carpoint.pt?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/cars")}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
          >
            <span>←</span>
            <span>Voltar à Listagem</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagem */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {car.image ? (
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center text-9xl">
                  🚗
                </div>
              )}
            </div>

            {/* Badge de Status */}
            <div className="flex items-center justify-center">
              <span
                className={`px-6 py-3 rounded-xl text-lg font-bold shadow-lg ${
                  car.available
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                }`}
              >
                {car.available ? "✓ Disponível Agora" : "✕ Indisponível"}
              </span>
            </div>
          </div>

          {/* Detalhes */}
          <div>
            {/* Título e Preço */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              {car.category && (
                <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold mb-4">
                  {car.category}
                </span>
              )}
              
              <h1 className="text-5xl font-black text-gray-900 mb-4">
                {car.brand} {car.model}
              </h1>
              
              <div className="flex items-end gap-2 mb-6">
                <span className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  €{car.price?.toLocaleString()}
                </span>
              </div>

              {/* Especificações */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Ano</p>
                  <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>📅</span>
                    <span>{car.year}</span>
                  </p>
                </div>
                {car.mileage && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Quilometragem</p>
                    <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span>🛣️</span>
                      <span>{car.mileage?.toLocaleString()} km</span>
                    </p>
                  </div>
                )}
                {car.fuel && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Combustível</p>
                    <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span>⛽</span>
                      <span>{car.fuel}</span>
                    </p>
                  </div>
                )}
                {car.transmission && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Transmissão</p>
                    <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span>⚙️</span>
                      <span>{car.transmission}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Botões de Contacto */}
              <div className="space-y-3">
                <button
                  onClick={handleContact}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">💬</span>
                  <span>Contactar via WhatsApp</span>
                </button>
                <button
                  onClick={handleEmailContact}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">✉️</span>
                  <span>Contactar por Email</span>
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">📞</span>
                  <span>Ver Contactos do Stand</span>
                </button>
              </div>
            </div>

            {/* Descrição */}
            {car.description && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span>
                  <span>Descrição</span>
                </h2>
                <p className="text-gray-700 leading-relaxed">{car.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
