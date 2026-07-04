import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { getServiceBySlug } from '../data/servicesData';
import MagneticButton from '../components/MagneticButton';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const BENTO_TILES = [

  {
    id: 'a',
    gridArea: 'a',
    bgPos: '50% 40%',
    bgSize: '220%',
    depth: 0.018,
    floatY: 10,
    floatDur: 5.8,
    floatDelay: 0,
    shape: 'portrait', // col 1, rows 1â€“2
  },
  // Tile B â€” small square top-right â€” top-left crop zoomed
  {
    id: 'b',
    gridArea: 'b',
    bgPos: '15% 10%',
    bgSize: '350%',
    depth: 0.03,
    floatY: 7,
    floatDur: 4.6,
    floatDelay: 0.4,
    shape: 'square',
  },
  // Tile C â€” small square â€” top-right crop
  {
    id: 'c',
    gridArea: 'c',
    bgPos: '90% 8%',
    bgSize: '380%',
    depth: 0.025,
    floatY: 9,
    floatDur: 5.2,
    floatDelay: 0.8,
    shape: 'square',
  },
  // Tile D â€” landscape spanning cols 2â€“3 â€” bottom panoramic
  {
    id: 'd',
    gridArea: 'd',
    bgPos: '50% 88%',
    bgSize: '250%',
    depth: 0.02,
    floatY: 6,
    floatDur: 6.4,
    floatDelay: 0.2,
    shape: 'landscape',
  },
  // Tile E â€” wide landscape bottom-left
  {
    id: 'e',
    gridArea: 'e',
    bgPos: '20% 75%',
    bgSize: '280%',
    depth: 0.028,
    floatY: 8,
    floatDur: 5.0,
    floatDelay: 0.6,
    shape: 'landscape',
  },
  // Tile F â€” portrait col 3 bottom â€” right-side crop
  {
    id: 'f',
    gridArea: 'f',
    bgPos: '92% 55%',
    bgSize: '300%',
    depth: 0.022,
    floatY: 11,
    floatDur: 4.8,
    floatDelay: 1.0,
    shape: 'portrait-sm',
  },
];

