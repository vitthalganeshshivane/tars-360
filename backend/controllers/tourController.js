import VirtualTour from '../models/VirtualTour.js';
import { asyncHandler, APIFeatures, buildPagination } from '../utils/helpers.js';

export const getTours = asyncHandler(async (req, res) => {
  const total = await VirtualTour.countDocuments({ isActive: true });
  const features = new APIFeatures(VirtualTour.find().populate('category', 'name slug'), req.query).filter().sort().paginate();
  const tours = await features.query;
  const pagination = buildPagination(total, features.page, features.limit);
  res.json({ success: true, data: tours, ...pagination, pagination });
});

export const getTourBySlug = asyncHandler(async (req, res) => {
  const tour = await VirtualTour.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug');
  if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
  tour.views += 1;
  await tour.save({ validateBeforeSave: false });
  const related = await VirtualTour.find({ category: tour.category, _id: { $ne: tour._id }, isActive: true }).limit(6);
  res.json({ success: true, data: tour, related });
});

export const getFeaturedTours = asyncHandler(async (req, res) => {
  const tours = await VirtualTour.find({ featured: true, isActive: true }).populate('category', 'name slug').sort('-createdAt').limit(6);
  res.json({ success: true, data: tours });
});

// ADMIN
export const createTour = asyncHandler(async (req, res) => {
  const tour = await VirtualTour.create(req.body);
  res.status(201).json({ success: true, data: tour });
});

export const updateTour = asyncHandler(async (req, res) => {
  const tour = await VirtualTour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
  res.json({ success: true, data: tour });
});

export const deleteTour = asyncHandler(async (req, res) => {
  const tour = await VirtualTour.findByIdAndDelete(req.params.id);
  if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
  res.json({ success: true, message: 'Tour deleted' });
});

export const getAllToursAdmin = asyncHandler(async (req, res) => {
  const total = await VirtualTour.countDocuments();
  const features = new APIFeatures(VirtualTour.find().populate('category', 'name slug'), { ...req.query, showAll: true }).filter().sort().paginate();
  const tours = await features.query;
  const pagination = buildPagination(total, features.page, features.limit);
  res.json({ success: true, data: tours, ...pagination, pagination });
});
