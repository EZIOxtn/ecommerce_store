import React, {useMemo, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../data/products';  // Import getProducts for API fetch
import { useSettings } from '../contexts/SettingsContext';
import ProductCategorySlider from '../components/ProductCategorySlider';
import LazyLoader from '../components/LazyLoader'; // ✅ import
import ProductCard from '../components/ProductCard';

const groupByCategory = (products) => {
  return products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});
};

export default function ProductsPage({ onAddToCart }) {
  const { t } = useSettings();
  const { categoryName } = useParams();
  const [pageProducts, setPageProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  function LazyProductCard({ product }) {
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
  useEffect(() => {
    async function fetchProducts() {
      console.log('fetching products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const now = Date.now();
      const cacheKey = categoryName || 'all';
      const cachedData = localStorage.getItem(`products_${cacheKey}`);
      const cachedTime = localStorage.getItem(`products_${cacheKey}_time`);
  
      if (cachedData && cachedData != 'undefined' &&cachedData != '[]' && cachedTime && now - parseInt(cachedTime, 10) < 5 * 60 * 1000) {
        setPageProducts(JSON.parse(cachedData));
        setLoading(false);
        return;
      }
  
      try {
        const isFiltered = !!categoryName;
        const productsData = await getProducts(isFiltered, categoryName || 'all');
        
        setPageProducts(productsData.products);
        localStorage.setItem(`products_${cacheKey}`, JSON.stringify(productsData.products));
        localStorage.setItem(`products_${cacheKey}_time`, now.toString());
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          t('checkInternetConnection') || 'Error fetching products. Please check your internet connection.'
        );
      } finally {
        setLoading(false);
      }
    }
  
    fetchProducts();
  }, [categoryName]);
  

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  if (categoryName) {
    return (
      <div className="w-full max-w-none mx-0 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 pl-4 md:pl-6">
          {t('category')} : {categoryName}
        </h1>
        <LazyLoader>
          <ProductCategorySlider
            title={categoryName}
            products={pageProducts}
            viewAllLink={`/category/${categoryName.toLowerCase()}`}
            onAddToCart={onAddToCart}
          />
        </LazyLoader>
      </div>
    );
  }

  const groupedProducts = useMemo(() => groupByCategory(pageProducts), [pageProducts]);

  return (
    <div className="w-full max-w-none mx-0 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 pl-4 md:pl-6">
        {t('ourProducts')}
      </h1>
  
      {loading ? (
        // 🔄 Show skeletons in grid while loading
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-2 sm:gap-4 sm:px-4 mb-8 min-h-[300px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} delay={i * 100} />
          ))}
        </div>
      ) : (
        // ✅ Show product cards after loading
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-2 sm:gap-4 sm:px-4 mb-8 min-h-[300px]">
          {pageProducts.map((product) => (
            <LazyProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
  
      {/* 🧩 Product sliders per category */}
      <div className="space-y-8 px-2 sm:px-4">
        {Object.entries(groupedProducts).map(([category, products]) => (
          <LazyLoader key={category}>
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{category}</h2>
              <div className="relative">
                <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                  {products.map((product) => (
                    <div key={product.id} className="flex-none w-[160px] sm:w-[200px] snap-start">
                      <ProductCard product={product} onAddToCart={onAddToCart} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LazyLoader>
        ))}
      </div>
    </div>
  );
  
}
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
