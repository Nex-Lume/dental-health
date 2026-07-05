import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pages
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AboutPage from './pages/AboutPage';
import AppointmentPage from './pages/AppointmentPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';

// Components
import TeethTransition from './components/TeethTransition';
import MagneticButton from './components/MagneticButton';
import InteractiveDentalCard from './components/InteractiveDentalCard';
import CallUsButton from './components/CallUsButton';
import PremiumFooter from './components/PremiumFooter';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';
import FluidCursorSimulation from './components/FluidCursorSimulation';

// --- IMAGE URLS ---
const HERO_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_113640_ccf3cf97-d447-425b-a134-d7b09fc743fc.png&w=1280&q=85';
const SECTION2_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114219_414dfe80-f15c-4e25-bf52-b13721f4bd88.png&w=1280&q=85';
const SECTION3_IMG1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115253_c19ab167-8dd5-48b4-967d-b9f0d9d6e8fb.png&w=1280&q=85';
const SECTION3_IMG2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115237_fc519057-6e87-4abf-999a-9610b8b085b4.png&w=1280&q=85';
const SECTION3_BG = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114355_752ba9e6-0942-4abb-9047-5d9bb16632e9.png&w=1280&q=85';

// --- DATA CONSTANTS ---
const featureBars = ['Advanced Dentistry', 'High Quality Equipment', 'Friendly Staff'];

const services = [
  { name: 'Dental\nVeneers', num: '01', active: true },
  { name: 'Dental\nCrowns', num: '02', active: false },
  { name: 'Teeth\nWhitening', num: '03', active: false },
  { name: 'Dental\nImplants', num: null, active: false },
];

// --- INTERFACES ---
interface MaskPosition {
  x: number;
  y: number;
  sw: number;
  sh: number;
}

// --- CUSTOM HOOKS ---

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);
  return isMobile;
}

function useImageWidth(bgImage: string, sectionHeight: number) {
  const [imageWidth, setImageWidth] = useState(0);
  useEffect(() => {
    if (!bgImage || !sectionHeight) return;
    const img = new Image();
    img.src = bgImage;
    const handleLoad = () => {
      if (img.naturalHeight > 0) {
        setImageWidth(img.naturalWidth * (sectionHeight / img.naturalHeight));
      }
    };
    if (img.complete) handleLoad();
    else img.onload = handleLoad;
  }, [bgImage, sectionHeight]);
  return imageWidth;
}

function useMaskPositions(
  sectionRef: React.RefObject<HTMLElement | null>,
  cardsRef: React.RefObject<(HTMLElement | null)[]>
) {
  const [positions, setPositions] = useState<MaskPosition[]>([]);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const updatePositions = () => {
      const sectionRect = section.getBoundingClientRect();
      const sw = sectionRect.width;
      const sh = sectionRect.height;
      const currentCards = cardsRef.current;
      if (!currentCards) return;
      const nextPositions = currentCards.map((card) => {
        if (!card) return { x: 0, y: 0, sw, sh };
        const cardRect = card.getBoundingClientRect();
        return { x: cardRect.left - sectionRect.left, y: cardRect.top - sectionRect.top, sw, sh };
      });
      setPositions(nextPositions);
    };
    updatePositions();
    const resizeObserver = new ResizeObserver(() => updatePositions());
    resizeObserver.observe(section);
    window.addEventListener('resize', updatePositions);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePositions);
    };
  }, [sectionRef, cardsRef]);
  return positions;
}

function useStaggeredReveal(count: number, threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  if (count < 0) console.warn('Reveal count must be positive');
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  const getAnimStyle = (index: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
  });
  return { containerRef, getAnimStyle };
}

// --- COMPONENTS ---

