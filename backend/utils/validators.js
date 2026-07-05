/**
 * Shared validation utilities for incoming request bodies.
 */

export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) =>
  /^\+?[\d\s\-().]{7,20}$/.test(phone);

/**
 * Returns true if the date string (YYYY-MM-DD) is today or in the future.
 */
export const isFutureOrToday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};

/**
 * Validates all appointment fields and returns an error map.
 * Returns an empty object if all fields are valid.
 */
export const validateAppointment = ({ patientName, email, phone, appointmentDate, appointmentTime, selectedService, doctor }) => {
  const errors = {};

  if (!patientName || patientName.trim().length < 2)
    errors.name = 'Name must be at least 2 characters.';

  if (!email || !isValidEmail(email))
    errors.email = 'Please enter a valid email address.';

  if (!phone || !isValidPhone(phone))
    errors.phone = 'Please enter a valid phone number.';

  if (!selectedService || !selectedService.trim())
    errors.service = 'Please select a service.';

  // if (!doctor || !doctor.trim())
  //  errors.doctor = 'Please select a doctor.';

  if (!appointmentDate || !isFutureOrToday(appointmentDate))
    errors.date = 'Please select a valid future date.';

  if (!appointmentTime || !appointmentTime.trim())
    errors.time = 'Please select a time slot.';

  return errors;
};

/**
 * Validates all contact form fields and returns an error map.
 */
export const validateContact = ({ name, email, phone, message }) => {
  const errors = {};

  if (!name || name.trim().length < 2)
    errors.name = 'Name must be at least 2 characters.';

  if (!email || !isValidEmail(email))
    errors.email = 'Please enter a valid email address.';

  if (phone && !isValidPhone(phone))
    errors.phone = 'Please enter a valid phone number.';

  if (!message || message.trim().length < 10)
    errors.message = 'Message must be at least 10 characters.';

  return errors;
};
