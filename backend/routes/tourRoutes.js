import { Router } from 'express';
import { getTours, getTourBySlug, getFeaturedTours, createTour, updateTour, deleteTour, getAllToursAdmin } from '../controllers/tourController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/featured', getFeaturedTours);
router.get('/', getTours);

router.get('/admin/all', protect, adminOnly, getAllToursAdmin);
router.post('/', protect, adminOnly, createTour);
router.put('/:id', protect, adminOnly, updateTour);
router.delete('/:id', protect, adminOnly, deleteTour);

router.get('/:slug', getTourBySlug);

export default router;
