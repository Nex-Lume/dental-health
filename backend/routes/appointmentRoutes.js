import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

const router = express.Router();

// POST   /api/appointments        — book new appointment
// GET    /api/appointments        — get all appointments
router.route('/').post(createAppointment).get(getAllAppointments);

// GET    /api/appointments/:id    — get single appointment
// PUT    /api/appointments/:id    — update appointment
// DELETE /api/appointments/:id    — delete appointment
router.route('/:id').get(getAppointmentById).put(updateAppointment).delete(deleteAppointment);

export default router;
