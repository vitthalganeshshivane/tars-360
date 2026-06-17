import mongoose from 'mongoose';
import slugify from 'slugify';

const video360Schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: String, default: '0:00' },
  views: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  location: { type: String, default: '' },
  country: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

video360Schema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

video360Schema.index({ title: 'text', description: 'text', location: 'text' });

export default mongoose.model('Video360', video360Schema);
