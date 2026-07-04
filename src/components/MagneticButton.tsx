import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function MagneticButton({ children, onClick, className = '' }: MagneticButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    const bg = bgRef.current;
    const textContainer = textContainerRef.current;
    const text = textRef.current;
    const arrow = arrowRef.current;

    if (!container || !button || !bg || !text || !arrow) return;

    // Set initial states
    gsap.set(bg, { xPercent: -101 });
    gsap.set(arrow, { x: 15, opacity: 0, scale: 0.8 });
    gsap.set(text, { x: 0 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Calculate mouse cursor position relative to the center of the button
      const centerX = rect.left + width / 2;
      const centerY = rect.top + height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Magnetic strength (damping factor)
      const magnetStrength = 0.35; 
      const textStrength = 0.15;

      gsap.to(button, {
        x: distanceX * magnetStrength,
        y: distanceY * magnetStrength,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      gsap.to(textContainer, {
        x: distanceX * textStrength,
        y: distanceY * textStrength,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const handleMouseEnter = () => {
      // 1. Subtle scale-up to 1.03 and premium soft shadow
      gsap.to(button, {
        scale: 1.03,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
        duration: 0.5,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 2. Black background slides in from left to right (xPercent -101 to 0)
      if (gsap.getProperty(bg, 'xPercent') === 101) {
        gsap.set(bg, { xPercent: -101 });
      }
      gsap.to(bg, {
        xPercent: 0,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 3. Translate text to the left and change to white
      gsap.to(text, {
        x: -8,
        color: '#ffffff',
        duration: 0.5,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 4. Slide arrow in from the right and change to white
      gsap.to(arrow, {
        x: 0,
        opacity: 1,
        scale: 1,
        color: '#ffffff',
        duration: 0.5,
        ease: 'power4.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      // 1. Reset button position, scale, and shadow
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      gsap.to(textContainer, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 2. Background slides out to the right (xPercent 0 to 101)
      gsap.to(bg, {
        xPercent: 101,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 3. Reset text position and color (black)
      gsap.to(text, {
        x: 0,
        color: '#000000',
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 4. Slide arrow out to the right and fade out
      gsap.to(arrow, {
        x: 15,
        opacity: 0,
        scale: 0.8,
        color: '#000000',
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={containerRef}
      onClick={onClick}
      className="relative flex items-center justify-center p-4 -m-4 bg-transparent border-none outline-none select-none cursor-pointer focus:outline-none"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <div
        ref={buttonRef}
        className={`relative overflow-hidden flex items-center justify-center bg-white border border-neutral-200/40 rounded-full px-6 py-3.5 md:px-9 md:py-4 text-black text-sm md:text-base font-bold transition-shadow duration-300 pointer-events-none ${className}`}
        style={{
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
          willChange: 'transform',
        }}
      >
        {/* Sliding background */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-black pointer-events-none rounded-full"
          style={{
            zIndex: 0,
            width: '100%',
            height: '100%',
            willChange: 'transform',
          }}
        />

        {/* Text and arrow container */}
        <div
          ref={textContainerRef}
          className="relative z-10 flex items-center justify-center pointer-events-none"
          style={{
            willChange: 'transform',
          }}
        >
          <span
            ref={textRef}
            className="inline-block"
            style={{
              willChange: 'transform, color',
            }}
          >
            {children}
          </span>
          <span
            ref={arrowRef}
            className="absolute left-[calc(100%+4px)] inline-flex items-center justify-center"
            style={{
              willChange: 'transform, opacity, color',
            }}
          >
            {/* Elegant premium arrow matching the theme */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 7h12m0 0L8 2m5 5L8 12" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}
