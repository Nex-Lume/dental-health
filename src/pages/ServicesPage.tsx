import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SERVICES_DATA } from '../data/servicesData';
import MagneticButton from '../components/MagneticButton';

const CATEGORIES = ['All', 'Preventive', 'Cosmetic', 'Restorative', 'Surgical', 'Implant', 'Orthodontics'];

export default function ServicesPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  // Attach to the outer page wrapper so ALL .reveal children are observed
  const revealRef = useScrollReveal();

  const filtered = activeCategory === 'All'
    ? SERVICES_DATA
    : SERVICES_DATA.filter((s) => s.category === activeCategory);

  return (
    <div
      ref={revealRef as React.RefObject<HTMLDivElement>}
      className="bg-white text-black min-h-screen pt-20"
    >
      {/* Header */}
      <section className="px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Our Services
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1
              className="reveal text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.92] tracking-tight text-black"
              data-delay="80"
            >
              Expert<br />Dental Care
            </h1>
            <p className="reveal text-sm md:text-base font-medium text-neutral-600 max-w-sm md:text-right" data-delay="160">
              We offer a full range of modern dental treatments, delivered with precision and care using the latest technology.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 md:px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="reveal flex flex-wrap gap-2" data-delay="200">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-black text-white border-black'
                    : 'bg-transparent text-black border-neutral-200 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-6 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          {filtered.map((svc, idx) => (
            <div
              key={svc.slug}
              data-delay={`${idx * 40}`}
              className="reveal w-full"
            >
              <div
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                onClick={() => navigate(`/services/${svc.slug}`)}
                className={`rounded-2xl p-5 md:p-7 cursor-pointer transition-all duration-300 border ${
                  activeIdx === idx
                    ? 'bg-black text-white border-black'
                    : 'bg-stone-50 text-black border-transparent hover:border-neutral-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${activeIdx === idx ? 'text-neutral-400' : 'text-neutral-400'}`}>
                        {svc.num}
                      </span>
                      <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-colors duration-300 ${activeIdx === idx ? 'bg-white/10 text-white/60' : 'bg-neutral-200 text-neutral-500'}`}>
                        {svc.category}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-1">{svc.name}</h2>
                    <div className={`overflow-hidden transition-all duration-300 ${activeIdx === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className={`text-sm md:text-base font-medium mt-2 ${activeIdx === idx ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        {svc.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`text-sm font-bold transition-colors ${activeIdx === idx ? 'text-white' : 'text-black'}`}>
                      {svc.price}
                    </div>
                    <div className={`text-xs font-medium transition-colors ${activeIdx === idx ? 'text-neutral-400' : 'text-neutral-400'}`}>
                      {svc.duration}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center justify-between mt-4 transition-all duration-300 ${activeIdx === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    View full details →
                  </span>
                  <Link
                    to={`/services/${svc.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-6 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-100 transition-colors duration-200"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="reveal bg-black rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" data-delay="100">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Not sure where to start?</h2>
              <p className="text-neutral-400 text-sm md:text-base font-medium">Book a free consultation and we'll guide you to the right treatment.</p>
            </div>
            <MagneticButton
              onClick={() => navigate('/appointment')}
            >
              Book Free Consultation
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
