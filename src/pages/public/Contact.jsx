const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Entre em Contacto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para ajudar. Visite-nos, ligue ou envie um email
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informações de Contacto */}
          <div className="space-y-6">
            {/* Endereço */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Morada</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Av. João de Belas 37C<br />
                    2605-209 Belas<br />
                    Portugal
                  </p>
                </div>
              </div>
            </div>

            {/* Telefone */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Telefone</h3>
                  <a
                    href="tel:+351912345678"
                    className="text-gray-600 hover:text-blue-600 transition-colors block mb-1"
                  >
                    +351 912 345 678
                  </a>
                  <a
                    href="tel:+351213456789"
                    className="text-gray-600 hover:text-blue-600 transition-colors block"
                  >
                    +351 21 345 6789
                  </a>
                </div>
              </div>
            </div>
            
              {/* Instagram */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Instagram</h3>
                    <p className="text-gray-600 leading-relaxed">
                      <a href="https://www.instagram.com/amaralcar_2021/?igsh=MXZsa2w2bDV0YnhmbA%3D%3D" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@amaralcar_2021</a>
                    </p>
                  </div>
                </div>
              </div>

            {/* Email */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                  <a
                    href="mailto:info@carpoint.pt"
                    className="text-gray-600 hover:text-blue-600 transition-colors block mb-1"
                  >
                    info@carpoint.pt
                  </a>
                  <a
                    href="mailto:vendas@carpoint.pt"
                    className="text-gray-600 hover:text-blue-600 transition-colors block"
                  >
                    vendas@carpoint.pt
                  </a>
                </div>
              </div>
            </div>

            {/* Horário */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Horário de Funcionamento</h3>
                  <div className="text-gray-600 space-y-1">
                    <p><strong>Sábado:</strong> Encerrado</p>
                    <p><strong>Domingo:</strong> Encerrado</p>
                    <p><strong>Segunda-feira:</strong> 09:30–19:30</p>
                    <p><strong>Terça-feira:</strong> 09:30–19:30</p>
                    <p><strong>Quarta-feira:</strong> 09:30–19:30</p>
                    <p><strong>Quinta-feira:</strong> 09:30–19:30</p>
                    <p><strong>Sexta-feira:</strong> 09:30–19:30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/amaralcar_2021/?igsh=MXZsa2w2bDV0YnhmbA%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 text-pink-600" fill="currentColor">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[600px] lg:h-auto relative">
            {/* Map wrapper: iframe uses the business address so the pin matches the Contact info */}
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                'Av. João de Belas 37C, 2605-209 Belas, Portugal'
              )}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização CarPoint"
            ></iframe>

            {/* Controls: Abrir no Maps / Direções */}
            <div className="absolute top-4 right-4 z-20 flex gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  'Av. João de Belas 37C, 2605-209 Belas, Portugal'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
                title="Abrir no Google Maps"
              >
                Abrir no Maps
              </a>

              <button
                onClick={() => {
                  const destination = 'Av. João de Belas 37C, 2605-209 Belas, Portugal';
                  const destParam = encodeURIComponent(destination);

                  // Tentar obter localização do utilizador para preencher a origem
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const { latitude, longitude } = pos.coords;
                        const origin = `${latitude},${longitude}`;
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destParam}&travelmode=driving`;
                        window.open(url, '_blank');
                      },
                      () => {
                        // Se o utilizador negar ou ocorrer erro, abrir a página de direções sem origem
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${destParam}&travelmode=driving`;
                        window.open(url, '_blank');
                      },
                      { timeout: 8000 }
                    );
                  } else {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${destParam}&travelmode=driving`;
                    window.open(url, '_blank');
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-red-700 transition"
                title="Obter direções"
              >
                Direções
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-black mb-4">Visite o Nosso Stand</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Venha conhecer pessoalmente a nossa seleção de veículos e esclareça todas as suas dúvidas com a nossa equipa
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://wa.me/351912345678"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+351912345678"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Ligar Agora</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
