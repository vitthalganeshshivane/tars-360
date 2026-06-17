import { Router } from 'express';
import { getPhotos, getPhotoBySlug, getFeaturedPhotos, createPhoto, updatePhoto, deletePhoto, getAllPhotosAdmin } from '../controllers/photoController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/featured', getFeaturedPhotos);
router.get('/', getPhotos);

// Admin
router.get('/admin/all', protect, adminOnly, getAllPhotosAdmin);
router.post('/', protect, adminOnly, createPhoto);
router.put('/:id', protect, adminOnly, updatePhoto);
router.delete('/:id', protect, adminOnly, deletePhoto);

router.get('/:slug', getPhotoBySlug);

export default router;
