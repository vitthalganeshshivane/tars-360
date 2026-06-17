import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  ctaPrimary: { text: String, link: String },
  ctaSecondary: { text: String, link: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { _id: true });

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'TARS 360°' },
  siteDescription: { type: String, default: 'Premium 360° Photography & Virtual Tour Agency' },
  logo: { type: String, default: '' },
  logoDark: { type: String, default: '' },
  favicon: { type: String, default: '' },

  // Hero Slides
  heroSlides: [heroSlideSchema],

  // Contact Info
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  mapEmbedUrl: { type: String, default: '' },

  // Social Links
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    vimeo: { type: String, default: '' },
  },

  // Stats
  stats: {
    projectsCompleted: { type: Number, default: 500 },
    countriesCovered: { type: Number, default: 45 },
    photosCaptured: { type: Number, default: 10000 },
    happyClients: { type: Number, default: 200 },
  },

  // About page
  aboutTitle: { type: String, default: '' },
  aboutDescription: { type: String, default: '' },
  mission: { type: String, default: '' },
  vision: { type: String, default: '' },
  aboutImage: { type: String, default: '' },
  teamPhoto: { type: String, default: '' },

  // CTA Banner
  ctaBanner: {
    title: { type: String, default: 'Ready to Experience the World in 360°?' },
    description: { type: String, default: '' },
    buttonText: { type: String, default: 'Get Started' },
    buttonLink: { type: String, default: '/contact' },
    backgroundImage: { type: String, default: '' },
  },

  // SEO
  seoKeywords: [{ type: String }],
  ogImage: { type: String, default: '' },

  // Footer
  footerText: { type: String, default: '© 2025 TARS 360°. All rights reserved.' },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
