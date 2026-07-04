import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  general?: string;
}
const EMPTY: FormData = { name: '', email: '', phone: '', message: '' };

/* ─────────────────────────────────────────────────────────────────────────────
   TOOTH PIN SVG (monochrome, animated)
───────────────────────────────────────────────────────────────────────────── */
function ToothPin() {
  return (
    <svg
      width="40"
      height="52"
      viewBox="0 0 40 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))' }}
    >
      {/* Pin body */}
      <path
        d="M20 0C8.954 0 0 8.954 0 20c0 14 20 32 20 32S40 34 40 20C40 8.954 31.046 0 20 0z"
        fill="#111111"
      />
      {/* Tooth icon inside pin */}
      <g transform="translate(8, 6)">
        <path
          d="M12 2.5c-1.3 0-2.6.5-3.5 1.2C7.6 3 6.3 2.5 5 2.5 2.5 2.5 0.5 4.5 0.5 7c0 1.2.2 3.4.9 5.1.6 1.5 1.7 2.6 3.1 3.2.5.2 1 .3 1.6.3.4 0 .8-.3.9-.7l.5-2.4c.1-.4.5-.7.9-.7h.2c.4 0 .8.3.9.7l.5 2.4c.1.4.5.7.9.7.6 0 1.1-.1 1.6-.3 1.4-.6 2.5-1.7 3.1-3.2.7-1.7.9-3.9.9-5.1 0-2.5-2-4.5-4.5-4.5z"
          fill="white"
          opacity="0.95"
        />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   INTERACTIVE MAP (monochrome SVG map with animated pin & route)
───────────────────────────────────────────────────────────────────────────── */
function InteractiveMap({ onGetDirections }: { onGetDirections: () => void }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const ripple1Ref = useRef<HTMLDivElement>(null);
  const ripple2Ref = useRef<HTMLDivElement>(null);
  const ripple3Ref = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const [routeDrawn, setRouteDrawn] = useState(false);

  useEffect(() => {
    const pin = pinRef.current;
    const r1 = ripple1Ref.current;
    const r2 = ripple2Ref.current;
    const r3 = ripple3Ref.current;
    if (!pin || !r1 || !r2 || !r3) return;

    gsap.set(pin, { y: -130, opacity: 0, scale: 0.75 });
    gsap.set([r1, r2, r3], { scale: 0, opacity: 0 });

    const dropTl = gsap.timeline({
      delay: 0.7,
      onComplete: () => {
        gsap.to(pin, {
          y: -8,
          duration: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      },
    });

    dropTl
      .to(pin, { opacity: 1, duration: 0.25 })
      .to(pin, { y: 0, scale: 1, duration: 0.65, ease: 'bounce.out' })
      .to(r1, { scale: 2.2, opacity: 0.5, duration: 0.4, ease: 'power2.out' }, '-=0.05')
      .to(r1, { opacity: 0, duration: 0.45, ease: 'power2.out' }, '-=0.1')
      .to(r2, { scale: 2.8, opacity: 0.3, duration: 0.55, ease: 'power2.out' }, '-=0.45')
      .to(r2, { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .to(r3, { scale: 3.4, opacity: 0.18, duration: 0.65, ease: 'power2.out' }, '-=0.5')
      .to(r3, { opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

    return () => { dropTl.kill(); };
  }, []);

  useEffect(() => {
    const path = routeRef.current;
    if (!path || !routeDrawn) return;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
    gsap.to(path, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' });
  }, [routeDrawn]);

  const handleGetDirections = () => {
    setRouteDrawn(true);
    onGetDirections();
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Monochrome SVG city map */}
      <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full">
        {/* Sky */}
        <rect width="800" height="500" fill="#f2f2f2" />
        {/* City blocks */}
        <g fill="#e4e4e4" stroke="#d2d2d2" strokeWidth="0.8">
          <rect x="0" y="0" width="145" height="95" rx="2" />
          <rect x="155" y="0" width="125" height="95" rx="2" />
          <rect x="290" y="0" width="115" height="95" rx="2" />
          <rect x="415" y="0" width="145" height="95" rx="2" />
          <rect x="570" y="0" width="115" height="95" rx="2" />
          <rect x="695" y="0" width="105" height="95" rx="2" />

          <rect x="0" y="105" width="115" height="85" rx="2" />
          <rect x="125" y="105" width="155" height="85" rx="2" />
          <rect x="290" y="105" width="95" height="85" rx="2" />
          <rect x="395" y="105" width="165" height="85" rx="2" />
          <rect x="570" y="105" width="135" height="85" rx="2" />
          <rect x="715" y="105" width="85" height="85" rx="2" />

          <rect x="0" y="200" width="135" height="105" rx="2" />
          <rect x="145" y="200" width="135" height="105" rx="2" />
          <rect x="290" y="200" width="125" height="105" rx="2" />
          <rect x="425" y="200" width="135" height="105" rx="2" />
          <rect x="570" y="200" width="105" height="105" rx="2" />
          <rect x="685" y="200" width="115" height="105" rx="2" />

          <rect x="0" y="315" width="155" height="85" rx="2" />
          <rect x="165" y="315" width="115" height="85" rx="2" />
          <rect x="290" y="315" width="145" height="85" rx="2" />
          <rect x="445" y="315" width="115" height="85" rx="2" />
          <rect x="570" y="315" width="125" height="85" rx="2" />
          <rect x="705" y="315" width="95" height="85" rx="2" />

          <rect x="0" y="410" width="175" height="90" rx="2" />
          <rect x="185" y="410" width="95" height="90" rx="2" />
          <rect x="290" y="410" width="155" height="90" rx="2" />
          <rect x="455" y="410" width="105" height="90" rx="2" />
          <rect x="570" y="410" width="230" height="90" rx="2" />
        </g>

        {/* Roads (white) */}
        <g fill="white">
          <rect x="0" y="95" width="800" height="10" />
          <rect x="0" y="190" width="800" height="10" />
          <rect x="0" y="305" width="800" height="10" />
          <rect x="0" y="400" width="800" height="10" />
          <rect x="145" y="0" width="10" height="500" />
          <rect x="280" y="0" width="10" height="500" />
          <rect x="415" y="0" width="10" height="500" />
          <rect x="560" y="0" width="10" height="500" />
          <rect x="685" y="0" width="10" height="500" />
        </g>

        {/* Main roads (slightly wider/lighter) */}
        <rect x="0" y="188" width="800" height="14" fill="#eaeaea" />
        <rect x="278" y="0" width="14" height="500" fill="#eaeaea" />

        {/* Park */}
        <ellipse cx="628" cy="255" rx="65" ry="45" fill="#d4d4d4" />
        <text x="628" y="259" textAnchor="middle" fontSize="8" fill="#aaa" fontFamily="sans-serif" fontWeight="600">CITY PARK</text>

        {/* Water */}
        <rect x="0" y="340" width="75" height="50" rx="6" fill="rgba(180,180,200,0.35)" />

        {/* Route path (animated dashes) */}
        <path
          ref={routeRef}
          d="M 90 440 L 90 195 L 285 195 L 285 255"
          stroke="#111"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5 7"
          fill="none"
          opacity={routeDrawn ? 1 : 0}
        />

        {/* Route start marker */}
        {routeDrawn && (
          <circle cx="90" cy="440" r="5" fill="#111" opacity="0.7" />
        )}

        {/* Street labels */}
        <text x="295" y="285" fontSize="8" fill="#666" fontFamily="sans-serif" fontWeight="600">Main St</text>
        <text x="148" y="188" fontSize="7.5" fill="#888" fontFamily="sans-serif" transform="rotate(-90, 148, 188)">Park Ave N</text>
      </svg>

      {/* Map gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(242,242,242,0.35) 100%)' }}
      />

      {/* Tooth Pin */}
      <div
        ref={pinRef}
        className="absolute z-10"
        style={{
          left: 'calc(50% - 8px)',
          top: '50%',
          transform: 'translateX(-50%) translateY(-100%)',
          transformOrigin: 'bottom center',
          willChange: 'transform, opacity',
        }}
      >
        <ToothPin />
        {/* Ripple rings anchored at pin base */}
        {[ripple1Ref, ripple2Ref, ripple3Ref].map((ref, i) => (
          <div
            key={i}
            ref={ref}
            className="absolute rounded-full"
            style={{
              width: 20, height: 20,
              bottom: 3,
              left: '50%',
              transform: 'translate(-50%, 50%) scale(0)',
              background: 'rgba(0,0,0,0.15)',
              transformOrigin: 'center center',
            }}
          />
        ))}
      </div>

      {/* Get Directions CTA */}
      <button
        onClick={handleGetDirections}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 group"
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        <div className="relative overflow-hidden flex items-center gap-2.5 bg-black text-white px-6 py-3 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
          <span className="relative z-10">{routeDrawn ? '✓ Route Drawn' : 'Get Directions'}</span>
          <span className={`relative z-10 transition-transform duration-300 ${routeDrawn ? '' : 'group-hover:translate-x-1'}`}>
            {routeDrawn ? (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="9,1 9,9 1,9" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 5.5h9m0 0L6 2m4 3.5L6 9" />
              </svg>
            )}
          </span>
          {/* Shimmer sweep */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FLOATING LABEL FIELD
───────────────────────────────────────────────────────────────────────────── */
interface FieldChildProps {
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

function FloatingField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactElement<FieldChildProps>;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isFloating = focused || hasValue;

  const onFocus = () => {
    setFocused(true);
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.35, ease: 'power3.out' });
    gsap.to(wrapRef.current, { borderColor: 'rgba(0,0,0,0.35)', duration: 0.25 });
  };
  const onBlur = () => {
    setFocused(false);
    if (!hasValue) gsap.to(lineRef.current, { scaleX: 0, duration: 0.3, ease: 'power3.in' });
    gsap.to(wrapRef.current, { borderColor: 'rgba(0,0,0,0.12)', duration: 0.25 });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
    (children.props as FieldChildProps).onChange?.(e);
  };

  const onMouseEnter = () => gsap.to(wrapRef.current, { backgroundColor: 'rgba(0,0,0,0.018)', duration: 0.2 });
  const onMouseLeave = () => {
    if (!focused) gsap.to(wrapRef.current, { backgroundColor: 'transparent', duration: 0.2 });
  };

  return (
    <div className="contact-field" style={{ opacity: 0, transform: 'translateY(18px)' }}>
      <div
        ref={wrapRef}
        className="relative border rounded-xl px-4 pt-6 pb-3"
        style={{ borderColor: error ? 'rgba(239,68,68,0.5)' : 'rgba(0,0,0,0.12)', transition: 'background 0.2s, border-color 0.25s' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <label
          className="absolute left-4 pointer-events-none font-medium"
          style={{
            top: isFloating ? '8px' : '50%',
            transform: isFloating ? 'translateY(0) scale(0.7)' : 'translateY(-50%) scale(1)',
            transformOrigin: 'left center',
            fontSize: '13px',
            color: error ? '#ef4444' : focused ? '#111' : '#aaa',
            letterSpacing: isFloating ? '0.09em' : '0',
            textTransform: isFloating ? 'uppercase' : 'none',
            transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 2,
          }}
        >
          {label}
        </label>
        {React.cloneElement(children as React.ReactElement<FieldChildProps>, {
          onFocus, onBlur, onChange,
          className: 'w-full bg-transparent text-sm font-medium text-black outline-none resize-none pt-1',
          style: { position: 'relative', zIndex: 1 },
        })}
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
          style={{ background: error ? '#ef4444' : '#111', transform: 'scaleX(0)', transformOrigin: 'left center' }}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAGNETIC CTA BUTTON
───────────────────────────────────────────────────────────────────────────── */
function MagneticCTA({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'dark',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'dark' | 'light';
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const isDark = variant === 'dark';

  useEffect(() => {
    const wrap = wrapRef.current;
    const btn = btnRef.current;
    if (!wrap || !btn) return;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.4, ease: 'power3.out' });
    };
    const onEnter = () => {
      gsap.to(btn, { scale: 1.04, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(shimmerRef.current, { x: '-110%' }, { x: '110%', duration: 0.65, ease: 'power2.inOut' });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    };

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="inline-block p-3 -m-3">
      <button
        ref={btnRef}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`relative overflow-hidden w-full flex items-center justify-center gap-2 px-10 py-4 rounded-full text-sm font-bold tracking-wide ${isDark ? 'bg-black text-white' : 'bg-white text-black border border-black/15'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        style={{ willChange: 'transform', boxShadow: isDark ? '0 6px 28px rgba(0,0,0,0.2)' : '0 2px 14px rgba(0,0,0,0.08)' }}
      >
        <div
          ref={shimmerRef}
          className="absolute inset-y-0 -skew-x-12 pointer-events-none"
          style={{
            width: '45%',
            background: isDark ? 'linear-gradient(90deg,transparent,rgba(255,255,255,0.11),transparent)' : 'linear-gradient(90deg,transparent,rgba(0,0,0,0.055),transparent)',
            transform: 'translateX(-110%)',
          }}
        />
        <span className="relative z-10">{children}</span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT DETAIL (animated hover)
───────────────────────────────────────────────────────────────────────────── */
function ContactDetail({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onEnter = () => gsap.to(ref.current, { x: 5, duration: 0.3, ease: 'power2.out' });
  const onLeave = () => gsap.to(ref.current, { x: 0, duration: 0.45, ease: 'elastic.out(1,0.5)' });

  const inner = (
    <div ref={ref} className="flex items-start gap-3.5" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="w-9 h-9 rounded-xl bg-black/7 flex items-center justify-center shrink-0 text-black/70">{icon}</div>
      <div>
        <p className="text-[9.5px] font-bold uppercase tracking-[0.17em] text-neutral-400 mb-0.5">{label}</p>
        <p className="text-[13px] font-semibold text-black/85 whitespace-pre-line leading-relaxed">{value}</p>
      </div>
    </div>
  );

  return href ? <a href={href} className="block">{inner}</a> : <div>{inner}</div>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const glassCardRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const formTitleRef = useRef<HTMLDivElement>(null);
  const emergencyRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);

  const [parallaxY, setParallaxY] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setParallaxY(window.scrollY * 0.07));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow blur-to-sharp reveal
      gsap.fromTo(eyebrowRef.current,
        { opacity: 0, y: 20, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out', delay: 0.1 }
      );

      // Heading: word-by-word stagger
      const hEl = headingRef.current;
      if (hEl) {
        const rawLines = (hEl.dataset.text || '').split('\\n');
        hEl.innerHTML = '';
        rawLines.forEach((line: string, li: number) => {
          const lineDiv = document.createElement('div');
          lineDiv.style.overflow = 'hidden';
          line.trim().split(' ').forEach((word: string, wi: number, arr: string[]) => {
            const span = document.createElement('span');
            span.textContent = word + (wi < arr.length - 1 ? '\u00a0' : '');
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(105%)';
            lineDiv.appendChild(span);
          });
          hEl.appendChild(lineDiv);
          if (li < rawLines.length - 1) hEl.appendChild(document.createElement('br'));
        });
        gsap.to(hEl.querySelectorAll('span'), {
          opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.07, delay: 0.3,
        });
      }

      // Sub-text
      gsap.fromTo(subRef.current,
        { opacity: 0, filter: 'blur(10px)', y: 14 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, ease: 'power3.out', delay: 0.65 }
      );

      // Map section reveal
      ScrollTrigger.create({
        trigger: mapSectionRef.current,
        start: 'top 82%',
        onEnter: () => {
          gsap.fromTo(mapSectionRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          );
          gsap.fromTo(glassCardRef.current,
            { opacity: 0, x: -30, filter: 'blur(10px)' },
            { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, delay: 0.3, ease: 'power3.out' }
          );
        },
        once: true,
      });

      // Form fields reveal
      ScrollTrigger.create({
        trigger: formSectionRef.current,
        start: 'top 78%',
        onEnter: () => {
          gsap.fromTo(formTitleRef.current,
            { opacity: 0, y: 22, filter: 'blur(6px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' }
          );
          gsap.to(document.querySelectorAll('.contact-field'), {
            opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.1, delay: 0.2,
          });
        },
        once: true,
      });

      // Emergency card
      ScrollTrigger.create({
        trigger: emergencyRef.current,
        start: 'top 88%',
        onEnter: () => {
          gsap.fromTo(emergencyRef.current,
            { opacity: 0, scale: 0.94, y: 22 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' }
          );
        },
        once: true,
      });

      // Hours card
      ScrollTrigger.create({
        trigger: hoursRef.current,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(hoursRef.current,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 }
          );
        },
        once: true,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const update = (field: keyof FormData, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (form.phone && !/^\+?[\d\s\-().]{7,20}$/.test(form.phone)) errs.phone = 'Please enter a valid phone number.';
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else if (data.errors) setErrors(data.errors);
      else setErrors({ general: data.message || 'Something went wrong.' });
    } catch {
      setErrors({ general: 'Unable to connect to server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = useCallback(() => {
    window.open('https://maps.google.com/?q=Suryakiran+Sector+5+Ghansoli+Navi+Mumbai', '_blank');
  }, []);

  return (
    <>
      <style>{`
        .contact-glass {
          background: rgba(255,255,255,0.74);
          backdrop-filter: blur(24px) saturate(170%);
          -webkit-backdrop-filter: blur(24px) saturate(170%);
          border: 1px solid rgba(255,255,255,0.92);
          box-shadow: 0 8px 48px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .contact-map-frame {
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 24px 64px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.05);
        }
        .contact-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 40%, transparent);
        }
        .contact-emergency {
          background: linear-gradient(135deg, #111 0%, #181818 55%, #0c0c0c 100%);
          position: relative;
          overflow: hidden;
        }
        .contact-emergency::after {
          content: '';
          position: absolute;
          top: -30%;
          right: -15%;
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }
        .contact-field { opacity: 0; transform: translateY(18px); }
        @keyframes contact-float-dot {
          0%,100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
        .contact-now-dot { animation: contact-float-dot 2.8s ease-in-out infinite; }
      `}</style>

      <div ref={pageRef} className="bg-white text-black min-h-screen pt-24 pb-28 overflow-x-hidden">
        <div className="relative max-w-[1180px] mx-auto px-5 md:px-8 z-10">

          {/* ── HERO HEADER ─── */}
          <div className="mb-16" style={{ transform: `translateY(${-parallaxY * 0.14}px)`, willChange: 'transform' }}>
            <div ref={eyebrowRef} className="flex items-center gap-3 mb-5" style={{ opacity: 0 }}>
              <div className="w-6 h-px bg-black/25" />
              <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-neutral-400">Get in Touch</span>
              <div className="w-6 h-px bg-black/25" />
            </div>

            <h1
              ref={headingRef}
              data-text="Contact Us"
              className="text-[clamp(3.6rem,10.5vw,9rem)] font-bold leading-[0.88] tracking-[-0.03em] mb-6"
            >
              Contact<br />Us
            </h1>

            <p ref={subRef} className="text-neutral-400 text-base font-medium max-w-[400px] leading-relaxed" style={{ opacity: 0 }}>
              We're here for your smile. Reach out — we respond within 24 hours.
            </p>
          </div>

          <div className="contact-divider mb-14" />

          {/* ── MAP + GLASS CARD ─── */}
          <div
            ref={mapSectionRef}
            className="relative mb-16 rounded-2xl overflow-hidden shadow-lg border border-neutral-100"
            style={{ opacity: 0 }}
          >
            <div className="contact-map-frame relative w-full overflow-hidden" style={{ height: 'clamp(320px, 48vw, 500px)' }}>
              <iframe
                src="https://maps.google.com/maps?q=Suryakiran%20Sector%205%20Ghansoli%20Navi%20Mumbai&t=&z=16&ie=UTF8&iwloc=&output=embed"
                title="Dental Health Shop in Ghansoli Map"
                className="w-full h-full border-0 pointer-events-auto"
                style={{
                  filter: 'grayscale(100%) invert(0%) contrast(1.2) brightness(0.95)',
                }}
                loading="lazy"
              />
            </div>

            {/* Glassmorphism card overlapping map */}
            <div
              ref={glassCardRef}
              className="contact-glass absolute top-6 left-6 md:top-8 md:left-8 rounded-2xl p-5 md:p-6 z-20"
              style={{ maxWidth: '290px', opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-2.5 h-2.5">
                  <div className="absolute inset-0 rounded-full bg-black/60 contact-now-dot" />
                  <div className="absolute inset-[2px] rounded-full bg-black" />
                </div>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-neutral-500">Now Open</span>
              </div>
              <h2 className="text-[15px] font-bold tracking-tight mb-4 text-black">DentalHealth Shop</h2>
              <div className="space-y-3.5">
                <ContactDetail icon={<LocationIcon />} label="Address" value={"Suryakiran, Sector 5\nGhansoli, Navi Mumbai 400701"} />
                <div className="contact-divider" />
                <ContactDetail icon={<PhoneIcon />} label="Phone" value="+91 22 2778 0190" href="tel:+912227780190" />
                <div className="contact-divider" />
                <ContactDetail icon={<MailIcon />} label="Email" value="ghansoli@dentalhealth.com" href="mailto:ghansoli@dentalhealth.com" />
                <div className="contact-divider" />
                <ContactDetail icon={<ClockIcon />} label="Hours" value={"Mon–Fri: 9 AM – 6 PM\nSat: 9 AM – 3 PM · Sun: Closed"} />
              </div>
            </div>
          </div>

          {/* ── FORM + SIDEBAR ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

            {/* Form */}
            <div ref={formSectionRef}>
              {submitted ? (
                <SuccessState name={form.name} email={form.email} onReset={() => { setForm(EMPTY); setSubmitted(false); }} />
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 p-7 md:p-9 shadow-sm">
                  <div ref={formTitleRef} className="mb-7" style={{ opacity: 0 }}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400 mb-2">Send a Message</p>
                    <h2 className="text-2xl font-bold tracking-tight">Let's talk about your smile</h2>
                  </div>

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block shrink-0" />
                      {errors.general}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FloatingField label="Full Name *" error={errors.name}>
                      <input type="text" value={form.name} onChange={e => update('name', e.target.value)} autoComplete="name" />
                    </FloatingField>
                    <FloatingField label="Email Address *" error={errors.email}>
                      <input type="email" value={form.email} onChange={e => update('email', e.target.value)} autoComplete="email" />
                    </FloatingField>
                  </div>
                  <div className="mb-4">
                    <FloatingField label="Phone Number (optional)" error={errors.phone}>
                      <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} autoComplete="tel" />
                    </FloatingField>
                  </div>
                  <div className="mb-7">
                    <FloatingField label="Your Message *" error={errors.message}>
                      <textarea value={form.message} onChange={e => update('message', e.target.value)} rows={5} />
                    </FloatingField>
                  </div>

                  <MagneticCTA type="submit" disabled={loading} variant="dark">
                    {loading ? (
                      <span className="flex items-center gap-2"><LoadingSpinner /> Sending…</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Message
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 6.5h11m0 0L8 2m4 4.5L8 11" />
                        </svg>
                      </span>
                    )}
                  </MagneticCTA>
                </form>
              )}
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-5">
              {/* Emergency */}
              <div ref={emergencyRef} className="contact-emergency rounded-2xl p-7 text-white" style={{ opacity: 0 }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">Emergency Care</p>
                </div>
                <h2 className="text-[1.25rem] font-bold mb-3 leading-snug">Dental Emergency?</h2>
                <p className="text-white/50 text-sm font-medium leading-relaxed mb-6">
                  Don't wait. We keep slots reserved for urgent dental care every single day.
                </p>
                <MagneticCTA variant="light" onClick={() => window.location.href = 'tel:+12015550190'}>
                  <span className="flex items-center gap-2 text-black font-bold">
                    <PhoneIcon size={13} /> Call Now — (201) 555-0190
                  </span>
                </MagneticCTA>
              </div>

              {/* Hours */}
              <div ref={hoursRef} className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6" style={{ opacity: 0 }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400 mb-4">Clinic Hours</p>
                <div className="space-y-2.5">
                  {[
                    { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM', open: true },
                    { day: 'Saturday', hours: '9:00 AM – 3:00 PM', open: true },
                    { day: 'Sunday', hours: 'Closed', open: false },
                  ].map(row => (
                    <div key={row.day} className="flex justify-between items-center">
                      <span className="text-[13px] text-neutral-500 font-medium">{row.day}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${row.open ? 'bg-black/6 text-black' : 'bg-neutral-100 text-neutral-400'}`}>
                        {row.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUCCESS STATE
───────────────────────────────────────────────────────────────────────────── */
function SuccessState({ name, email, onReset }: { name: string; email: string; onReset: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, scale: 0.96, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'back.out(1.4)' });
    gsap.fromTo(checkRef.current, { scale: 0, rotation: -45 }, { scale: 1, rotation: 0, duration: 0.55, delay: 0.3, ease: 'back.out(2)' });
  }, []);
  return (
    <div ref={containerRef} className="bg-black text-white rounded-2xl p-9 flex flex-col gap-5 min-h-[280px] justify-center" style={{ opacity: 0 }}>
      <div ref={checkRef} className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold" style={{ transform: 'scale(0)' }}>✓</div>
      <h2 className="text-2xl font-bold tracking-tight">Message Sent!</h2>
      <p className="text-white/55 text-sm font-medium leading-relaxed">
        Thanks, <strong className="text-white">{name}</strong>. We'll reply to <strong className="text-white">{email}</strong> within 24 hours.
      </p>
      <MagneticCTA variant="light" onClick={onReset}>Send Another Message</MagneticCTA>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────────── */
function LocationIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 1.5C5.01 1.5 3 3.51 3 6c0 3.5 4.5 7.5 4.5 7.5s4.5-4 4.5-7.5c0-2.49-2.01-4.5-4.5-4.5z" />
      <circle cx="7.5" cy="6" r="1.5" />
    </svg>
  );
}
function PhoneIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2h-1a2 2 0 00-2 2 9 9 0 009 9 2 2 0 002-2v-1a1 1 0 00-.6-.9l-2.2-1a1 1 0 00-1.1.2l-.7.8A7 7 0 014.9 5l.7-.8a1 1 0 00.2-1.1L4.8 2.8A1 1 0 005 2z" />
    </svg>
  );
}
function MailIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3.5" width="12" height="8" rx="1.5" />
      <path d="M1.5 5l6 4 6-4" />
    </svg>
  );
}
function ClockIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="7.5" r="6" />
      <path d="M7.5 4v3.5l2.3 1.4" />
    </svg>
  );
}
function LoadingSpinner() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <circle cx="6.5" cy="6.5" r="5" strokeOpacity="0.25" />
      <path d="M6.5 1.5A5 5 0 0111.5 6.5" strokeLinecap="round" />
    </svg>
  );
}