// â”€â”€â”€ BentoHero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BentoHero({
  image,
  serviceName,
  tagline,
  price,
  duration,
}: {
  image: string;
  serviceName: string;
  tagline: string;
  price: string;
  duration: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // â”€â”€ Entrance animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const tiles = tilesRef.current;
    if (!tiles.length || !titleRef.current) return;

    // Set initial state
    gsap.set(tiles, { opacity: 0, scale: 0.88, y: 40 });
    gsap.set('.bento-text-item', { opacity: 0, y: 28 });

    // Staggered tile entrance
    gsap.to(tiles, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: { amount: 0.5, from: 'random' },
      delay: 0.1,
    });

    // Text entrance
    gsap.to('.bento-text-item', {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.75,
      ease: 'power3.out',
      delay: 0.35,
    });

    // â”€â”€ Floating loop per tile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    tiles.forEach((tile, i) => {
      const t = BENTO_TILES[i];
      if (!t) return;
      gsap.to(tile, {
        y: `+=${t.floatY}`,
        duration: t.floatDur,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: t.floatDelay,
      });
    });
  }, [image]);

  // â”€â”€ Mouse parallax â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const section = gridRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left - rect.width / 2),
        y: (e.clientY - rect.top - rect.height / 2),
      };
    };

    const tick = () => {
      tilesRef.current.forEach((tile, i) => {
        const t = BENTO_TILES[i];
        if (!tile || !t) return;
        const cx = mousePos.current.x * t.depth * -1;
        const cy = mousePos.current.y * t.depth * -1;
        // Apply only translate, not overriding the float y
        tile.style.transform = `translate(${cx}px, ${cy}px)`;
      });
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [image]);

  const setTileRef = (el: HTMLDivElement | null, i: number) => {
    if (el) tilesRef.current[i] = el;
  };

  return (
    <div className="relative w-full min-h-screen pt-16 bg-black overflow-hidden flex flex-col lg:flex-row">

      {/* LEFT text panel */}
      <div className="relative z-10 flex flex-col justify-center px-6 md:px-10 lg:px-14 py-16 lg:py-0 lg:w-[42%] shrink-0">

        {/* Breadcrumb */}
        <div className="bento-text-item mb-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 group"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 group-hover:text-white/70 transition-colors duration-300">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:-translate-x-0.5 transition-transform duration-200">
                <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Services
            </span>
            <span className="text-white/20 text-[11px] font-bold">/</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 truncate max-w-[160px]">
              {serviceName}
            </span>
          </Link>
        </div>

        {/* Title */}
        <div ref={titleRef} className="bento-text-item mb-5">
          <h1 className="text-[clamp(2.8rem,6vw,6.5rem)] font-bold leading-[0.9] tracking-tight text-white">
            {serviceName.split(' ').map((word, wi) => (
              <span key={wi} className="block">{word}</span>
            ))}
          </h1>
        </div>

        {/* Tagline */}
        <p className="bento-text-item text-base md:text-lg font-medium text-white/50 max-w-sm mb-10 leading-relaxed">
          {tagline}
        </p>



        {/* Stats */}
        <div className="bento-text-item flex gap-10 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">Price</span>
            <span className="text-sm font-bold text-white">{price}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">Duration</span>
            <span className="text-sm font-bold text-white">{duration}</span>
          </div>
        </div>
      </div>

      {/* RIGHT bento grid */}
      <div
        ref={gridRef}
        className="relative flex-1 p-4 md:p-6 lg:p-8 flex items-center"
        style={{ minHeight: '600px' }}
      >
        <div
          className="w-full h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.1fr 1fr',
            gridTemplateRows: '1fr 0.75fr 0.85fr',
            gridTemplateAreas: '"a b c" "a d d" "e e f"',
            gap: '10px',
            height: 'min(78vh, 680px)',
          }}
        >
          {BENTO_TILES.map((tile, i) => (
            <div
              key={tile.id}
              ref={(el) => setTileRef(el as HTMLDivElement | null, i)}
              style={{
                gridArea: tile.id,
                backgroundImage: `url(${image})`,
                backgroundPosition: tile.bgPos,
                backgroundSize: tile.bgSize,
                backgroundRepeat: 'no-repeat',
                borderRadius: '24px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                willChange: 'transform',
                transition: 'box-shadow 0.3s ease',
              }}
              className="group relative cursor-pointer"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 20px 60px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 8px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)';
              }}
            >
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundPosition: tile.bgPos,
                  backgroundSize: tile.bgSize,
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '24px',
                }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.25) 100%)',
                  borderRadius: '24px',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// â”€â”€â”€ Scrub Text: word-by-word scroll-tied opacity reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ScrubText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span
            className="scrub-word inline-block"
            style={{ opacity: 0.12, willChange: 'opacity' }}
          >
            {word}
          </span>
          {i < words.length - 1 && '\u00A0'}
        </React.Fragment>
      ))}
    </span>
  );
}

