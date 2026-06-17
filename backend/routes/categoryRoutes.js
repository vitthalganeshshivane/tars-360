import { Router } from 'express';
import { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory, getAllCategoriesAdmin } from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getCategories);

router.get('/admin/all', protect, adminOnly, getAllCategoriesAdmin);
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

router.get('/:slug', getCategoryBySlug);

export default router;
