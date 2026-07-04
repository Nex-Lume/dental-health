import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SECTION2_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114219_414dfe80-f15c-4e25-bf52-b13721f4bd88.png&w=1280&q=85';
const SECTION3_IMG1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115253_c19ab167-8dd5-48b4-967d-b9f0d9d6e8fb.png&w=1280&q=85';
const SECTION3_IMG2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115237_fc519057-6e87-4abf-999a-9610b8b085b4.png&w=1280&q=85';
const SECTION3_BG  = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114355_752ba9e6-0942-4abb-9047-5d9bb16632e9.png&w=1280&q=85';
const HERO_IMAGE   = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_113640_ccf3cf97-d447-425b-a134-d7b09fc743fc.png&w=1280&q=85';

// ── Bento grid items — each has a named grid area key and label ──────────────
// Row 1: 3 cols — hero(2×2), sm1, sm2
// Row 2:           hero(2×2), md1, md2  stacked
// Row 3: 3 cols — wide(3 cols span)
// Row 4: 3 cols — sq1, sq2, tall
// Row 5:           sq1, sq2, tall(2 rows)

const BENTO: Array<{
  src: string;
  label: string;
  category: string;
  area: string; // CSS grid-area name
}> = [
  { src: HERO_IMAGE,     label: 'Smile Transformation',   category: 'Cosmetic',      area: 'hero'  },
  { src: SECTION3_IMG1,  label: 'Implant Procedure',      category: 'Implants',      area: 'sm1'   },
  { src: SECTION3_IMG2,  label: 'Crown Fitting',          category: 'Restoration',   area: 'sm2'   },
  { src: SECTION2_IMAGE, label: 'Cosmetic Dentistry',     category: 'Cosmetic',      area: 'md1'   },
  { src: SECTION3_BG,    label: 'Happy Patient',          category: 'Results',       area: 'md2'   },
  { src: SECTION2_IMAGE, label: 'Smile Makeover',         category: 'Cosmetic',      area: 'wide'  },
  { src: SECTION3_IMG2,  label: 'Teeth Whitening',        category: 'Whitening',     area: 'sq1'   },
  { src: SECTION3_BG,    label: 'Orthodontic Care',       category: 'Orthodontics',  area: 'sq2'   },
  { src: HERO_IMAGE,     label: 'Before & After',         category: 'Results',       area: 'tall'  },
  { src: SECTION3_IMG1,  label: 'Dental Hygiene',         category: 'Prevention',    area: 'bot1'  },
  { src: SECTION2_IMAGE, label: 'Veneer Application',     category: 'Cosmetic',      area: 'bot2'  },
  { src: SECTION3_BG,    label: 'Full Smile Rebuild',     category: 'Restoration',   area: 'bot3'  },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<{ src: string; label: string; category: string } | null>(null);
  const [filter, setFilter] = useState('All');
  const revealRef = useScrollReveal();

  const categories = ['All', ...Array.from(new Set(BENTO.map((b) => b.category)))];
  const filtered = filter === 'All' ? BENTO : BENTO.filter((b) => b.category === filter);

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="bg-white text-black min-h-screen pt-20">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section
        ref={revealRef as React.RefObject<HTMLElement>}
        className="px-4 md:px-6 py-12 md:py-16"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="reveal text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Gallery</p>
            <h1 className="reveal text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.92] tracking-tight" data-delay="80">
              Smile<br />Gallery
            </h1>
          </div>
          <div className="max-w-xs">
            <p className="reveal text-sm md:text-base font-medium text-neutral-600 leading-relaxed mb-4" data-delay="160">
              Explore our portfolio of smile transformations and dental treatments — each one a story of restored confidence.
            </p>
            <Link
              to="/appointment"
              className="reveal inline-block px-8 py-4 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors"
              data-delay="200"
            >
              Book Your Smile
            </Link>
          </div>
        </div>
      </section>

      {/* ── Category Filter ─────────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                filter === cat
                  ? 'bg-black text-white'
                  : 'bg-stone-100 text-black hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Bento Grid ──────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {filter === 'All' ? (
            /* Full bento layout */
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(5, 220px)',
                gridTemplateAreas: `
                  "hero  hero  sm1   sm2"
                  "hero  hero  md1   md2"
                  "wide  wide  wide  tall"
                  "sq1   sq2   bot1  tall"
                  "bot2  bot3  bot3  tall"
                `,
              }}
            >
              {BENTO.map((item) => (
                <BentoCell key={item.area} item={item} onClick={() => setLightbox(item)} />
              ))}
            </div>
          ) : (
            /* Filtered — simple responsive grid */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map((item, idx) => (
                <div
                  key={item.area + idx}
                  onClick={() => setLightbox(item)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group ${
                    idx % 5 === 0 ? 'aspect-[4/5]' : idx % 3 === 0 ? 'aspect-[4/3]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <Overlay label={item.label} category={item.category} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '500+', label: 'Smile Makeovers' },
            { value: '98%', label: 'Patient Satisfaction' },
            { value: '12K+', label: 'Treatments Done' },
            { value: '15 yrs', label: 'Of Excellence' },
          ].map((stat) => (
            <div key={stat.label} className="bg-stone-50 rounded-2xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black rounded-2xl p-8 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Ready for your transformation?</h2>
              <p className="text-neutral-400 text-sm md:text-base font-medium max-w-md">
                Join thousands of patients who've achieved their perfect smile with our expert dental team.
              </p>
            </div>
            <Link
              to="/appointment"
              className="shrink-0 px-10 py-4 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-100 transition-colors whitespace-nowrap"
            >
              Book Your Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.label} className="w-full rounded-2xl object-contain max-h-[80vh]" />
            <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1 block">{lightbox.category}</span>
              <p className="text-white font-bold text-xl">{lightbox.label}</p>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function BentoCell({
  item,
  onClick,
}: {
  item: { src: string; label: string; category: string; area: string };
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{ gridArea: item.area }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
    >
      <img
        src={item.src}
        alt={item.label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <Overlay label={item.label} category={item.category} />
    </div>
  );
}

function Overlay({ label, category }: { label: string; category: string }) {
  return (
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-400 flex flex-col justify-end p-4 md:p-5">
      <div className="translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-1 block">{category}</span>
        <span className="text-white text-sm md:text-base font-bold leading-tight">{label}</span>
      </div>
    </div>
  );
}