// â”€â”€â”€ Process Step Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProcessCard({
  step,
  title,
  description,
  duration,
  isLast,
}: {
  step: number;
  title: string;
  description: string;
  duration?: string;
  isLast: boolean;
}) {
  return (
    <div className="process-step relative flex gap-6 md:gap-8">
      {/* Left: number + line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold z-10 shrink-0">
          {String(step).padStart(2, '0')}
        </div>
        {!isLast && (
          <div className="process-line w-px flex-1 bg-neutral-200 mt-2 min-h-[60px]" />
        )}
      </div>
      {/* Right: content */}
      <div className="pb-10 md:pb-14 flex-1 pt-2">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl md:text-2xl font-bold leading-tight">{title}</h3>
          {duration && (
            <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-neutral-400 bg-stone-100 rounded-full px-3 py-1">
              {duration}
            </span>
          )}
        </div>
        <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// â”€â”€â”€ FAQ Accordion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 cursor-pointer"
      >
        <span className="text-base font-bold text-black">{q}</span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center transition-transform duration-300 ${open ? 'rotate-45' : ''
            }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ${open ? 'max-h-48 opacity-100 pb-5' : 'max-h-0 opacity-0'
          }`}
      >
        <p className="text-sm md:text-base font-medium text-neutral-600 leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = getServiceBySlug(slug || '');
  const [videoPlay, setVideoPlay] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const playVideo = () => {
    setVideoPlay(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
        '*'
      );
    }
  };

  const pauseVideo = () => {
    setVideoPlay(false);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
        '*'
      );
    }
  };

  const overviewRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [timelineHeight, setTimelineHeight] = useState(0);
  const [timelineStartOffset, setTimelineStartOffset] = useState(0);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const toothRef = useRef<HTMLDivElement>(null);
  const toothInnerRef = useRef<HTMLDivElement>(null);

  // Kill all ScrollTriggers on unmount/service change
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [slug]);

  // Overview section animation â€” word-by-word scrub on description
  useEffect(() => {
    if (!overviewRef.current || !service) return;
    const ctx = gsap.context(() => {
      // Label + title fade-up (instant scroll trigger, no scrub)
      gsap.fromTo(
        '.overview-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: overviewRef.current,
            start: 'top 80%',
          },
        }
      );

      // Word-by-word scrub on the description paragraph
      const words = overviewRef.current!.querySelectorAll('.scrub-word');
      if (words.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.desc-scrub-section',
            start: 'top 65%',
            end: 'bottom 35%',
            scrub: 1,
          },
        });
        words.forEach((word) => {
          tl.fromTo(
            word,
            { opacity: 0.12, color: '#a3a3a3' },
            { opacity: 1, color: '#000000', duration: 0.4, ease: 'none' },
            '<0.04'
          );
        });
      }

      // Benefits staggered reveal
      gsap.fromTo(
        '.benefit-item',
        { opacity: 0, x: 32 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: overviewRef.current,
            start: 'top 50%',
          },
        }
      );
    }, overviewRef);
    return () => ctx.revert();
  }, [slug, service]);

  // Timeline Track Layout Measurement (Start offset & height)
  useEffect(() => {
    if (!timelineContainerRef.current || !service) return;

    const measureTimeline = () => {
      const circles = timelineContainerRef.current!.querySelectorAll('.timeline-circle');
      if (circles.length < 2) return;

      const containerRect = timelineContainerRef.current!.getBoundingClientRect();
      const firstRect = circles[0].getBoundingClientRect();
      const lastRect = circles[circles.length - 1].getBoundingClientRect();

      const startOffset = firstRect.top - containerRect.top + (firstRect.height / 2);
      const endOffset = lastRect.top - containerRect.top + (lastRect.height / 2);

      setTimelineStartOffset(startOffset);
      setTimelineHeight(endOffset - startOffset);
    };

    // Run on initial load, resize
    measureTimeline();
    window.addEventListener('resize', measureTimeline);

    const resizeObserver = new ResizeObserver(() => measureTimeline());
    resizeObserver.observe(timelineContainerRef.current!);

    return () => {
      window.removeEventListener('resize', measureTimeline);
      resizeObserver.disconnect();
    };
  }, [slug, service]);

  // Interactive Timeline GSAP ScrollTrigger + MotionPath + scrub
  useEffect(() => {
    if (!timelineHeight || !timelineContainerRef.current || !service) return;

    const ctx = gsap.context(() => {
      // 1. Move tooth along the dynamic vertical path using MotionPathPlugin
      gsap.to(toothRef.current, {
        motionPath: {
          path: pathRef.current!,
          align: pathRef.current!,
          alignOrigin: [0.5, 0.5],
        },
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainerRef.current,
          start: `top+=${timelineStartOffset}px 45%`,
          end: `top+=${timelineStartOffset + timelineHeight}px 45%`,
          scrub: 0.5,
        },
      });

      // 2. Animate progress path strokeDashoffset to fill it behind the tooth
      gsap.fromTo(
        progressPathRef.current,
        { strokeDashoffset: timelineHeight },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineContainerRef.current,
            start: `top+=${timelineStartOffset}px 45%`,
            end: `top+=${timelineStartOffset + timelineHeight}px 45%`,
            scrub: 0.5,
          },
        }
      );

      // 3. For each step item, trigger active state as the tooth passes
      const stepItems = timelineContainerRef.current!.querySelectorAll('.timeline-step-item');
      stepItems.forEach((stepEl) => {
        const content = stepEl.querySelector('.timeline-content');
        const title = stepEl.querySelector('.timeline-title');
        const desc = stepEl.querySelector('.timeline-desc');
        const circle = stepEl.querySelector('.timeline-circle');
        const circleInner = stepEl.querySelector('.timeline-circle-inner');
        const durationPill = stepEl.querySelector('.timeline-duration-pill');

        const stepTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stepEl,
            start: 'top 55%',
            end: 'bottom 45%',
            toggleActions: 'play reverse play reverse',
          },
        });

        stepTimeline
          .to(content, { opacity: 1, duration: 0.35 }, 0)
          .to(title, { color: '#000000', duration: 0.35 }, 0)
          .to(desc, { color: '#404040', duration: 0.35 }, 0)
          .to(circle, { borderColor: '#000000', scale: 1.15, duration: 0.3 }, 0)
          .to(circleInner, { backgroundColor: '#000000', scale: 1.15, duration: 0.3 }, 0)
          .to(durationPill, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 0.05);

        // Circle pulse animation while active
        gsap.fromTo(
          circle,
          { boxShadow: '0 0 0 0px rgba(0, 0, 0, 0.15)' },
          {
            boxShadow: '0 0 0 8px rgba(0, 0, 0, 0)',
            repeat: -1,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepEl,
              start: 'top 55%',
              end: 'bottom 45%',
              toggleActions: 'play pause resume reset',
            },
          }
        );
      });

      // 4. Subtle continuous floating and slight rotation for the tooth
      gsap.to(toothInnerRef.current, {
        y: '+=5',
        rotation: 6,
        duration: 2.0,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

    }, timelineContainerRef);

    return () => ctx.revert();
  }, [timelineHeight, timelineStartOffset, slug, service]);

  // Video section animation
  useEffect(() => {
    if (!videoRef.current || !service) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.video-wrapper',
        { opacity: 0, scale: 0.92, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: videoRef.current,
            start: 'top 70%',
          },
        }
      );
      gsap.fromTo(
        '.video-label',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: videoRef.current,
            start: 'top 75%',
          },
        }
      );
    }, videoRef);
    return () => ctx.revert();
  }, [slug, service]);

  // Gallery parallax
  useEffect(() => {
    if (!galleryRef.current || !service) return;
    const ctx = gsap.context(() => {
      const images = galleryRef.current!.querySelectorAll('.parallax-img');
      images.forEach((img, i) => {
        gsap.fromTo(
          img,
          { y: 0, opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: img,
              start: 'top 80%',
            },
            delay: i * 0.12,
          }
        );
        gsap.to(img, {
          y: i % 2 === 0 ? -40 : 40,
          ease: 'none',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });
    }, galleryRef);
    return () => ctx.revert();
  }, [slug, service]);

  // CTA section
  useEffect(() => {
    if (!ctaRef.current || !service) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-inner',
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
          },
        }
      );
    }, ctaRef);
    return () => ctx.revert();
  }, [slug, service]);

  // FAQ animation
  useEffect(() => {
    if (!service) return;
    gsap.fromTo(
      '.faq-item',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.faq-section',
          start: 'top 75%',
        },
      }
    );
  }, [slug, service]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black pt-20">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
          404
        </p>
        <h1 className="text-5xl font-bold mb-6">Service Not Found</h1>
        <p className="text-neutral-500 mb-8">
          The service you're looking for doesn't exist.
        </p>
        <Link
          to="/services"
          className="px-8 py-4 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors"
        >
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen">
      {/* ─── BENTO HERO ────────────────────────────────────────────────────────────────── */}
      <BentoHero
        image={service.heroImage}
        serviceName={service.name}
        tagline={service.tagline}
        price={service.price}
        duration={service.duration}
      />

      {/* ─── OVERVIEW ──────────────────────────────────────────────────────────────────── */}
      <section ref={overviewRef} className="px-4 md:px-6 py-16 md:py-24 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="desc-scrub-section">
            <p className="overview-item text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
              About This Service
            </p>
            <h2 className="overview-item text-3xl md:text-5xl font-bold leading-tight mb-8">
              {service.name}
            </h2>
            {/* Word-by-word scrub description */}
            <div className="text-base md:text-lg font-medium leading-relaxed" style={{ lineHeight: '1.75' }}>
              <ScrubText text={service.longDescription} />
            </div>
          </div>
          <div className="benefits-section">
            <p className="overview-item text-xs font-bold uppercase tracking-widest text-neutral-400 mb-5">
              Key Benefits
            </p>
            <div className="flex flex-col gap-3">
              {service.benefits.map((b, i) => (
                <div
                  key={i}
                  className="benefit-item flex items-start gap-3 bg-stone-50 rounded-xl p-4"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm md:text-base font-semibold text-black">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS STEPS ────────────────────────────────────────────────────── */}
      <section id="process" ref={processRef} className="px-4 md:px-6 py-16 md:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
              The Process
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-xl">
              How {service.name} Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Interactive Timeline Container */}
            <div ref={timelineContainerRef} className="relative">

              {/* Dynamic SVG timeline track */}
              {timelineHeight > 0 && (
                <svg
                  className="absolute left-6 md:left-[36px] w-12 pointer-events-none overflow-visible z-10"
                  style={{
                    top: `${timelineStartOffset}px`,
                    height: `${timelineHeight}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  {/* Background Track Line */}
                  <path
                    d={`M 24,0 L 24,${timelineHeight}`}
                    fill="none"
                    stroke="#e5e5e5"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Active fill line */}
                  <path
                    ref={progressPathRef}
                    d={`M 24,0 L 24,${timelineHeight}`}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={timelineHeight}
                    strokeDashoffset={timelineHeight}
                  />

                  {/* Motion path invisible line */}
                  <path
                    ref={pathRef}
                    d={`M 24,0 L 24,${timelineHeight}`}
                    fill="none"
                    stroke="transparent"
                  />
                </svg>
              )}

              {/* Tooth SVG following the timeline path */}
              {timelineHeight > 0 && (
                <div
                  ref={toothRef}
                  className="absolute left-6 md:left-[36px] w-12 h-12 z-30 pointer-events-none flex items-center justify-center bg-white border-2 border-neutral-200 rounded-full shadow-md"
                  style={{
                    top: `${timelineStartOffset}px`,
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform',
                  }}
                >
                  <div ref={toothInnerRef} className="flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-black"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M12 2C8.5 2 6 4.5 6 8C6 11.5 8 13.5 8 17C8 19 9.5 21 12 21C14.5 21 16 19 16 17C16 13.5 18 11.5 18 8C18 4.5 15.5 2 12 2Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8C12 8 11 11 9 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8C12 8 13 11 15 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Steps List */}
              <div className="relative z-20 flex flex-col">
                {service.processSteps.map((step) => (
                  <div
                    key={step.step}
                    className="timeline-step-item relative pl-16 md:pl-24 pb-16 last:pb-8 flex flex-col items-start"
                  >
                    {/* Milestone indicator circle */}
                    <div
                      className="timeline-circle absolute left-6 md:left-[36px] -translate-x-1/2 top-2.5 w-5 h-5 rounded-full bg-white border-2 border-neutral-300 z-20 flex items-center justify-center transition-all duration-300"
                    >
                      <div className="timeline-circle-inner w-2 h-2 rounded-full bg-neutral-300 transition-all duration-300" />
                    </div>

                    {/* Content Block */}
                    <div className="timeline-content opacity-25 transition-opacity duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Step {String(step.step).padStart(2, '0')}
                        </span>
                        {step.duration && (
                          <span className="timeline-duration-pill opacity-0 -translate-x-3 inline-block bg-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full transition-all duration-500">
                            {step.duration}
                          </span>
                        )}
                      </div>
                      <h3 className="timeline-title text-xl md:text-2xl font-bold mb-3 text-neutral-400 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="timeline-desc text-sm md:text-base text-neutral-400 font-medium leading-relaxed max-w-lg transition-colors duration-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right: sticky summary card */}
            <div className="hidden md:block">
              <div className="sticky top-28">
                <div className="bg-black rounded-2xl p-8 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
                    Quick Summary
                  </p>
                  <h3 className="text-2xl font-bold mb-6 leading-tight">
                    {service.processSteps.length} Steps to a Healthier Smile
                  </h3>
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-sm font-medium text-neutral-400">Starting Price</span>
                      <span className="text-sm font-bold text-white">
                        ₹{service.priceRange.min.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-sm font-medium text-neutral-400">Duration</span>
                      <span className="text-sm font-bold text-white">{service.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-neutral-400">Category</span>
                      <span className="text-sm font-bold text-white">{service.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/appointment')}
                    className="w-full py-4 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-100 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ VIDEO SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section ref={videoRef} className="px-4 md:px-6 py-16 md:py-24 border-b border-neutral-100 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="video-label text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                See It in Action
              </p>
              <h2 className="video-label text-3xl md:text-4xl font-bold leading-tight">
                Watch the Procedure
              </h2>
            </div>
            <p className="video-label text-sm font-medium text-neutral-500 max-w-xs text-right">
              Educational video showing the {service.name.toLowerCase()} process step by step.
            </p>
          </div>
          <div
            className="video-wrapper relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl"
            style={{ paddingBottom: '56.25%', cursor: 'none' }}
          >
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${service.videoId}?enablejsapi=1&rel=0&modestbranding=1&color=white`}
              title={`${service.name} Procedure Video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 pointer-events-none transition-all duration-300 opacity-100"
              style={{ cursor: 'none' }}
              loading="lazy"
            />
            {/* Transparent hover/click overlay when video is playing */}
            {videoPlay && (
              <div
                onClick={pauseVideo}
                data-cursor="pause"
                className="absolute inset-0 z-20 cursor-pointer"
                style={{ cursor: 'none' }}
              />
            )}
            {/* Transparent cursor-none overlay always present to hide default cursor */}
            <div className="absolute inset-0 z-30 pointer-events-none" style={{ cursor: 'none' }} />
            {!videoPlay && (
              <div
                onClick={playVideo}
                className="absolute inset-0 bg-stone-950/45 backdrop-blur-[1px] flex items-center justify-center group/video transition-all duration-300 z-20"
                style={{ cursor: 'none' }}
              >
                {/* Awwwards-inspired play button */}
                <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-transform duration-500 group-hover/video:scale-110">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ GALLERY + PARALLAX â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section ref={galleryRef} className="px-4 md:px-6 py-16 md:py-24 bg-stone-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Gallery
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-10">
            See the Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="parallax-img relative rounded-2xl overflow-hidden h-[280px] md:h-[420px]">
              <img
                src={service.heroImage}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
            {service.galleryImages[0] && (
              <div className="parallax-img relative rounded-2xl overflow-hidden h-[280px] md:h-[420px]">
                <img
                  src={service.galleryImages[0]}
                  alt={`${service.name} gallery`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          {service.galleryImages[1] && (
            <div className="mt-4 md:mt-6">
              <div className="parallax-img relative rounded-2xl overflow-hidden h-[220px] md:h-[300px]">
                <img
                  src={service.galleryImages[1]}
                  alt={`${service.name} gallery 2`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* â”€â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="faq-section px-4 md:px-6 py-16 md:py-24 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Common Questions
            </h2>
          </div>
          <div>
            {service.faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section ref={ctaRef} className="px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="cta-inner bg-black rounded-2xl md:rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                Ready to Begin?
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
                Book Your {service.name} <br className="hidden md:block" />Appointment Today
              </h2>
              <p className="text-neutral-400 text-sm md:text-base font-medium max-w-md">
                Starting from {service.price}. Our experts will guide you through every step of the process.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <MagneticButton
                onClick={() => navigate('/appointment')}
              >
                Book Appointment
              </MagneticButton>
              <Link
                to="/contact"
                className="group relative px-10 py-4 bg-white/10 rounded-full text-white text-sm md:text-base font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 text-center whitespace-nowrap overflow-hidden inline-flex items-center justify-center min-w-[210px]"
              >
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-[150%]">
                  Ask a Question
                </span>
                <span className="absolute inline-block transition-transform duration-300 translate-y-[150%] group-hover:translate-y-0 text-white">
                  Get Answers
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ RELATED SERVICES NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 md:px-6 pb-16 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto pt-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/services"
              className="flex items-center gap-2 text-sm font-bold text-black hover:text-neutral-500 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 4L6 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All Services
            </Link>
            <button
              onClick={() => navigate('/appointment')}
              className="px-6 py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
