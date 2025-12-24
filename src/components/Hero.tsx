interface HeroProps {
  onShopClick: () => void;
}

export function Hero({ onShopClick }: HeroProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-beige-100 via-beige-50 to-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-maroon-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon-800 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col items-center justify-center text-center">
        <div className="space-y-8 max-w-3xl">
          <div className="space-y-4">
            <p className="text-maroon-900 font-semibold tracking-widest uppercase text-sm">
              Luxury Modest Fashion
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-maroon-900 font-serif leading-tight">
              Live in Time
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 font-light leading-relaxed">
              Discover timeless elegance meets modern design. Our curated collection of abayas, kaftans, and hijabs
              celebrates cultural beauty with contemporary sophistication.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onShopClick}
              className="px-8 py-4 bg-maroon-900 text-white rounded-lg hover:bg-maroon-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Shop Now
            </button>
            <button
              className="px-8 py-4 border-2 border-maroon-900 text-maroon-900 rounded-lg hover:bg-maroon-50 transition-all duration-300 font-semibold text-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              title: 'Premium Quality',
              description: 'Handpicked fabrics and meticulous craftsmanship in every piece',
            },
            {
              title: 'Modest Fashion',
              description: 'Celebrate your style with elegance and cultural consciousness',
            },
            {
              title: 'Ethical Production',
              description: 'Fair trade practices supporting artisans and communities',
            },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <h3 className="text-lg font-semibold text-maroon-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
