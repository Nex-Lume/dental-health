import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

interface InteractiveDentalCardProps {
  title: string;
  description: string;
  bgImage: string;
  to: string;
  className?: string;
}

export default function InteractiveDentalCard({
  title,
  description,
  bgImage,
  to,
  className = '',
}: InteractiveDentalCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const learnMoreRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const learnMoreArrowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const bg = bgRef.current;
    const overlay = overlayRef.current;
    const titleEl = titleRef.current;
    const descEl = descRef.current;
    const learnMoreEl = learnMoreRef.current;
    const btn = buttonRef.current;
    const learnMoreArrow = learnMoreArrowRef.current;

    if (!card || !bg || !overlay || !titleEl || !descEl || !learnMoreEl || !btn || !learnMoreArrow) return;

    // Set initial GSAP states
    gsap.set(bg, { scale: 1, x: 0, y: 0 });
    gsap.set(overlay, { opacity: 0 });
    gsap.set(titleEl, { y: 0 });
    gsap.set(descEl, { y: 25, opacity: 0 });
    gsap.set(learnMoreEl, { y: 25, opacity: 0 });
    gsap.set(btn, { rotation: -45, scale: 1, x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Subtle parallax offset on background image
      const moveX = (x / rect.width - 0.5) * -15;
      const moveY = (y / rect.height - 0.5) * -15;

      gsap.to(bg, {
        x: moveX,
        y: moveY,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Magnetic effect on the circular button
      const btnRect = btn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const distX = e.clientX - btnCenterX;
      const distY = e.clientY - btnCenterY;
      const distance = Math.hypot(distX, distY);

      // Pull button if cursor is within 100px range
      if (distance < 110) {
        gsap.to(btn, {
          x: distX * 0.35,
          y: distY * 0.35,
          scale: 1.12,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 1.05,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    const handleMouseEnter = () => {
      // 1. Lift card slightly and deepen shadow
      gsap.to(card, {
        y: -6,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.22)',
        duration: 0.5,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 2. Zoom background image
      gsap.to(bg, {
        scale: 1.12,
        duration: 0.6,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 3. Fade in glass overlay
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 4. Animate title upward
      gsap.to(titleEl, {
        y: -15,
        duration: 0.5,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 5. Slide secondary text & 'Learn More' up and fade in
      gsap.to(descEl, {
        y: -10,
        opacity: 0.85,
        duration: 0.5,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      gsap.to(learnMoreEl, {
        y: -10,
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 5b. Animate learn more arrow (horizontal micro-nudge)
      gsap.fromTo(learnMoreArrow,
        { x: 0 },
        { x: 5, duration: 0.65, ease: 'power1.inOut', yoyo: true, repeat: -1 }
      );

      // 6. Rotate circular button and enlarge
      gsap.to(btn, {
        rotation: 0,
        scale: 1.05,
        duration: 0.5,
        ease: 'power4.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      // 1. Reset card lift and shadow
      gsap.to(card, {
        y: 0,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 2. Reset bg zoom and parallax
      gsap.to(bg, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 3. Fade out glass overlay
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 4. Reset title position
      gsap.to(titleEl, {
        y: 0,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // 5. Reset secondary text & 'Learn More' position and opacity
      gsap.to(descEl, {
        y: 25,
        opacity: 0,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      gsap.to(learnMoreEl, {
        y: 25,
        opacity: 0,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });

      // Reset nudge animation
      gsap.killTweensOf(learnMoreArrow);
      gsap.to(learnMoreArrow, { x: 0, duration: 0.25, ease: 'power2.out' });

      // 6. Reset circular button position, rotation and scale
      gsap.to(btn, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: -45,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl cursor-default select-none bg-stone-900 group ${className}`}
      style={{
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
        willChange: 'transform',
      }}
    >
      {/* Background Image with parallax */}
      <img
        ref={bgRef}
        src={bgImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
        style={{
          willChange: 'transform',
        }}
      />

      {/* Dark tint base overlay for basic title readability when not hovered */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-1" />

      {/* Soft glass overlay (fades in on hover) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/35 backdrop-blur-[6px] pointer-events-none z-2"
        style={{
          willChange: 'opacity',
        }}
      />

      {/* Card Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 p-5 md:p-7 flex flex-col justify-between z-3 pointer-events-none"
      >
        {/* Top Section: Circular arrow button */}
        <div className="flex justify-end">
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              navigate(to);
            }}
            className="w-10 h-10 md:w-13 md:h-13 rounded-full border border-white/50 bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-colors duration-300 hover:bg-white hover:text-black pointer-events-auto cursor-pointer"
            aria-label="View Details"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 7h12m0 0L8 2m5 5L8 12" />
            </svg>
          </button>
        </div>

        {/* Bottom Section: Title & animated texts */}
        <div className="flex flex-col gap-1.5">
          <h4
            ref={titleRef}
            className="text-xl md:text-3xl font-bold text-white leading-tight tracking-tight whitespace-pre-line"
            style={{
              willChange: 'transform',
            }}
          >
            {title}
          </h4>

          {/* Hidden description that slides up */}
          <p
            ref={descRef}
            className="text-xs md:text-sm font-medium text-stone-200 leading-relaxed max-w-[85%]"
            style={{
              willChange: 'transform, opacity',
            }}
          >
            {description}
          </p>

          {/* Learn More link label */}
          <div
            ref={learnMoreRef}
            onClick={(e) => {
              e.stopPropagation();
              navigate(to);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mt-1 cursor-pointer pointer-events-auto hover:underline"
            style={{
              willChange: 'transform, opacity',
            }}
          >
            <span>Learn More</span>
            <svg
              ref={learnMoreArrowRef}
              width="10"
              height="10"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M1 7h12m0 0L8 2m5 5L8 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
