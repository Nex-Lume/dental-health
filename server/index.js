import express from 'express';
import cors from 'cors';
import { getDb, dbRun, dbAll, dbGet } from './db.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ─── Validation Helpers ───────────────────────────────────────────────────────

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\+?[\d\s\-().]{7,20}$/.test(phone);
}

function validateDate(date) {
  if (!date) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/appointments
app.post('/api/appointments', async (req, res) => {
  try {
    await getDb();
    const { name, email, phone, service, doctor, date, time, notes } = req.body;
    const errors = {};

    if (!name || name.trim().length < 2)
      errors.name = 'Name must be at least 2 characters.';
    if (!email || !validateEmail(email))
      errors.email = 'Please enter a valid email address.';
    if (!phone || !validatePhone(phone))
      errors.phone = 'Please enter a valid phone number.';
    if (!service || !service.trim())
      errors.service = 'Please select a service.';
    if (!doctor || !doctor.trim())
      errors.doctor = 'Please select a doctor.';
    if (!date || !validateDate(date))
      errors.date = 'Please select a valid future date.';
    if (!time || !time.trim())
      errors.time = 'Please select a time slot.';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const id = dbRun(
      `INSERT INTO appointments (name, email, phone, service, doctor, date, time, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), email.trim().toLowerCase(), phone.trim(), service.trim(), doctor.trim(), date, time.trim(), notes ? notes.trim() : null]
    );

    res.status(201).json({ success: true, message: 'Appointment booked successfully!', appointmentId: id });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// GET /api/appointments
app.get('/api/appointments', async (_req, res) => {
  try {
    await getDb();
    const rows = dbAll('SELECT * FROM appointments ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// GET /api/appointments/:id
app.get('/api/appointments/:id', async (req, res) => {
  try {
    await getDb();
    const row = dbGet('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    res.json({ success: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/contacts
app.post('/api/contacts', async (req, res) => {
  try {
    await getDb();
    const { name, email, phone, message } = req.body;
    const errors = {};

    if (!name || name.trim().length < 2)
      errors.name = 'Name must be at least 2 characters.';
    if (!email || !validateEmail(email))
      errors.email = 'Please enter a valid email address.';
    if (phone && !validatePhone(phone))
      errors.phone = 'Please enter a valid phone number.';
    if (!message || message.trim().length < 10)
      errors.message = 'Message must be at least 10 characters.';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const id = dbRun(
      `INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)`,
      [name.trim(), email.trim().toLowerCase(), phone ? phone.trim() : null, message.trim()]
    );

    res.status(201).json({ success: true, message: 'Message sent successfully!', contactId: id });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// GET /api/services
app.get('/api/services', (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Dental Veneers', description: 'Transform your smile with custom porcelain veneers.', duration: '2 sessions', price: '$800–$2,500' },
      { id: 2, name: 'Dental Crowns', description: 'Restore damaged teeth with durable, natural-looking crowns.', duration: '2 sessions', price: '$1,000–$1,800' },
      { id: 3, name: 'Teeth Whitening', description: 'Achieve a brighter smile with professional whitening.', duration: '1 session', price: '$300–$600' },
      { id: 4, name: 'Dental Implants', description: 'Permanent tooth replacement that looks and feels natural.', duration: '3–6 months', price: '$3,000–$5,000' },
      { id: 5, name: 'Teeth Cleaning', description: 'Routine professional cleaning for optimal oral hygiene.', duration: '1 session', price: '$100–$200' },
      { id: 6, name: 'Root Canal', description: 'Pain-free root canal therapy to save your natural tooth.', duration: '1–2 sessions', price: '$700–$1,500' },
      { id: 7, name: 'Orthodontics', description: 'Straighten your teeth with modern braces or clear aligners.', duration: '12–24 months', price: '$3,000–$7,000' },
      { id: 8, name: 'Emergency Care', description: '24/7 emergency dental care for urgent situations.', duration: 'Same day', price: 'Varies' },
    ],
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────

async function start() {
  await getDb();
  app.listen(PORT, () => {
    console.log(`\n  ✔  Dental Health API → http://localhost:${PORT}\n`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
