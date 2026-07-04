import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const TEAM = [
  {
    name: 'Dr. James Carter',
    title: 'Lead Dentist & Implant Specialist',
    bio: '15 years of experience in dental implants and restorative dentistry. Graduated from NYU College of Dentistry.',
    specialties: ['Implants', 'Crowns', 'Restoration'],
    initials: 'JC',
  },
  {
    name: 'Dr. Sarah Mills',
    title: 'Cosmetic Dentist',
    bio: 'Award-winning cosmetic dentist specializing in smile makeovers, veneers and teeth whitening transformations.',
    specialties: ['Veneers', 'Whitening', 'Smile Design'],
    initials: 'SM',
  },
  {
    name: 'Dr. Aisha Khan',
    title: 'Orthodontist',
    bio: 'Expert in modern orthodontic solutions including traditional braces and clear aligner therapy for all ages.',
    specialties: ['Braces', 'Aligners', 'Orthodontics'],
    initials: 'AK',
  },
];

const STATS = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '12K+', label: 'Happy Patients' },
  { value: '3', label: 'Expert Doctors' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export default function AboutPage() {
  const heroRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const storyRef = useScrollReveal();
  const teamRef = useScrollReveal();

  return (
    <div className="bg-white text-black min-h-screen pt-20">
      {/* Hero */}
      <section ref={heroRef as React.RefObject<HTMLElement>} className="px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div>
            <p className="reveal text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">About Us</p>
            <h1 className="reveal text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.92] tracking-tight text-black" data-delay="80">
              Caring for<br />Smiles<br />Since 2009
            </h1>
          </div>
          <div>
            <p className="reveal text-base md:text-lg font-medium text-neutral-600 leading-relaxed mb-6" data-delay="120">
              Dental Health was founded with a single mission: to deliver world-class dental care in a warm, welcoming environment. We combine cutting-edge technology with compassionate care so every visit feels comfortable.
            </p>
            <Link
              to="/appointment"
              className="reveal inline-block px-8 py-4 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors duration-200"
              data-delay="200"
            >
              Book Your Visit
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef as React.RefObject<HTMLElement>} className="px-4 md:px-6 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="reveal bg-stone-50 rounded-2xl p-6 md:p-8 flex flex-col gap-2" data-delay={`${i * 80}`}>
              <span className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none">{stat.value}</span>
              <span className="text-xs md:text-sm font-semibold text-neutral-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef as React.RefObject<HTMLElement>} className="px-4 md:px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="reveal bg-black text-white rounded-2xl p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Our Story</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                Built on trust,<br />powered by passion<br />for perfect smiles.
              </h2>
              <div className="space-y-4 text-neutral-300 text-sm md:text-base font-medium leading-relaxed">
                <p>
                  What started as a small two-chair practice in West New York has grown into one of the region's most trusted dental clinics. Our team of specialist dentists, hygienists and care coordinators work together every day to ensure patients leave with healthy, beautiful smiles.
                </p>
                <p>
                  We invest heavily in the latest dental technology — from digital X-rays to CEREC same-day crowns — so your treatment is faster, more comfortable and more precise than ever before.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef as React.RefObject<HTMLElement>} className="px-4 md:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="reveal text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">The Team</p>
              <h2 className="reveal text-2xl md:text-4xl font-bold" data-delay="80">Meet Our Doctors</h2>
            </div>
            <Link to="/appointment" className="hidden md:inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors">
              Book Appointment
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {TEAM.map((doctor, i) => (
              <div key={doctor.name} className="reveal bg-stone-50 rounded-2xl p-6 md:p-8 flex flex-col gap-5" data-delay={`${i * 100}`}>
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                  {doctor.initials}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-black mb-1">{doctor.name}</h3>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">{doctor.title}</p>
                </div>
                <p className="text-sm font-medium text-neutral-600 leading-relaxed">{doctor.bio}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {doctor.specialties.map((s) => (
                    <span key={s} className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-black border border-neutral-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 md:hidden">
            <Link to="/appointment" className="block w-full py-4 bg-black text-white rounded-2xl text-sm font-bold text-center hover:bg-neutral-800 transition-colors">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
