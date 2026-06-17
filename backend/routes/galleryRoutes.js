import { Router } from 'express';
import { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage, getAllGalleryAdmin } from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getGalleryImages);

router.get('/admin/all', protect, adminOnly, getAllGalleryAdmin);
router.post('/', protect, adminOnly, createGalleryImage);
router.put('/:id', protect, adminOnly, updateGalleryImage);
router.delete('/:id', protect, adminOnly, deleteGalleryImage);

export default router;