interface MaskedCardProps {
  bgImage: string;
  position?: MaskPosition;
  imageWidth: number;
  focalX: number;
  className?: string;
  children?: React.ReactNode;
  cardRef?: (el: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

const MaskedCard: React.FC<MaskedCardProps> = ({
  bgImage, position, imageWidth, focalX, className = '', children, cardRef, style = {},
}) => {
  let backgroundStyle: React.CSSProperties = {};
  if (position) {
    const overflow = imageWidth > position.sw ? imageWidth - position.sw : 0;
    const focalOffset = overflow * focalX;
    backgroundStyle = {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: `auto ${position.sh}px`,
      backgroundPosition: `-${position.x + focalOffset}px -${position.y}px`,
      backgroundRepeat: 'no-repeat',
    };
  } else {
    backgroundStyle = { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };
  }
  return (
    <div ref={cardRef} className={className} style={{ ...backgroundStyle, ...style }}>
      {children}
    </div>
  );
};

interface SplashScreenProps { onComplete: () => void; }

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => onComplete(), 700);
        }, 200);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [onComplete]);
  return (
    <div className={`fixed inset-0 bg-white z-[100] flex items-end justify-start transition-opacity duration-700 ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none text-black">{count}</div>
    </div>
  );
};

// ─── NAV LINKS ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
  { label: 'Appointment', to: '/appointment' },
];

interface NavbarProps { isMobile: boolean; }

const Navbar: React.FC<NavbarProps> = ({ isMobile }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (menuOpen && isMobile) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, isMobile]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-md border-b border-neutral-100/50 select-none">
        {/* Logo */}
        <Link to="/" className="flex flex-col">
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none text-black">Dental</span>
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none text-black -mt-1.5 md:-mt-2">Health</span>
          <span className="text-[8px] md:text-[9px] font-medium uppercase tracking-widest leading-none mt-1.5 md:mt-2 text-neutral-400">quality healthcare</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/contact" className="text-sm font-semibold text-black hover:text-neutral-500 transition-colors">
            Dental Emergency
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-6 py-3 bg-white rounded-full border border-black text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 flex items-center justify-center relative z-50 md:hidden focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          <span className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
          <span className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} />
          <span className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
        </button>
      </nav>

      {/* Full-Screen Menu Overlay (both mobile & desktop) */}
      <div className={`fixed inset-0 z-40 transition-all duration-500 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Panel */}
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col justify-center h-full px-8 gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${100 + i * 60}ms` : '0ms' }}
                className={`text-3xl md:text-4xl font-bold text-black hover:text-neutral-500 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} ${location.pathname === link.to ? 'text-neutral-400' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Bottom section */}
            <div
              style={{ transitionDelay: menuOpen ? '460ms' : '0ms' }}
              className={`mt-8 pt-8 border-t border-neutral-200 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            >
              <div className="text-sm font-semibold text-black mb-4">Dental Emergency</div>
              <button
                className="w-full px-6 py-4 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
                onClick={() => { setMenuOpen(false); navigate('/appointment'); }}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- HOME PAGE ---

function HomePage() {
  const [serviceItems, setServiceItems] = useState(services);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const s1Reveal = useStaggeredReveal(4, 0.1);
  const s2Reveal = useStaggeredReveal(4, 0.1);
  const s3Reveal = useStaggeredReveal(4, 0.1);

  const section1Ref = useRef<HTMLElement | null>(null);
  const section2Ref = useRef<HTMLElement | null>(null);
  const s1CardsRef = useRef<(HTMLElement | null)[]>([]);
  const s2CardsRef = useRef<(HTMLElement | null)[]>([]);

  const s1Positions = useMaskPositions(section1Ref, s1CardsRef);
  const s2Positions = useMaskPositions(section2Ref, s2CardsRef);

  const s1Height = s1Positions[0]?.sh || 0;
  const s2Height = s2Positions[0]?.sh || 0;
  const s1ImgWidth = useImageWidth(HERO_IMAGE, s1Height);
  const s2ImgWidth = useImageWidth(SECTION2_IMAGE, s2Height);

  const s1FocalX = isMobile ? 0.7 : 0.8;
  const s2FocalX = isMobile ? 0.65 : 0.8;

  const setCombinedSection1Ref = (el: HTMLElement | null) => {
    section1Ref.current = el;
    s1Reveal.containerRef.current = el;
  };
  const setCombinedSection2Ref = (el: HTMLElement | null) => {
    section2Ref.current = el;
    s2Reveal.containerRef.current = el;
  };

  const handleServiceHover = (index: number) => {
    setServiceItems((prev) => prev.map((svc, i) => ({ ...svc, active: i === index })));
  };

  return (
    <>
      {/* Section 1 - Hero */}
      <section
        ref={setCombinedSection1Ref}
        id="home"
        className="h-screen w-full overflow-hidden flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        {featureBars.map((text, i) => (
          <MaskedCard
            key={text}
            bgImage={HERO_IMAGE}
            position={s1Positions[i]}
            imageWidth={s1ImgWidth}
            focalX={s1FocalX}
            cardRef={(el) => { s1CardsRef.current[i] = el; }}
            style={s1Reveal.getAnimStyle(i)}
            className="w-full h-14 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative flex items-center justify-center"
          >
            <span className="text-black text-lg md:text-3xl font-bold text-center relative z-10 leading-none">{text}</span>
          </MaskedCard>
        ))}

        <MaskedCard
          bgImage={HERO_IMAGE}
          position={s1Positions[3]}
          imageWidth={s1ImgWidth}
          focalX={s1FocalX}
          cardRef={(el) => { s1CardsRef.current[3] = el; }}
          style={s1Reveal.getAnimStyle(3)}
          className="w-full flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden relative"
        >
          <div className="absolute top-4 left-4 md:top-7 md:left-7 text-black text-xs md:text-sm font-semibold leading-4 md:leading-5 max-w-[200px] md:max-w-[300px] z-10">
            We wish to provide professional dental services<br />that match the current technologies
          </div>
          <div className="absolute bottom-5 left-3 md:bottom-8 md:left-4 z-10">
            <span className="block text-black text-xs md:text-sm font-semibold mb-1 md:mb-2">Trusted Dentist in West New York</span>
            <h1 className="text-black text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.79] tracking-tight">Dental<br />Care</h1>
          </div>
          <div className="absolute bottom-6 right-4 md:bottom-10 md:right-8 text-white text-xs md:text-sm font-semibold z-10">
            <button
              onClick={() => navigate('/appointment')}
              className="px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs md:text-sm font-bold hover:bg-white hover:text-black transition-all duration-200 cursor-pointer border border-white/40"
            >
              Free Consultation
            </button>
          </div>
        </MaskedCard>
      </section>

      {/* Section 2 - Smile Gallery */}
      <section
        ref={setCombinedSection2Ref}
        id="gallery"
        className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">

          {/* Card 0 */}
          <MaskedCard
            bgImage={SECTION2_IMAGE} position={s2Positions[0]} imageWidth={s2ImgWidth} focalX={s2FocalX}
            cardRef={(el) => { s2CardsRef.current[0] = el; }}
            style={s2Reveal.getAnimStyle(0)}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          >
            <Link to="/gallery">
              <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-2xl md:text-3xl font-bold z-10 hover:underline">Smile Gallery</h2>
            </Link>
            <p className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white md:text-black text-xs md:text-sm font-semibold z-10">Our cosmetic dental work</p>
          </MaskedCard>

          {/* Card 1 */}
          <MaskedCard
            bgImage={SECTION2_IMAGE} position={s2Positions[1]} imageWidth={s2ImgWidth} focalX={s2FocalX}
            cardRef={(el) => { s2CardsRef.current[1] = el; }}
            style={s2Reveal.getAnimStyle(1)}
            className="md:row-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          >
            <div className="absolute bottom-16 left-5 md:bottom-20 md:left-7 text-white text-xs md:text-sm font-semibold leading-4 md:leading-5 z-10">
              If you want a gorgeous smile,<br />call us to ask about a smile makeover.
            </div>
            <CallUsButton
              onClick={() => window.location.href = 'tel:+91222551721'}
              className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10"
            />
          </MaskedCard>

          {/* Card 2 */}
          <MaskedCard
            bgImage={SECTION2_IMAGE} position={s2Positions[2]} imageWidth={s2ImgWidth} focalX={s2FocalX}
            cardRef={(el) => { s2CardsRef.current[2] = el; }}
            style={s2Reveal.getAnimStyle(2)}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          >
            <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] z-10">Smile<br />makeover</h2>
          </MaskedCard>

          {/* Card 3 — Services */}
          <MaskedCard
            bgImage={SECTION2_IMAGE} position={s2Positions[3]} imageWidth={s2ImgWidth} focalX={s2FocalX}
            cardRef={(el) => { s2CardsRef.current[3] = el; }}
            style={s2Reveal.getAnimStyle(3)}
            className="col-span-1 md:col-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          >
            <div className="absolute inset-0 z-10 flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2 p-2 md:p-3">
              {serviceItems.map((svc, idx) => (
                <div
                  key={svc.name}
                  onMouseEnter={() => handleServiceHover(idx)}
                  onClick={() => navigate('/services')}
                  className={`flex-1 min-w-[calc(50%-4px)] md:min-w-0 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer select-none ${svc.active ? 'bg-white/90 backdrop-blur-md shadow-lg scale-[1.01]' : 'bg-white/20 backdrop-blur-xl hover:bg-white/30'
                    }`}
                >
                  <h3 className={`text-xl md:text-4xl font-bold leading-[1.05] whitespace-pre-line transition-colors duration-300 ${svc.active ? 'text-black' : 'text-white'}`}>
                    {svc.name}
                  </h3>
                  {svc.num && (
                    <div className={`self-end w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-300 ${svc.active ? 'border-black text-black' : 'border-white text-white'}`}>
                      {svc.num}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </MaskedCard>
        </div>
      </section>

      {/* Section 3 - Implant Dentistry */}
      <section
        ref={s3Reveal.containerRef}
        id="services"
        className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">

          {/* Left Column */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div style={s3Reveal.getAnimStyle(0)} className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0">
              <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-black">Implant<br />Dentistry</h2>
              <p className="text-xs md:text-sm font-semibold text-black">Restore Missing Teeth</p>
            </div>

            <div style={s3Reveal.getAnimStyle(1)} className="flex gap-1.5 md:gap-2 flex-1 min-h-[140px] md:min-h-0">
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img src={SECTION3_IMG1} alt="Dental implant procedure" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img src={SECTION3_IMG2} alt="Dental restoration" className="w-full h-full object-cover" />
              </div>
            </div>

            <div style={s3Reveal.getAnimStyle(2)} className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0">
              <div>
                <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">Consultation</p>
                <h3 className="text-xl md:text-3xl font-bold text-black leading-6 md:leading-8">Dental<br />Restoration<br />Services</h3>
              </div>
              <MagneticButton onClick={() => navigate('/appointment')}>
                Book Online
              </MagneticButton>
            </div>
          </div>

          {/* Right Column */}
          <div style={s3Reveal.getAnimStyle(3)} className="flex flex-col gap-1.5 md:gap-2 min-h-[350px] md:min-h-0">
            <InteractiveDentalCard
              title={`The Process\nof Installing\nImplants`}
              description="Learn about the complete timeline, consultations, surgery, and restoration stages."
              bgImage={SECTION3_BG}
              to="/services"
              className="flex-1"
            />
            <InteractiveDentalCard
              title={`Caring\nfor Dental\nImplants`}
              description="Discover essential hygiene routines, checks, and cleaning habits for long-term health."
              bgImage={SECTION3_IMG1}
              to="/about"
              className="flex-1"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <PremiumFooter />
    </>
  );
}

// --- MAIN APP ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Only show splash on home page visit
  const isHome = location.pathname === '/';

  useEffect(() => {
    // Initialize Lenis for buttery-smooth momentum scrolling (tuned for Awwwards-style floaty feel)
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 5), // Quintic ease-out for gradual, ultra-smooth deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85, // slightly gentler movement per scroll notch
      touchMultiplier: 1.2, // buttery touch momentum
      infinite: false,
    });

    // Make lenis globally accessible
    (window as any).lenis = lenis;

    // Sync ScrollTrigger updates with Lenis scrolling
    lenis.on('scroll', ScrollTrigger.update);

    // Frame-rate locked update loop synced with GSAP
    const updateLoop = (time: number) => {
      lenis.raf(time * 1000); // lenis expects milliseconds
    };
    gsap.ticker.add(updateLoop);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLoop);
      (window as any).lenis = null;
    };
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      <ScrollToTop />
      <CustomCursor />
      <FluidCursorSimulation />
      {showSplash && isHome && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <TeethTransition />
      <Navbar isMobile={isMobile} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </div>
  );
}
