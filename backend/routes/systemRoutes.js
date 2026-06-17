import { Router } from 'express';
import { submitContact, getContacts, updateContactStatus, deleteContact, getSettings, updateSettings } from '../controllers/settingsController.js';
import { uploadFile, deleteFile, getDashboardStats, getUsers, updateUser, deleteUser, globalSearch } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Public
router.post('/contact', submitContact);
router.get('/settings', getSettings);
router.get('/search', globalSearch);

// Admin - Contact management
router.get('/contact/all', protect, adminOnly, getContacts);
router.put('/contact/:id', protect, adminOnly, updateContactStatus);
router.delete('/contact/:id', protect, adminOnly, deleteContact);

// Admin - Settings
router.put('/settings', protect, adminOnly, updateSettings);

// Admin - Dashboard
router.get('/admin/stats', protect, adminOnly, getDashboardStats);

// Admin - Users
router.get('/admin/users', protect, adminOnly, getUsers);
router.put('/admin/users/:id', protect, adminOnly, updateUser);
router.delete('/admin/users/:id', protect, adminOnly, deleteUser);

// Upload
router.post('/upload', protect, adminOnly, upload.single('file'), uploadFile);
router.delete('/upload/*', protect, adminOnly, deleteFile);

export default router;
