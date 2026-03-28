// components/LazyLoader.js
import { useEffect, useRef, useState } from 'react';

export default function LazyLoader({ children, rootMargin = '100px' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing after visible
        }
      },
      { rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{isVisible ? children : null}</div>;
}
