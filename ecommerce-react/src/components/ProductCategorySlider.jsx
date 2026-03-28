import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductCategorySlider({ title, products, viewAllLink, onAddToCart }) {
  const swiperRef = useRef(null);
  const { t } = useSettings();

  return (
    <div className="relative mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        {viewAllLink && (
          <a
            href={viewAllLink}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            {t('viewAll')}
          </a>
        )}
      </div>

      <div className="group relative px-4">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md rounded-full p-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={20}
            slidesPerView="auto"
            centeredSlides={false}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4.2,
                spaceBetween: 20,
              },
            }}
            className="!pb-10 !px-1"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="!w-auto">
                <div className="transform transition-transform duration-300 hover:scale-[1.02]">
                  <ProductCard product={product} onAddToCart={onAddToCart} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md rounded-full p-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
} 