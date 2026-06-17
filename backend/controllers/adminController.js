import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/helpers.js';
import User from '../models/User.js';
import Photo360 from '../models/Photo360.js';
import Video360 from '../models/Video360.js';
import VirtualTour from '../models/VirtualTour.js';
import GalleryImage from '../models/GalleryImage.js';
import Contact from '../models/Contact.js';

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
export const uploadFile = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(500).json({
      success: false,
      message: 'Cloudinary is not configured. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env, then restart the backend server.',
    });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded. Make sure you are sending a multipart/form-data request with a field named "file".' });
  }

  const folder = req.body.folder || 'tars360/general';
  const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

  const MAX_DIRECT_UPLOAD = 10 * 1024 * 1024;
  const isLarge = req.file.size > MAX_DIRECT_UPLOAD;

  let result;
  try {
    if (isLarge) {
      const fs = await import('fs/promises');
      const os = await import('os');
      const path = await import('path');
      const tmpFile = path.join(os.tmpdir(), `upload_${Date.now()}_${req.file.originalname}`);
      await fs.writeFile(tmpFile, req.file.buffer);
      try {
        result = await cloudinary.uploader.upload_large(tmpFile, {
          folder,
          resource_type: resourceType,
          quality: 'auto',
          fetch_format: 'auto',
        });
      } finally {
        await fs.unlink(tmpFile).catch(() => {});
      }
    } else {
      result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: resourceType, quality: 'auto', fetch_format: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    }
  } catch (cloudinaryError) {
    console.error('Cloudinary upload error:', cloudinaryError);
    return res.status(500).json({
      success: false,
      message: `Cloudinary upload failed: ${cloudinaryError.message || 'Unknown error'}`,
      detail: cloudinaryError.http_code ? `HTTP ${cloudinaryError.http_code}` : undefined,
    });
  }

  res.json({
    success: true,
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      resourceType: result.resource_type,
    },
  });
});

// @desc    Delete file from Cloudinary
// @route   DELETE /api/upload/:publicId
export const deleteFile = asyncHandler(async (req, res) => {
  const publicId = req.params[0];
  if (!publicId) {
    return res.status(400).json({ success: false, message: 'Cloudinary publicId is required' });
  }
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'File deleted' });
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [photos, videos, tours, gallery, users, contacts, newContacts] = await Promise.all([
    Photo360.countDocuments(),
    Video360.countDocuments(),
    VirtualTour.countDocuments(),
    GalleryImage.countDocuments(),
    User.countDocuments(),
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'new' }),
  ]);

  res.json({
    success: true,
    data: { photos, videos, tours, gallery, users, contacts, newContacts },
  });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ success: true, data: users });
});

// @desc    Update user role (admin)
// @route   PUT /api/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role, isActive }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

// @desc    Global search
// @route   GET /api/search?q=term
export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, data: { photos: [], videos: [], tours: [] } });

  const [photos, videos, tours] = await Promise.all([
    Photo360.find({ $text: { $search: q }, isActive: true }).limit(5).select('title slug thumbnail location'),
    Video360.find({ $text: { $search: q }, isActive: true }).limit(5).select('title slug thumbnail location'),
    VirtualTour.find({ $or: [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }], isActive: true }).limit(5).select('title slug coverImage location'),
  ]);

  res.json({ success: true, data: { photos, videos, tours } });
});
