import Video360 from '../models/Video360.js';
import { asyncHandler, APIFeatures, buildPagination } from '../utils/helpers.js';

// @desc    Get all videos (public)
// @route   GET /api/videos
export const getVideos = asyncHandler(async (req, res) => {
  const total = await Video360.countDocuments({ isActive: true });
  const features = new APIFeatures(Video360.find().populate('category', 'name slug'), req.query).filter().search().sort().paginate();
  const videos = await features.query;
  const pagination = buildPagination(total, features.page, features.limit);
  res.json({ success: true, data: videos, ...pagination, pagination });
});

// @desc    Get single video by slug
// @route   GET /api/videos/:slug
export const getVideoBySlug = asyncHandler(async (req, res) => {
  const video = await Video360.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug');
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

  video.views += 1;
  await video.save({ validateBeforeSave: false });

  const related = await Video360.find({ category: video.category, _id: { $ne: video._id }, isActive: true }).limit(6);
  res.json({ success: true, data: video, related });
});

// @desc    Get featured videos
// @route   GET /api/videos/featured
export const getFeaturedVideos = asyncHandler(async (req, res) => {
  const videos = await Video360.find({ featured: true, isActive: true }).populate('category', 'name slug').sort('-createdAt').limit(6);
  res.json({ success: true, data: videos });
});

// --- ADMIN ---
export const createVideo = asyncHandler(async (req, res) => {
  const video = await Video360.create(req.body);
  res.status(201).json({ success: true, data: video });
});

export const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video360.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
  res.json({ success: true, data: video });
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video360.findByIdAndDelete(req.params.id);
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
  res.json({ success: true, message: 'Video deleted' });
});

export const getAllVideosAdmin = asyncHandler(async (req, res) => {
  const total = await Video360.countDocuments();
  const features = new APIFeatures(Video360.find().populate('category', 'name slug'), { ...req.query, showAll: true }).filter().sort().paginate();
  const videos = await features.query;
  const pagination = buildPagination(total, features.page, features.limit);
  res.json({ success: true, data: videos, ...pagination, pagination });
});
