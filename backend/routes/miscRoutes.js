import { Router } from 'express';
import {
  getServices, createService, updateService, deleteService,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getClients, createClient, updateClient, deleteClient,
} from '../controllers/miscController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Services
router.get('/services', getServices);
router.post('/services', protect, adminOnly, createService);
router.put('/services/:id', protect, adminOnly, updateService);
router.delete('/services/:id', protect, adminOnly, deleteService);

// Testimonials
router.get('/testimonials', getTestimonials);
router.post('/testimonials', protect, adminOnly, createTestimonial);
router.put('/testimonials/:id', protect, adminOnly, updateTestimonial);
router.delete('/testimonials/:id', protect, adminOnly, deleteTestimonial);

// Clients
router.get('/clients', getClients);
router.post('/clients', protect, adminOnly, createClient);
router.put('/clients/:id', protect, adminOnly, updateClient);
router.delete('/clients/:id', protect, adminOnly, deleteClient);

export default router;
