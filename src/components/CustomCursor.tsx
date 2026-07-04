import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const toothRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const pauseTextRef = useRef<HTMLSpanElement>(null);
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device supports touch
    const checkTouch = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;
    const tooth = toothRef.current;
    const sparkles = sparklesRef.current;
    const pauseText = pauseTextRef.current;
    if (!cursor || !tooth || !sparkles || !pauseText) return;

    // Set initial position out of screen with centering offsets
    gsap.set(cursor, { x: -100, y: -100, xPercent: -50, yPercent: -50 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Smooth movement interpolation using GSAP quickTo
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });

    // Ticker update loop
    const onTick = () => {
      xTo(mouse.x);
      yTo(mouse.y);
    };
    gsap.ticker.add(onTick);

    // Track state dynamically
    let hoveredElement: HTMLElement | null = null;

    const updateCursorState = (target: HTMLElement | null) => {
      if (!target || typeof target.closest !== 'function') {
        // Reset to default circle (solid white with black border)
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: '1px',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(tooth, {
          scale: 0,
          opacity: 0,
          rotation: 0,
          duration: 0.25,
          ease: 'power2.in'
        });
        gsap.to(pauseText, {
          scale: 0,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in'
        });
        return;
      }

      const anchor = target.closest('a');
      const button = target.closest('button') || target.closest('[role="button"]');
      const isPause = target.closest('[data-cursor="pause"]') || target.getAttribute('data-cursor') === 'pause';

      // Book Appointment or Book Consultation text/class check
      const text = ((anchor?.textContent || button?.textContent || target.textContent) || '').toLowerCase();
      const isSpecialButton = (anchor || button) && (
        text.includes('book appointment') ||
        text.includes('book consultation') ||
        text.includes('book free consultation') ||
        text.includes('book now')
      );

      if (isPause) {
        // Expand circle to a large size and show "PAUSE" text
        gsap.to(cursor, {
          scale: 3.5,
          backgroundColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: '1px',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(pauseText, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(tooth, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        });
      } else if (isSpecialButton) {
        // Morph to realistic tooth
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: '0px',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(tooth, {
          scale: 1.1,
          opacity: 1,
          rotation: 12,
          duration: 0.4,
          ease: 'back.out(2)'
        });
        gsap.to(pauseText, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        });
      } else if (anchor || button) {
        // Enlarge circle for standard links/buttons (thin outline Awwwards behavior, slightly smaller hover)
        gsap.to(cursor, {
          scale: 1.35, // slightly smaller hover as requested
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // clean white fill
          borderColor: '#000000', // black ring
          borderWidth: '1px',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(tooth, {
          scale: 0,
          opacity: 0,
          rotation: 0,
          duration: 0.25,
          ease: 'power2.in'
        });
        gsap.to(pauseText, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        });
      } else {
        // Reset to default circle (solid white with black border)
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: '1px',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(tooth, {
          scale: 0,
          opacity: 0,
          rotation: 0,
          duration: 0.25,
          ease: 'power2.in'
        });
        gsap.to(pauseText, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      hoveredElement = target;
      updateCursorState(hoveredElement);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      // If exiting the browser or moving to null
      if (!relatedTarget) {
        hoveredElement = null;
      } else {
        hoveredElement = relatedTarget;
      }
      updateCursorState(hoveredElement);
    };

    const spawnSparkles = () => {
      const count = 6;
      for (let i = 0; i < count; i++) {
        const spark = document.createElement('div');
        spark.className = 'absolute w-1 h-1 bg-black rounded-full pointer-events-none opacity-85';
        sparkles.appendChild(spark);

        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 18 + Math.random() * 12;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        gsap.fromTo(spark,
          { x: 0, y: 0, scale: 1, opacity: 0.9 },
          {
            x: tx,
            y: ty,
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => spark.remove()
          }
        );
      }
    };

    const handleMouseDown = () => {
      const isToothActive = tooth.style.opacity === '1' || parseFloat(tooth.style.opacity) > 0.5;

      if (isToothActive) {
        // Realistic tooth bounce and rotation on click
        gsap.to(tooth, {
          scale: 0.8,
          rotation: -10,
          duration: 0.1,
          ease: 'power1.out',
          onComplete: () => {
            gsap.to(tooth, {
              scale: 1.1,
              rotation: 12,
              duration: 0.45,
              ease: 'elastic.out(1.2, 0.4)'
            });
            spawnSparkles();
          }
        });
      } else {
        // Default circle bounce
        gsap.to(cursor, {
          scale: 0.8,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power1.out'
        });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(onTick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isMobile, location.pathname]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor-dot fixed top-0 left-0 w-4 h-4 rounded-full border border-black bg-white pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform flex items-center justify-center"
      style={{
        mixBlendMode: 'normal',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
    >
      {/* Realistic Tooth SVG wrapper */}
      <div
        ref={toothRef}
        className="absolute opacity-0 scale-0 flex items-center justify-center text-black pointer-events-none"
        style={{
          transformOrigin: 'center center',
          width: '28px',
          height: '28px',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19.33 7.82c-.36-1.74-1.54-3.23-3.22-3.85C14.73 3.46 13.3 3.96 12 4.79 10.7 3.96 9.27 3.46 7.89 3.97c-1.68.62-2.86 2.11-3.22 3.85C4.33 9.4 4 11.5 4 13.5c0 .9.2 1.8.5 2.62.6 1.62 1.8 2.89 3.32 3.56.55.24 1.13.39 1.73.44.42.04.81-.24.89-.66l.51-2.57c.1-.47.5-.81.98-.81h.14c.48 0 .88.34.98.81l.51 2.57c.08.42.47.7.89.66.6-.05 1.18-.2 1.73-.44 1.52-.67 2.72-1.94 3.32-3.56.3-.82.5-1.72.5-2.62 0-2-.33-4.1-.67-5.68z" />
        </svg>
      </div>

      {/* PAUSE text for video hover */}
      <span
        ref={pauseTextRef}
        className="absolute opacity-0 scale-0 text-[8px] font-bold uppercase tracking-widest text-black pointer-events-none select-none"
      >
        Pause
      </span>

      {/* Sparkles element anchor */}
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none overflow-visible" />
    </div>
  );
}
