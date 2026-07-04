import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface CallUsButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function CallUsButton({ onClick, className = '' }: CallUsButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const icon = iconRef.current;
    const text = textRef.current;

    if (!button || !icon || !text) return;

    // Set initial states
    // Phone icon is hidden to the left, scaled down, and rotated
    gsap.set(icon, { x: -12, opacity: 0, rotation: -35, scale: 0.85 });
    gsap.set(text, { x: 0 });

    const handleMouseEnter = () => {
      // 1. Lift button subtly and increase shadow
      gsap.to(button, {
        y: -3,
        scale: 1.025,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      // 2. Animate phone icon in with spring-like easing (back.out)
      gsap.to(icon, {
        x: 0,
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.8)', // Spring bounce effect
        overwrite: 'auto',
      });

      // 3. Shift text slightly to the right to make room
      gsap.to(text, {
        x: 8,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      // 1. Reset button position, scale and shadow
      gsap.to(button, {
        y: 0,
        scale: 1,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      // 2. Reset phone icon position, opacity, scale and rotation
      gsap.to(icon, {
        x: -12,
        opacity: 0,
        rotation: -35,
        scale: 0.85,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      // 3. Reset text position
      gsap.to(text, {
        x: 0,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const hasPosition = className.includes('absolute') || className.includes('fixed') || className.includes('relative');
  const basePosition = hasPosition ? '' : 'relative';

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`${basePosition} overflow-hidden flex items-center justify-center bg-white border border-neutral-200/40 rounded-full px-5 py-3 md:px-8 md:py-5 text-black text-base md:text-xl font-bold transition-shadow duration-300 cursor-pointer ${className}`}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        willChange: 'transform',
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Phone icon (anchored to the left of the text container) */}
        <span
          ref={iconRef}
          className="absolute right-full mr-2.5 flex items-center justify-center pointer-events-none"
          style={{
            willChange: 'transform, opacity',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-black"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>

        {/* Button text */}
        <span
          ref={textRef}
          className="inline-block pointer-events-none"
          style={{
            willChange: 'transform',
          }}
        >
          Call Us
        </span>
      </div>
    </button>
  );
}
