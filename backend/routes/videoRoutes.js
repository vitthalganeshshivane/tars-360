import { Router } from 'express';
import { getVideos, getVideoBySlug, getFeaturedVideos, createVideo, updateVideo, deleteVideo, getAllVideosAdmin } from '../controllers/videoController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/featured', getFeaturedVideos);
router.get('/', getVideos);

router.get('/admin/all', protect, adminOnly, getAllVideosAdmin);
router.post('/', protect, adminOnly, createVideo);
router.put('/:id', protect, adminOnly, updateVideo);
router.delete('/:id', protect, adminOnly, deleteVideo);

router.get('/:slug', getVideoBySlug);

export default router;
