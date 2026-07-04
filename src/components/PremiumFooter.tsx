import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Appointment', to: '/appointment' },
  { label: 'Contact', to: '/contact' },
  { label: 'Gallery', to: '/gallery' },
];

export default function PremiumFooter() {
  const navigate = useNavigate();
  const footerRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const titleLeftRef = useRef<HTMLDivElement>(null);
  const titleRightRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const divider = dividerRef.current;
    const columns = columnsRef.current;
    const titleLeft = titleLeftRef.current;
    const titleRight = titleRightRef.current;
    const bottomBar = bottomBarRef.current;

    if (!footer || !divider || !columns || !titleLeft || !titleRight || !bottomBar) return;

    // 1. Cursor spotlight mouse position tracker
    const handleMouseMove = (e: MouseEvent) => {
      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      footer.style.setProperty('--spotlight-x', `${x}px`);
      footer.style.setProperty('--spotlight-y', `${y}px`);
    };

    footer.addEventListener('mousemove', handleMouseMove);

    // 2. Animated divider line that draws on scroll
    gsap.fromTo(divider,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom',
          end: 'top 80%',
          scrub: true,
        },
      }
    );

    // 3. GSAP Stagger Reveal scroll animation
    const revealTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Hide elements initially
    const revealItems = [titleLeft, titleRight, columns, bottomBar];
    gsap.set(revealItems, { opacity: 0, y: 35 });

    revealTimeline
      .to(titleLeft, { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' })
      .to(titleRight, { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.65')
      .to(columns, { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.6')
      .to(bottomBar, { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.6');

    return () => {
      footer.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative px-4 md:px-8 py-16 md:py-24 border-t border-neutral-100/50 bg-stone-50 overflow-hidden group select-none flex flex-col justify-between min-h-[450px]"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Subtle cursor spotlight effect */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
        style={{
          background: 'radial-gradient(400px circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), rgba(0, 0, 0, 0.02), transparent 80%)',
        }}
      />

      {/* Animated divider line */}
      <div
        ref={dividerRef}
        className="absolute top-0 left-0 w-full h-[1px] bg-neutral-200 origin-left z-1"
        style={{
          willChange: 'transform',
        }}
      />

      {/* Giant faded background typography - positioned behind everything */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11vw] font-black tracking-tighter opacity-[0.015] text-black select-none pointer-events-none z-0 whitespace-nowrap leading-none"
        style={{
          fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        DENTAL HEALTH
      </div>

      {/* Main Footer Grid */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col gap-10 md:gap-16">
        
        {/* Top Header Row of Footer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Logo & Headline */}
          <div ref={titleLeftRef} className="flex flex-col">
            <div className="flex flex-col mb-4">
              <span className="text-xl font-extrabold uppercase tracking-tight leading-none text-black">Dental</span>
              <span className="text-xl font-extrabold uppercase tracking-tight leading-none text-black -mt-1">Health</span>
              <span className="text-[9px] font-medium uppercase tracking-widest mt-1 text-neutral-400">quality healthcare</span>
            </div>
            <p className="text-sm text-neutral-500 font-medium max-w-xs leading-relaxed">
              Professional dental services using the latest technology in West New York, NJ.
            </p>
          </div>

          {/* Book Appointment CTA */}
          <div ref={titleRightRef} className="flex items-center relative md:pr-10">

            {/* Reusable premium MagneticButton */}
            <MagneticButton
              onClick={() => navigate('/appointment')}
              className="shadow-sm"
            >
              Book Appointment
            </MagneticButton>
          </div>
        </div>

        {/* Links Grid */}
        <div
          ref={columnsRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 border-t border-neutral-100/50 pt-10"
        >
          {/* Column 1 — Navigation Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Pages</p>
            <div className="flex flex-col gap-2.5 items-start">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="relative py-0.5 text-sm font-semibold text-black hover:text-neutral-500 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-black after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 — Contact Details with Hover Slide-in Icons */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Contact</p>
            <div className="flex flex-col gap-3.5 items-start text-sm font-semibold text-black">
              {/* Phone Link */}
              <a
                href="tel:+12015550190"
                className="group flex items-center text-sm font-semibold text-black hover:text-neutral-500 transition-colors"
              >
                <span className="w-0 opacity-0 scale-75 group-hover:w-3.5 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out flex items-center justify-center overflow-hidden mr-0 group-hover:mr-2 text-neutral-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <span>+1 (201) 555-0190</span>
              </a>

              {/* Email Link */}
              <a
                href="mailto:hello@dentalhealth.com"
                className="group flex items-center text-sm font-semibold text-black hover:text-neutral-500 transition-colors"
              >
                <span className="w-0 opacity-0 scale-75 group-hover:w-3.5 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out flex items-center justify-center overflow-hidden mr-0 group-hover:mr-2 text-neutral-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <span>hello@dentalhealth.com</span>
              </a>

              {/* Address detail */}
              <div className="group flex items-center text-sm font-medium text-neutral-500">
                <span className="w-0 opacity-0 scale-75 group-hover:w-3.5 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out flex items-center justify-center overflow-hidden mr-0 group-hover:mr-2 text-neutral-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span>123 Main St, West New York</span>
              </div>
            </div>
          </div>

          {/* Column 3 — Operating Hours */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Hours</p>
            <div className="flex flex-col gap-2 text-sm font-medium text-neutral-500">
              <div className="flex justify-between max-w-[200px]">
                <span>Mon–Fri:</span>
                <span className="font-semibold text-black">9am–6pm</span>
              </div>
              <div className="flex justify-between max-w-[200px]">
                <span>Saturday:</span>
                <span className="font-semibold text-black">9am–3pm</span>
              </div>
              <div className="flex justify-between max-w-[200px]">
                <span>Sunday:</span>
                <span className="font-semibold text-black">Closed</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Bottom Metadata Bar */}
      <div
        ref={bottomBarRef}
        className="relative z-10 max-w-6xl mx-auto w-full mt-10 md:mt-16 pt-6 border-t border-neutral-100/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-400 font-medium"
      >
        <p>© {new Date().getFullYear()} Dental Health. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
