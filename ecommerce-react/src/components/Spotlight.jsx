import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';  // Assuming you have lucide-react installed; if not, install via `npm install lucide-react`

export default function Spotlight({ targetSelector }) {
  const spotlightRef = useRef(null);
  const arrowRef = useRef(null);  // Ref for the arrow

  useEffect(() => {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement && spotlightRef.current && arrowRef.current) {
      const rect = targetElement.getBoundingClientRect();
      spotlightRef.current.style.position = 'absolute';
      spotlightRef.current.style.left = `${rect.left + window.scrollX}px`;
      spotlightRef.current.style.top = `${rect.top + window.scrollY}px`;
      spotlightRef.current.style.width = `${rect.width}px`;
      spotlightRef.current.style.height = `${rect.height}px`;
      spotlightRef.current.style.background = 'transparent';

      // Position the arrow below the spotlight for now (adjust based on layout)
      arrowRef.current.style.position = 'absolute';
      arrowRef.current.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;  // Center horizontally
      arrowRef.current.style.top = `${rect.top + window.scrollY + rect.height + 10}px`;  // Below the element
    }
  }, [targetSelector]);

  return (
    <>
      <div
        ref={spotlightRef}
        className="absolute rounded-lg pointer-events-none ring-4 ring-blue-500 ring-offset-2 animate-pulse"  // Changed to blue and removed blurry effects
        style={{ 
          boxShadow: '0 0 15px 5px rgba(59, 130, 246, 0.5)', 
          background: 'transparent', 
          filter: 'none'  // This overrides any inherited blur or filters, keeping the interior clear
        }}
      />
      {/* <div ref={arrowRef} className="absolute pointer-events-none">
        <ArrowDown className="h-6 w-6 text-blue-500" />  
      </div> */}
    </>
  );
}