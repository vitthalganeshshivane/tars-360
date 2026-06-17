import GalleryImage from '../models/GalleryImage.js';
import { asyncHandler, APIFeatures, buildPagination } from '../utils/helpers.js';

export const getGalleryImages = asyncHandler(async (req, res) => {
  const total = await GalleryImage.countDocuments({ isActive: true });
  const features = new APIFeatures(GalleryImage.find().populate('category', 'name slug'), req.query).filter().sort().paginate();
  const images = await features.query;
  const pagination = buildPagination(total, features.page, features.limit);
  res.json({ success: true, data: images, ...pagination, pagination });
});

export const createGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.create(req.body);
  res.status(201).json({ success: true, data: image });
});

export const updateGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
  res.json({ success: true, data: image });
});

export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
  res.json({ success: true, message: 'Image deleted' });
});

export const getAllGalleryAdmin = asyncHandler(async (req, res) => {
  const total = await GalleryImage.countDocuments();
  const features = new APIFeatures(GalleryImage.find().populate('category', 'name slug'), { ...req.query, showAll: true }).filter().sort().paginate();
  const images = await features.query;
  const pagination = buildPagination(total, features.page, features.limit);
  res.json({ success: true, data: images, ...pagination, pagination });
});
