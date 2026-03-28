import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PromotionalBanner() {
  const [currentPromo, setCurrentPromo] = useState(0);
  
  const promotions = [
    {
      type: 'new',
      title: 'New Arrival',
      description: 'Latest Tech Gadgets',
      discount: null,
      image: '/images/new-arrival.jpg',
      link: '/products/new-arrivals'
    },
    {
      type: 'discount',
      title: 'Flash Sale',
      description: 'Up to 50% Off',
      discount: '50%',
      image: '/images/flash-sale.jpg',
      link: '/products/sale'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-lg">
            {promotions.map((promo, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-between p-6 transition-opacity duration-500 ${
                  currentPromo === index ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transform: currentPromo === index ? 'translateX(0)' : 'translateX(100%)' }}
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold">
                    {promo.type === 'new' ? '🆕 NEW ARRIVAL' : '🔥 SPECIAL OFFER'}
                  </div>
                  <h3 className="text-2xl font-bold mt-1">{promo.title}</h3>
                  <p className="text-lg opacity-90">{promo.description}</p>
                  <Link
                    to={promo.link}
                    className="inline-block mt-4 px-6 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
                {promo.discount && (
                  <div className="ml-6">
                    <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center transform rotate-12 animate-pulse">
                      <div className="text-center">
                        <div className="text-2xl font-bold">Save</div>
                        <div className="text-3xl font-extrabold">{promo.discount}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 