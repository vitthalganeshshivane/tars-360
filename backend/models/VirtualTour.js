import mongoose from 'mongoose';
import slugify from 'slugify';

const virtualTourSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  coverImage: { type: String, required: true },
  tourUrl: { type: String, default: '' },
  panoramaImages: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  location: { type: String, default: '' },
  country: { type: String, default: '' },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  hotspots: [{
    pitch: Number,
    yaw: Number,
    text: String,
    targetScene: String,
  }],
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

virtualTourSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

export default mongoose.model('VirtualTour', virtualTourSchema);
