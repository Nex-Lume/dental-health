import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// A single tooth shape rendered as an SVG path within a white panel
const TOOTH_COUNT = 8;

function ToothShape({ flipped }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 55"
      className="w-full h-14 md:h-20"
      preserveAspectRatio="none"
      style={{ display: 'block', transform: flipped ? 'scaleY(-1)' : 'none' }}
    >
      {/* Tooth silhouette: flat top, rounded cusps at bottom (upper jaw) */}
      <path
        d="M0,0 L60,0 L60,20
           C55,20 52,28 50,35 C48,42 46,55 40,55
           C36,55 34,45 30,45
           C26,45 24,55 20,55
           C14,55 12,42 10,35 C8,28 5,20 0,20 Z"
        fill="white"
      />
    </svg>
  );
}

type Phase = 'idle' | 'closing' | 'closed' | 'opening';

export default function TeethTransition() {
  const location = useLocation();
  const [phase, setPhase] = useState<Phase>('idle');
  const prevPath = useRef(location.pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't animate on initial load
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    // Clear any pending timers
    if (timerRef.current) clearTimeout(timerRef.current);

    // Phase 1: start closing (jaws animate in)
    setPhase('closing');

    // Phase 2: mark as fully closed (content has already changed under the curtain)
    timerRef.current = setTimeout(() => {
      setPhase('closed');
      // Phase 3: start opening (jaws retract)
      timerRef.current = setTimeout(() => {
        setPhase('opening');
        // Phase 4: back to idle, remove overlay
        timerRef.current = setTimeout(() => {
          setPhase('idle');
        }, 550);
      }, 220);
    }, 480);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  if (phase === 'idle') return null;

  return (
    <div className={`teeth-transition ${phase}`} aria-hidden="true">
      {/* Upper jaw */}
      <div className="teeth-top w-full bg-white flex-1">
        <div className="w-full flex items-end">
          {Array.from({ length: TOOTH_COUNT }).map((_, i) => (
            <div key={i} className="flex-1">
              <ToothShape />
            </div>
          ))}
        </div>
      </div>

      {/* Lower jaw */}
      <div className="teeth-bottom w-full bg-white flex-1">
        <div className="w-full flex items-start">
          {Array.from({ length: TOOTH_COUNT }).map((_, i) => (
            <div key={i} className="flex-1">
              <ToothShape flipped />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
