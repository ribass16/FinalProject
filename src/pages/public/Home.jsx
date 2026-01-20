
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeAutomoveis } from "../../services/firestoreService";
import CarCard from "../../components/public/CarCard";
import ReviewsSection from "../../components/ReviewsSection";

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [totalAvailableCars, setTotalAvailableCars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeAutomoveis((allCars) => {
      // adiciona os ultimos 3 carros apenas 
      const available = allCars.filter(car => car.available);
      setTotalAvailableCars(available.length);
      setFeaturedCars(available.slice(0, 3));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    if (featuredCars.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCars.length);
    }, 5000); //5 seg

    return () => clearInterval(interval);
  }, [featuredCars]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCars.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredCars.length) % featuredCars.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-black mb-6 animate-fadeIn">
              Encontre o Seu Carro dos Sonhos
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              A maior seleção de veículos premium com as melhores condições do mercado. 
              Qualidade garantida e total transparência.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fadeIn px-4" style={{ animationDelay: "0.4s" }}>
              <button
                onClick={() => navigate("/cars")}
                className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span></span>
                <span className="whitespace-nowrap">Ver Todos os Carros</span>
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span></span>
                <span>Contactar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
            <div className="text-center">
              <div className="text-5xl font-black text-gray-900 mb-2">{totalAvailableCars}</div>
              <p className="text-gray-600 font-semibold">Carros Disponíveis</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-gray-900 mb-2">100%</div>
              <p className="text-gray-600 font-semibold">Satisfação Garantida</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900">
              Viaturas em Destaque
            </h2>
          </div>

          {featuredCars.length > 0 ? (
            <>
              {/* Carrossel */}
              <div className="relative max-w-5xl mx-auto">
                {/* Container do Carrossel */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
                  {/* Slides */}
                  <div 
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {featuredCars.map((car) => (
                      <div key={car.id} className="min-w-full">
                        <div className="relative bg-gray-50 aspect-[4/3] sm:aspect-[16/9] md:aspect-[18/8] flex items-center justify-center">
                          {/* Imagem do Carro */}
                          <img
                            src={car.image || "https://via.placeholder.com/1200x675?text=Sem+Imagem"}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/1200x675?text=Imagem+Indisponível";
                            }}
                          />

                          {/* Informações sobre a imagem */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 sm:p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between text-white gap-3 sm:gap-0">
                              <div className="w-full sm:w-auto">
                                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 flex-wrap">
                                  <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                    📅 {car.year}
                                  </span>
                                  <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                    ⛽ {car.fuel}
                                  </span>
                                  <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                    {car.category}
                                  </span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black">
                                  {car.brand} {car.model}
                                </h3>
                              </div>
                              <div className="w-full sm:w-auto text-left sm:text-right">
                                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3">
                                  {car.price?.toLocaleString('pt-PT')} €
                                </div>
                                <button
                                  onClick={() => navigate(`/cars/${car.id}`)}
                                  className="bg-white text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto"
                                >
                                  Ver Detalhes →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botões de Navegação */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-2.5 md:p-3 rounded-full shadow-xl hover:scale-110 transition-all duration-300 z-10"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-2.5 md:p-3 rounded-full shadow-xl hover:scale-110 transition-all duration-300 z-10"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Indicadores (Dots) */}
                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {featuredCars.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentSlide
                            ? 'bg-white w-8 h-2'
                            : 'bg-white/50 hover:bg-white/75 w-2 h-2'
                        }`}
                        aria-label={`Ir para slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center mt-12 px-4">
                <button
                  onClick={() => navigate("/cars")}
                  className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 w-full sm:w-auto justify-center"
                >
                  <span className="whitespace-nowrap">Ver Todos os Carros</span>
                  <span>→</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🚗</div>
              <p className="text-2xl text-gray-400 font-semibold">
                Nenhum carro disponível no momento
              </p>
              <p className="text-gray-500 mt-2">
                Volte em breve para ver as novidades!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4">Pronto para Encontrar o Seu Carro?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco hoje e deixe-nos ajudá-lo a encontrar o veículo perfeito
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl inline-flex items-center gap-3"
          >
            <span>📞</span>
            <span>Contactar Agora</span>
          </button>
        </div>
      </section>

      {/* Secao de Reviews (dinâmica) */}
      <ReviewsSection />
    </div>
  );
};

export default Home;
