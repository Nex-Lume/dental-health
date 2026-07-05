import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      match: [/^\+?[\d\s\-().]{7,20}$/, 'Please enter a valid phone number.'],
    },
    appointmentDate: {
      type: String, // stored as YYYY-MM-DD for easy slot comparison
      required: [true, 'Appointment date is required.'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required.'],
      trim: true,
    },
    selectedService: {
      type: String,
      required: [true, 'Please select a service.'],
      trim: true,
    },
    // doctor: {
    //   type: String,
    //   required: [true, 'Please select a doctor.'],
    //   trim: true,
    // },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Compound index to optimise slot availability queries
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
