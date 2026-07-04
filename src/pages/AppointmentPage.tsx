import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SERVICES = [
  'Dental Veneers', 'Dental Crowns', 'Teeth Whitening', 'Dental Implants',
  'Teeth Cleaning', 'Root Canal', 'Orthodontics', 'Emergency Care',
];

const DOCTORS = ['Dr. James Carter', 'Dr. Sarah Mills', 'Dr. Aisha Khan'];

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  doctor?: string;
  date?: string;
  time?: string;
  general?: string;
}

const EMPTY_FORM: FormData = {
  name: '', email: '', phone: '', service: '', doctor: '', date: '', time: '', notes: '',
};

function getTodayString() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function AppointmentPage() {
  const [step, setStep] = useState(1); // 1 = personal, 2 = schedule, 3 = success
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep1(): boolean {
    const errs: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email address.';
    if (!/^\+?[\d\s\-().]{7,20}$/.test(form.phone))
      errs.phone = 'Please enter a valid phone number.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: FormErrors = {};
    if (!form.service) errs.service = 'Please select a service.';
    if (!form.doctor) errs.doctor = 'Please select a doctor.';
    if (!form.date) {
      errs.date = 'Please select a date.';
    } else {
      const selected = new Date(form.date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) errs.date = 'Please select a future date.';
    }
    if (!form.time) errs.time = 'Please select a time slot.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setBookingId(data.appointmentId);
        setStep(3);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || 'Something went wrong. Please try again.' });
        }
      }
    } catch {
      setErrors({ general: 'Unable to connect to server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setForm(EMPTY_FORM);
    setErrors({});
    setStep(1);
    setBookingId(null);
  }

  return (
    <div className="bg-white text-black min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 items-start">

          {/* LEFT — Info Panel */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Book an Appointment</p>
              <h1 className="text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[0.92] tracking-tight text-black">
                Your Smile<br />Starts Here
              </h1>
            </div>
            <p className="text-sm md:text-base font-medium text-neutral-600 leading-relaxed max-w-sm">
              Fill in your details and we'll schedule a time that works for you. Our team will confirm your appointment within 24 hours.
            </p>

            {/* Info Cards */}
            <div className="flex flex-col gap-2">
              <div className="bg-stone-50 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg">📞</div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-bold">+1 (201) 555-0190</p>
                </div>
              </div>
              <div className="bg-stone-50 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg">📍</div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Location</p>
                  <p className="text-sm font-bold">123 Main Street, West New York, NJ</p>
                </div>
              </div>
              <div className="bg-stone-50 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg">🕐</div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Hours</p>
                  <p className="text-sm font-bold">Mon–Fri 9am–6pm · Sat 9am–3pm</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Form / Success */}
          <div>
            {step === 3 ? (
              /* ─── SUCCESS ──────────────────────────────────────── */
              <div className="bg-black text-white rounded-2xl p-8 md:p-10 flex flex-col gap-6 min-h-[480px] justify-between">
                <div>
                  <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-2xl mb-6">✓</div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Appointment Booked!</h2>
                  <p className="text-neutral-300 text-sm md:text-base font-medium leading-relaxed">
                    Thank you, <strong className="text-white">{form.name}</strong>. Your appointment has been successfully recorded. We'll send a confirmation to <strong className="text-white">{form.email}</strong>.
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-5 space-y-2">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">Booking Summary</p>
                  <DetailRow label="Booking ID" value={`#${bookingId}`} />
                  <DetailRow label="Service" value={form.service} />
                  <DetailRow label="Doctor" value={form.doctor} />
                  <DetailRow label="Date" value={new Date(form.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
                  <DetailRow label="Time" value={form.time} />
                </div>
                <button
                  onClick={reset}
                  className="px-8 py-4 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-100 transition-colors"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              /* ─── FORM ──────────────────────────────────────────── */
              <form onSubmit={handleSubmit} className="bg-stone-50 rounded-2xl p-7 md:p-8 flex flex-col gap-5">
                {/* Step Indicator */}
                <div className="flex items-center gap-2 mb-1">
                  {[1, 2].map((s) => (
                    <React.Fragment key={s}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === s ? 'bg-black text-white' : s < step ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-400'
                      }`}>
                        {s < step ? '✓' : s}
                      </div>
                      {s < 2 && <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s ? 'bg-black' : 'bg-neutral-200'}`} />}
                    </React.Fragment>
                  ))}
                </div>
                <h2 className="text-lg font-bold">
                  {step === 1 ? 'Personal Information' : 'Schedule Your Visit'}
                </h2>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                    {errors.general}
                  </div>
                )}

                {/* ── Step 1: Personal Info ── */}
                {step === 1 && (
                  <div className="flex flex-col gap-4">
                    <Field label="Full Name *" error={errors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Jane Doe"
                        className={inputClass(!!errors.name)}
                      />
                    </Field>
                    <Field label="Email Address *" error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="jane@example.com"
                        className={inputClass(!!errors.email)}
                      />
                    </Field>
                    <Field label="Phone Number *" error={errors.phone}>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="+1 (201) 555-0100"
                        className={inputClass(!!errors.phone)}
                      />
                    </Field>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full py-4 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors mt-2"
                    >
                      Continue to Scheduling →
                    </button>
                  </div>
                )}

                {/* ── Step 2: Scheduling ── */}
                {step === 2 && (
                  <div className="flex flex-col gap-4">
                    <Field label="Select Service *" error={errors.service}>
                      <select
                        value={form.service}
                        onChange={(e) => update('service', e.target.value)}
                        className={inputClass(!!errors.service)}
                      >
                        <option value="">Choose a service…</option>
                        {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Select Doctor *" error={errors.doctor}>
                      <select
                        value={form.doctor}
                        onChange={(e) => update('doctor', e.target.value)}
                        className={inputClass(!!errors.doctor)}
                      >
                        <option value="">Choose a doctor…</option>
                        {DOCTORS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Date *" error={errors.date}>
                        <input
                          type="date"
                          value={form.date}
                          min={getTodayString()}
                          onChange={(e) => update('date', e.target.value)}
                          className={inputClass(!!errors.date)}
                        />
                      </Field>
                      <Field label="Time Slot *" error={errors.time}>
                        <select
                          value={form.time}
                          onChange={(e) => update('time', e.target.value)}
                          className={inputClass(!!errors.time)}
                        >
                          <option value="">Choose time…</option>
                          {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </Field>
                    </div>
                    <Field label="Additional Notes (optional)">
                      <textarea
                        value={form.notes}
                        onChange={(e) => update('notes', e.target.value)}
                        placeholder="Any concerns or special requests…"
                        rows={3}
                        className={inputClass(false) + ' resize-none'}
                      />
                    </Field>

                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => { setStep(1); setErrors({}); }}
                        className="flex-1 py-4 bg-white text-black rounded-full text-sm font-bold border border-neutral-200 hover:border-black transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-4 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Booking…' : 'Confirm Appointment'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 pb-12 max-w-6xl mx-auto">
        <div className="border-t border-neutral-100 pt-8">
          <p className="text-xs text-neutral-400 font-medium text-center">
            Need urgent care? Call us directly at{' '}
            <a href="tel:+12015550190" className="text-black font-bold hover:underline">+1 (201) 555-0190</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Helper sub-components ─────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-black uppercase tracking-wide">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium text-black outline-none transition-all duration-200 focus:ring-2 focus:ring-black ${
    hasError ? 'border-red-400 focus:ring-red-400' : 'border-neutral-200 focus:border-black'
  }`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-neutral-400 font-medium">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
