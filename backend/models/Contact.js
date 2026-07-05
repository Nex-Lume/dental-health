import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
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
      trim: true,
      default: null,
      validate: {
        validator: (v) => !v || /^\+?[\d\s\-().]{7,20}$/.test(v),
        message: 'Please enter a valid phone number.',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required.'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters.'],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
