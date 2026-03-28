import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getProducts, fetchAnnouncements } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useSettings } from "../contexts/SettingsContext";

function ProductCardSkeleton() {
  // Simple skeleton for product card: gray blocks with rounded corners
  return (
    <div className="animate-pulse p-4 bg-white dark:bg-gray-800 rounded-md shadow">
      <div className="bg-gray-300 dark:bg-gray-700 h-40 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );
}

export default function HomePage({ onAddToCart }) {
  const { t } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      console.log('fetching featured products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const now = Date.now();
      const cacheKey = "featured_products";
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(`${cacheKey}_time`);

      if (
        cachedData &&
        cachedData != "[]" &&
        cachedTime &&
        now - parseInt(cachedTime, 10) < 5 * 60 * 1000
      ) {
        setFeaturedProducts(JSON.parse(cachedData));
        console.log("Featured products fetched from cache");
        setLoading(false);
        return;
      }

      try {
        const res = await getProducts(true, true);
        const products = res?.products ?? [];
        setFeaturedProducts(products);
        localStorage.setItem(cacheKey, JSON.stringify(products));
        localStorage.setItem(`${cacheKey}_time`, now.toString());
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
        setFeaturedProducts([]);
      }
      setLoading(false);
    }

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAnnouncements();
      const announcement = data ?? [];
      setAnnouncements(announcement);
      console.log(announcements);
    };
    fetchData();
  }, []);

  function LazyProductCard({ product, onAddToCart }) {
    const ref = useRef();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { 
          threshold: 0.1,
          rootMargin: '50px' // Load slightly before the element comes into view
        }
      );

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={ref}
        className={`transform-gpu transition-all duration-500 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <ProductCard 
          product={product} 
          onAddToCart={onAddToCart} 
          loading={!visible}
        />
      </div>
    );
  }

  function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const [loadedImages, setLoadedImages] = useState({});
    const [errorImages, setErrorImages] = useState({});
    const fallbackImg = "/fallback.jpg";

    console.log("Announcements in HeroCarousel:", announcements);

    const nextSlide = () => {
      clearTimeout(timeoutRef.current);
      if (announcements.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }
    };

    const prevSlide = () => {
      clearTimeout(timeoutRef.current);
      if (announcements.length > 0) {
        setCurrentIndex((prev) =>
          prev === 0 ? announcements.length - 1 : prev - 1
        );
      }
    };

    useEffect(() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(nextSlide, 4000);
      return () => clearTimeout(timeoutRef.current);
    }, [currentIndex, announcements.length]);

    const handleLoad = (index) => {
      setLoadedImages((prev) => ({ ...prev, [index]: true }));
    };

    const handleError = (index) => {
      setErrorImages((prev) => ({ ...prev, [index]: true }));
    };

    return (
      <section className="relative overflow-hidden h-[400px] md:h-[500px]">
        <div className="relative h-full w-full">
          {Array.isArray(announcements) && announcements.map((item, index) => {
            const isActive = index === currentIndex;
            const hasLoaded = loadedImages[index];
            const hasError = errorImages[index];

            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out 
                  ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"} transition-blur duration-300`}
              >
                <Link to={item.link} className="block h-full w-full relative">
                  {!hasLoaded && !hasError && (
                    <div className="absolute inset-0 z-10 bg-gray-300 dark:bg-gray-700 animate-pulse">
                      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-[shimmer_1.5s_infinite] bg-[length:400%_100%]" />
                    </div>
                  )}

                  <img
                    src={hasError ? fallbackImg : item.photo}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-300 ease-in-out
                      ${!hasLoaded ? "opacity-0" : "opacity-100"}
                      ${isActive ? "blur-0" : "blur-sm"}`}
                    loading="lazy"
                    onLoad={() => handleLoad(index)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/500x500?text=No+Image';
                    }}
                    draggable={false}
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-2">
                      {item.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-4">{item.description}</p>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-md"
                    >
                      {t("shopNow")}
                    </button>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>
    );
  }

  return (
    <div>
      <HeroCarousel />

      {/* Featured Products */}
      <section className="py-8 md:py-16 bg-gray-50 dark:bg-gray-900">
        
        <div className="container mx-auto px-4">
          <h2
            id="prd"
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 md:mb-8"
          >
            {t("featuredProducts")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? // Show 8 skeleton cards while loading
                Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : featuredProducts.map((product) => (
                  <LazyProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
          </div>
          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/products"
              className="inline-block bg-gray-800 text-white px-6 md:px-8 py-2 md:py-3 rounded-md hover:bg-gray-900 transition-colors duration-300"
            >
              {t("viewAllProducts")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
