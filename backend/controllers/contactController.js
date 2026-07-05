import Contact from '../models/Contact.js';
import { validateContact } from '../utils/validators.js';

// ─── POST /api/contact ─────────────────────────────────────────────────────────
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    const errors = validateContact({ name, email, phone, message });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // ── Save to MongoDB ───────────────────────────────────────────────────────
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you within 24 hours.',
      contactId: contact._id,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/contact ──────────────────────────────────────────────────────────
export const getAllContacts = async (_req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/contact/:id ──────────────────────────────────────────────────────
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact inquiry not found.' });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/contact/:id ───────────────────────────────────────────────────
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact inquiry not found.' });
    }
    res.json({ success: true, message: 'Contact inquiry deleted.' });
  } catch (err) {
    next(err);
  }
};
