import mongoose from 'mongoose';
import slugify from 'slugify';

const photo360Schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, required: true },
  panoramaImage: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  location: { type: String, default: '' },
  country: { type: String, default: '' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

photo360Schema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

photo360Schema.index({ title: 'text', description: 'text', location: 'text', tags: 'text' });

export default mongoose.model('Photo360', photo360Schema);
