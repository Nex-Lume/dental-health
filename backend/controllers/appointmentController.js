import Appointment from '../models/Appointment.js';
import { validateAppointment } from '../utils/validators.js';
import { sendConfirmationEmail } from '../services/emailService.js';

// ─── Slot limit ────────────────────────────────────────────────────────────────
const MAX_BOOKINGS_PER_SLOT = 2;

// ─── POST /api/appointments ────────────────────────────────────────────────────
export const createAppointment = async (req, res, next) => {
  try {
    const { name, patientName, email, phone, service, selectedService, doctor, date, appointmentDate, time, appointmentTime, notes } = req.body;

    // Support both field name conventions (frontend sends: name, service, date, time)
    const payload = {
      patientName: patientName || name,
      email,
      phone,
      selectedService: selectedService || service,
      doctor,
      appointmentDate: appointmentDate || date,
      appointmentTime: appointmentTime || time,
      notes,
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const errors = validateAppointment(payload);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // ── Slot availability check ───────────────────────────────────────────────
    const existingCount = await Appointment.countDocuments({
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
    });

    if (existingCount >= MAX_BOOKINGS_PER_SLOT) {
      return res.status(409).json({
        success: false,
        message: 'This appointment slot is already booked. Please choose another available slot.',
      });
    }

    // ── Save to MongoDB ───────────────────────────────────────────────────────
    const appointment = await Appointment.create({
      patientName: payload.patientName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      selectedService: payload.selectedService.trim(),
      // doctor: payload.doctor.trim(),
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime.trim(),
      notes: payload.notes ? payload.notes.trim() : '',
    });

    // ── Send confirmation email (non-blocking) ────────────────────────────────
    sendConfirmationEmail(appointment); // fire-and-forget, errors handled internally

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointmentId: appointment._id,
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/appointments ─────────────────────────────────────────────────────
export const getAllAppointments = async (_req, res, next) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/appointments/:id ─────────────────────────────────────────────────
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/appointments/:id ─────────────────────────────────────────────────
export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    res.json({ success: true, message: 'Appointment updated.', data: appointment });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/appointments/:id ─────────────────────────────────────────────
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    res.json({ success: true, message: 'Appointment deleted.' });
  } catch (err) {
    next(err);
  }
};
