import mongoose from 'mongoose';
import slugify from 'slugify';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

serviceSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Service', serviceSchema);
