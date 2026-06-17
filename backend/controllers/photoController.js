import Photo360 from '../models/Photo360.js';
import { asyncHandler, APIFeatures, buildPagination } from '../utils/helpers.js';

// @desc    Get all photos (public)
// @route   GET /api/photos
export const getPhotos = asyncHandler(async (req, res) => {
  const total = await Photo360.countDocuments({ isActive: true, ...req.query.category && { category: req.query.category }, ...req.query.featured && { featured: req.query.featured === 'true' } });
  const features = new APIFeatures(Photo360.find().populate('category', 'name slug'), req.query).filter().search().sort().paginate();
  const photos = await features.query;

  const pagination = buildPagination(total, features.page, features.limit);
  res.json({ success: true, data: photos, ...pagination, pagination });
});

// @desc    Get single photo by slug
// @route   GET /api/photos/:slug
export const getPhotoBySlug = asyncHandler(async (req, res) => {
  const photo = await Photo360.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug');
  if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });

  // Increment views
  photo.views += 1;
  await photo.save({ validateBeforeSave: false });

  // Get related photos
  const related = await Photo360.find({ category: photo.category, _id: { $ne: photo._id }, isActive: true }).limit(6);

  res.json({ success: true, data: photo, related });
});

// @desc    Get featured photos
// @route   GET /api/photos/featured
export const getFeaturedPhotos = asyncHandler(async (req, res) => {
  const photos = await Photo360.find({ featured: true, isActive: true }).populate('category', 'name slug').sort('-createdAt').limit(8);
  res.json({ success: true, data: photos });
});

// --- ADMIN ---

// @desc    Create photo (admin)
// @route   POST /api/photos
export const createPhoto = asyncHandler(async (req, res) => {
  const photo = await Photo360.create(req.body);
  res.status(201).json({ success: true, data: photo });
});

// @desc    Update photo (admin)
// @route   PUT /api/photos/:id
export const updatePhoto = asyncHandler(async (req, res) => {
  const photo = await Photo360.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });
  res.json({ success: true, data: photo });
});

// @desc    Delete photo (admin)
// @route   DELETE /api/photos/:id
export const deletePhoto = asyncHandler(async (req, res) => {
  const photo = await Photo360.findByIdAndDelete(req.params.id);
  if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });
  res.json({ success: true, message: 'Photo deleted' });
});

// @desc    Get all photos (admin - includes inactive)
// @route   GET /api/photos/admin/all
export const getAllPhotosAdmin = asyncHandler(async (req, res) => {
  const total = await Photo360.countDocuments();
  const features = new APIFeatures(Photo360.find().populate('category', 'name slug'), { ...req.query, showAll: true }).filter().sort().paginate();
  const photos = await features.query;
  const pagination = buildPagination(total, features.page, features.limit);
  res.json({ success: true, data: photos, ...pagination, pagination });
});
