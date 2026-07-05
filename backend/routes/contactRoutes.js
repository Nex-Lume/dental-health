import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
} from '../controllers/contactController.js';

const router = express.Router();

// POST   /api/contact             — submit contact form
// GET    /api/contact             — get all contact inquiries
router.route('/').post(createContact).get(getAllContacts);

// GET    /api/contact/:id         — get single contact inquiry
// DELETE /api/contact/:id         — delete contact inquiry
router.route('/:id').get(getContactById).delete(deleteContact);

export default router;
