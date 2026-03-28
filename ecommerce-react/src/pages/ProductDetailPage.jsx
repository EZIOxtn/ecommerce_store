import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../data/products'; // Should support id param now
import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useSettings } from '../contexts/SettingsContext';

export default function ProductDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useSettings();

  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(true);
      try {
        const foundProduct = await getProducts(false, false, "all", id);
  console.log(foundProduct);
        // Normalize keys for UI
        const normalizedProduct = {
          ...foundProduct,
          originalPrice: foundProduct.original_price,
          isExclusive: foundProduct.is_exclusive,
        };
  
        setProduct(normalizedProduct);
        setComments(foundProduct?.comments || []);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);
  

  const handleRating = (value) => {
    setRating(value);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        text: comment,
        id: Date.now(),
        user: {
          name: t('anonymousUser'),
          avatar: 'https://i.pravatar.cc/150'
        }
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  if (loading) {
    // Skeleton loader while loading data
    return (
      <div className="container mx-auto px-4 py-8 pt-20 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side image skeleton */}
          <div className="w-full md:w-1/2 bg-gray-300 rounded-lg h-80 md:h-[500px]" />

          {/* Right side text skeleton */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="h-10 bg-gray-300 rounded w-3/4"></div> {/* title */}
            <div className="h-6 bg-gray-300 rounded w-1/4"></div> {/* price */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div> {/* description line */}
              <div className="h-4 bg-gray-300 rounded w-5/6"></div> {/* description line */}
              <div className="h-4 bg-gray-300 rounded w-4/6"></div> {/* description line */}
            </div>
            <div className="h-10 bg-gray-300 rounded w-1/3 mt-6"></div> {/* button */}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('productNotFound')}
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            {t('backToProducts')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 relative">
        {product.isExclusive && (
    <div className="absolute top-2 right-2 z-30 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
      {t('exclusive')}
    </div>
  )}

          {parseFloat(product.originalPrice) && parseFloat(product.price) < parseFloat(product.originalPrice) && (
            <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {t('discount')} -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}

          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={true}
            loop={true}
            effect="fade"
            loading="lazy"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="mySwiper rounded-lg relative z-10"
          >
            {[product.image, ...(product.additionalImages || [])].map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`${product.name} image ${index + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>

          {parseFloat(product.originalPrice) && parseFloat(product.price) < parseFloat(product.originalPrice) ? (
            <div className="flex items-center mb-2">
              <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mr-2">${parseFloat(product.price).toFixed(2)}</span>
              <span className="text-sm text-gray-500 line-through">${parseFloat(product.originalPrice).toFixed(2)}</span>
              <span className="ml-2 text-sm font-semibold text-green-600 dark:text-green-400">
                {-Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice) * 100))} off
              </span>
            </div>
          ) : (
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">${parseFloat(product.price).toFixed(2)}</p>
          )}

          <p className="text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>

          <div className="flex items-center mb-4">
            <span className="mr-2 text-gray-700 dark:text-gray-300">{t('rating')}:</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-700 font-medium">{parseFloat(product.rating).toFixed(1)}</span>
              {[1, 2, 3, 4, 5].map((star) => {
                const fill =
                  product.rating >= star
                    ? 'text-yellow-400'
                    : product.rating >= star - 0.5
                    ? 'text-yellow-400 opacity-50'
                    : 'text-gray-300';
                return (
                  <Star key={star} className={`h-5 w-5 md:h-6 md:w-6 ${fill} fill-current`} />
                );
              })}
            </div>
          </div>

          
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            {t('addToCart')}
          </button>
        </div>
      </div>

      {/* More Description Section */}
      <section className="mt-8 py-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {t('moreDetails')}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {product.description} {/* Re-using existing product description or adding more if available */}
        </p>
        {/* You can add more detailed information here if your product data includes it, e.g., specifications, features, etc. */}
      </section>
    </div>
  );
}
