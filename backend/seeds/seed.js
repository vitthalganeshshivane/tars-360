import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Photo360 from '../models/Photo360.js';
import Video360 from '../models/Video360.js';
import VirtualTour from '../models/VirtualTour.js';
import GalleryImage from '../models/GalleryImage.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Client from '../models/Client.js';
import Settings from '../models/Settings.js';

// --- Realistic placeholder images from Unsplash/Picsum ---
const img = (w, h, id) => `https://picsum.photos/seed/${id}/${w}/${h}`;
const pano = (id) => `https://pannellum.org/images/${id}`;

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear all collections
  await Promise.all([
    User.deleteMany(), Category.deleteMany(), Photo360.deleteMany(),
    Video360.deleteMany(), VirtualTour.deleteMany(), GalleryImage.deleteMany(),
    Service.deleteMany(), Testimonial.deleteMany(), Client.deleteMany(), Settings.deleteMany(),
  ]);

  // --- ADMIN USER ---
  const admin = await User.create({
    name: 'TARS Admin',
    email: 'admin@tars360.com',
    password: 'admin123456',
    role: 'admin',
  });
  console.log('✅ Admin user created: admin@tars360.com / admin123456');

  // --- CATEGORIES ---
  const categories = await Category.create([
    { name: 'Nature', type: 'photo', order: 1 },
    { name: 'Travel', type: 'photo', order: 2 },
    { name: 'Architecture', type: 'photo', order: 3 },
    { name: 'Tourism', type: 'photo', order: 4 },
    { name: 'Real Estate', type: 'photo', order: 5 },
    { name: 'Industrial', type: 'photo', order: 6 },
    { name: 'Hospitality', type: 'photo', order: 7 },
    { name: 'Aerial', type: 'video', order: 1 },
    { name: 'Cinematic', type: 'video', order: 2 },
    { name: 'Exploration', type: 'video', order: 3 },
    { name: 'Hotels', type: 'tour', order: 1 },
    { name: 'Resorts', type: 'tour', order: 2 },
    { name: 'Museums', type: 'tour', order: 3 },
    { name: 'Properties', type: 'tour', order: 4 },
    { name: 'Drone', type: 'gallery', order: 1 },
    { name: 'Landscape', type: 'gallery', order: 2 },
    { name: 'Urban', type: 'gallery', order: 3 },
    { name: 'Interiors', type: 'gallery', order: 4 },
  ]);
  console.log(`✅ ${categories.length} categories created`);

  const catMap = {};
  categories.forEach(c => { catMap[c.name] = c._id; });

  // --- 360 PHOTOS ---
  const photoData = [
    { title: 'Swiss Alps Panorama', location: 'Zermatt', country: 'Switzerland', category: catMap['Nature'], tags: ['mountains', 'alps', 'snow'], featured: true },
    { title: 'Santorini Sunset View', location: 'Oia', country: 'Greece', category: catMap['Travel'], tags: ['sunset', 'island', 'mediterranean'], featured: true },
    { title: 'Tokyo Tower Night', location: 'Minato', country: 'Japan', category: catMap['Architecture'], tags: ['cityscape', 'night', 'tower'], featured: true },
    { title: 'Grand Canyon Vista', location: 'Arizona', country: 'USA', category: catMap['Nature'], tags: ['canyon', 'desert', 'geological'], featured: true },
    { title: 'Dubai Marina Skyline', location: 'Dubai Marina', country: 'UAE', category: catMap['Architecture'], tags: ['skyscrapers', 'luxury', 'night'], featured: true },
    { title: 'Bali Rice Terraces', location: 'Ubud', country: 'Indonesia', category: catMap['Tourism'], tags: ['rice', 'tropical', 'green'], featured: true },
    { title: 'Northern Lights Iceland', location: 'Jökulsárlón', country: 'Iceland', category: catMap['Nature'], tags: ['aurora', 'night', 'ice'], featured: true },
    { title: 'Taj Mahal Gardens', location: 'Agra', country: 'India', category: catMap['Travel'], tags: ['monument', 'heritage', 'marble'], featured: true },
    { title: 'Maldives Overwater Villa', location: 'Malé Atoll', country: 'Maldives', category: catMap['Hospitality'], tags: ['resort', 'ocean', 'luxury'] },
    { title: 'Colosseum Interior', location: 'Rome', country: 'Italy', category: catMap['Travel'], tags: ['ancient', 'roman', 'history'] },
    { title: 'Machu Picchu Ruins', location: 'Cusco Region', country: 'Peru', category: catMap['Travel'], tags: ['inca', 'ruins', 'mountains'] },
    { title: 'Great Barrier Reef', location: 'Queensland', country: 'Australia', category: catMap['Nature'], tags: ['underwater', 'coral', 'ocean'] },
    { title: 'Luxury Penthouse NYC', location: 'Manhattan', country: 'USA', category: catMap['Real Estate'], tags: ['penthouse', 'luxury', 'skyline'] },
    { title: 'Industrial Warehouse', location: 'Detroit', country: 'USA', category: catMap['Industrial'], tags: ['warehouse', 'factory', 'documentation'] },
    { title: 'Kyoto Bamboo Grove', location: 'Arashiyama', country: 'Japan', category: catMap['Nature'], tags: ['bamboo', 'forest', 'zen'] },
    { title: 'Petra Treasury View', location: 'Wadi Musa', country: 'Jordan', category: catMap['Travel'], tags: ['ancient', 'rock', 'desert'] },
    { title: 'Venice Grand Canal', location: 'Venice', country: 'Italy', category: catMap['Travel'], tags: ['canal', 'boats', 'historic'] },
    { title: 'Sahara Desert Dunes', location: 'Merzouga', country: 'Morocco', category: catMap['Nature'], tags: ['desert', 'dunes', 'sand'] },
    { title: 'Angkor Wat Sunrise', location: 'Siem Reap', country: 'Cambodia', category: catMap['Travel'], tags: ['temple', 'sunrise', 'ancient'] },
    { title: 'Niagara Falls Power', location: 'Ontario', country: 'Canada', category: catMap['Nature'], tags: ['waterfall', 'mist', 'power'] },
  ];

  const photos = await Photo360.create(
    photoData.map((p, i) => ({
      ...p,
      description: `Immerse yourself in this stunning 360° panoramic view of ${p.title}. Experience the breathtaking beauty of ${p.location}, ${p.country} as if you were standing right there.`,
      thumbnail: img(800, 600, `photo360-${i}`),
      panoramaImage: img(4096, 2048, `pano-${i}`),
      views: Math.floor(Math.random() * 15000) + 500,
      likes: Math.floor(Math.random() * 2000) + 50,
    }))
  );
  console.log(`✅ ${photos.length} 360° photos created`);

  // --- 360 VIDEOS ---
  const videoData = [
    { title: 'Aerial Dubai City Tour', location: 'Dubai', country: 'UAE', category: catMap['Aerial'], duration: '4:32', featured: true },
    { title: 'Iceland Drone Expedition', location: 'Reykjavik', country: 'Iceland', category: catMap['Aerial'], duration: '6:15', featured: true },
    { title: 'New York Skyline Flight', location: 'New York', country: 'USA', category: catMap['Cinematic'], duration: '3:48', featured: true },
    { title: 'Bora Bora Paradise', location: 'Bora Bora', country: 'French Polynesia', category: catMap['Cinematic'], duration: '5:22', featured: true },
    { title: 'Amazon Rainforest Flyover', location: 'Manaus', country: 'Brazil', category: catMap['Exploration'], duration: '7:10', featured: true },
    { title: 'Great Wall Aerial View', location: 'Beijing', country: 'China', category: catMap['Aerial'], duration: '4:55', featured: true },
    { title: 'Swiss Train Journey', location: 'Glacier Express', country: 'Switzerland', category: catMap['Cinematic'], duration: '8:30' },
    { title: 'African Safari 360', location: 'Serengeti', country: 'Tanzania', category: catMap['Exploration'], duration: '6:45' },
    { title: 'Paris From Above', location: 'Paris', country: 'France', category: catMap['Aerial'], duration: '3:20' },
    { title: 'Norwegian Fjords Flight', location: 'Geirangerfjord', country: 'Norway', category: catMap['Cinematic'], duration: '5:55' },
  ];

  const videos = await Video360.create(
    videoData.map((v, i) => ({
      ...v,
      description: `Experience the stunning ${v.title} in immersive 360° video. Fly over ${v.location}, ${v.country} with breathtaking cinematic quality.`,
      thumbnail: img(800, 450, `video360-${i}`),
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      views: Math.floor(Math.random() * 25000) + 1000,
      tags: ['360video', 'immersive', v.country.toLowerCase()],
    }))
  );
  console.log(`✅ ${videos.length} 360° videos created`);

  // --- VIRTUAL TOURS ---
  const tourData = [
    { title: 'Burj Al Arab Royal Suite', location: 'Dubai', country: 'UAE', category: catMap['Hotels'], featured: true },
    { title: 'Four Seasons Bora Bora', location: 'Bora Bora', country: 'French Polynesia', category: catMap['Resorts'], featured: true },
    { title: 'The Louvre Museum', location: 'Paris', country: 'France', category: catMap['Museums'], featured: true },
    { title: 'Manhattan Luxury Penthouse', location: 'New York', country: 'USA', category: catMap['Properties'], featured: true },
    { title: 'Aman Tokyo Suite', location: 'Tokyo', country: 'Japan', category: catMap['Hotels'], featured: true },
    { title: 'Maldives Water Villa', location: 'Malé', country: 'Maldives', category: catMap['Resorts'], featured: true },
    { title: 'British Museum Hall', location: 'London', country: 'UK', category: catMap['Museums'] },
    { title: 'Beverly Hills Mansion', location: 'Los Angeles', country: 'USA', category: catMap['Properties'] },
    { title: 'Ritz Paris Suite', location: 'Paris', country: 'France', category: catMap['Hotels'] },
    { title: 'Santorini Cliff Resort', location: 'Santorini', country: 'Greece', category: catMap['Resorts'] },
  ];

  const tours = await VirtualTour.create(
    tourData.map((t, i) => ({
      ...t,
      description: `Take a virtual walk through ${t.title}. Explore every corner of this stunning ${t.location} location in full 360° interactive experience.`,
      coverImage: img(800, 600, `tour-${i}`),
      panoramaImages: [img(4096, 2048, `tour-pano-${i}-1`), img(4096, 2048, `tour-pano-${i}-2`)],
      views: Math.floor(Math.random() * 10000) + 200,
      tags: ['virtualtour', t.country.toLowerCase()],
    }))
  );
  console.log(`✅ ${tours.length} virtual tours created`);

  // --- GALLERY IMAGES ---
  const galleryData = [];
  const galleryCats = ['Drone', 'Landscape', 'Urban', 'Interiors'];
  const locations = ['Paris', 'Tokyo', 'Dubai', 'New York', 'Bali', 'Santorini', 'Maldives', 'London', 'Rome', 'Sydney'];

  for (let i = 0; i < 30; i++) {
    const cat = galleryCats[i % galleryCats.length];
    galleryData.push({
      title: `${cat} Shot ${i + 1} — ${locations[i % locations.length]}`,
      image: img(800, i % 3 === 0 ? 1200 : i % 3 === 1 ? 800 : 600, `gallery-${i}`),
      category: catMap[cat],
      location: locations[i % locations.length],
      tags: [cat.toLowerCase(), 'photography'],
      featured: i < 8,
      order: i,
    });
  }

  const gallery = await GalleryImage.create(galleryData);
  console.log(`✅ ${gallery.length} gallery images created`);

  // --- SERVICES ---
  const services = await Service.create([
    { title: '360° Photography', shortDescription: 'Immersive spherical photography for any environment', description: 'Our 360° photography service captures every angle of your space with ultra-high-resolution spherical images. Perfect for real estate, tourism, hospitality, and corporate documentation.', icon: 'MdPanorama', features: ['Ultra HD Resolution', 'HDR Processing', 'Interactive Viewing', 'Cloud Hosting'], order: 1, image: img(600, 400, 'svc-1') },
    { title: '360° Video Production', shortDescription: 'Cinematic immersive video experiences', description: 'Create stunning 360° video content that puts your audience at the center of the action. From aerial footage to ground-level experiences, we produce cinema-grade immersive video.', icon: 'MdVideocam', features: ['8K Resolution', 'Spatial Audio', 'Professional Editing', 'VR Compatible'], order: 2, image: img(600, 400, 'svc-2') },
    { title: 'Virtual Tours', shortDescription: 'Interactive walkthrough experiences', description: 'Transform any space into an interactive virtual tour with hotspots, information panels, and seamless navigation. Perfect for hotels, museums, real estate, and commercial properties.', icon: 'MdExplore', features: ['Interactive Hotspots', 'Floor Plans', 'Custom Branding', 'Analytics'], order: 3, image: img(600, 400, 'svc-3') },
    { title: 'Drone Photography', shortDescription: 'Aerial perspectives that elevate your brand', description: 'Capture breathtaking aerial photographs with our professional drone fleet. From real estate to events, our licensed pilots deliver stunning results every time.', icon: 'MdFlightTakeoff', features: ['Licensed Pilots', '4K+ Quality', 'RAW Delivery', 'Regulatory Compliant'], order: 4, image: img(600, 400, 'svc-4') },
    { title: 'Drone Cinematography', shortDescription: 'Cinematic aerial footage for films and marketing', description: 'Professional drone cinematography for film production, commercial advertising, and brand storytelling. Smooth, stabilized footage with cinematic color grading.', icon: 'MdMovie', features: ['Cinema Camera Drones', 'Custom Flight Paths', 'Color Grading', '4K/6K Output'], order: 5, image: img(600, 400, 'svc-5') },
    { title: 'Panoramic Photography', shortDescription: 'Wide-format professional panoramic images', description: 'Ultra-wide panoramic photography for landscapes, architecture, and commercial spaces. Multi-image stitching for maximum resolution and detail.', icon: 'MdPanoramaHorizontal', features: ['Multi-Image Stitching', 'Gigapixel Quality', 'Print Ready', 'Commercial License'], order: 6, image: img(600, 400, 'svc-6') },
  ]);
  console.log(`✅ ${services.length} services created`);

  // --- TESTIMONIALS ---
  const testimonials = await Testimonial.create([
    { name: 'Sarah Mitchell', role: 'Director of Marketing', company: 'Luxury Resorts International', content: 'TARS 360° transformed how we showcase our properties. The virtual tours increased our booking rates by 45%. Absolutely stunning quality and seamless experience.', rating: 5, featured: true, order: 1, avatar: img(200, 200, 'avatar-1') },
    { name: 'James Rodriguez', role: 'Real Estate Developer', company: 'Pinnacle Properties', content: 'The 360° photography and virtual tours have become essential for our listings. Properties with virtual tours sell 30% faster. TARS delivers world-class results every time.', rating: 5, featured: true, order: 2, avatar: img(200, 200, 'avatar-2') },
    { name: 'Dr. Elena Petrova', role: 'Museum Curator', company: 'National Heritage Foundation', content: 'Working with TARS 360° has allowed us to bring our collections to a global audience. The virtual tour of our exhibition has been viewed by millions worldwide.', rating: 5, featured: true, order: 3, avatar: img(200, 200, 'avatar-3') },
    { name: 'Michael Chen', role: 'CEO', company: 'Global Tourism Group', content: 'The drone cinematography and 360° videos produced by TARS have elevated our destination marketing. The immersive content speaks for itself — pure excellence.', rating: 5, featured: true, order: 4, avatar: img(200, 200, 'avatar-4') },
    { name: 'Amara Okonkwo', role: 'Hotel General Manager', company: 'Azure Beach Collection', content: 'Every touchpoint of our guest journey now starts with a TARS 360° experience. From the lobby to the suites, potential guests can explore everything before booking.', rating: 5, featured: true, order: 5, avatar: img(200, 200, 'avatar-5') },
  ]);
  console.log(`✅ ${testimonials.length} testimonials created`);

  // --- CLIENTS ---
  const clients = await Client.create([
    { name: 'Luxury Resorts International', logo: img(200, 80, 'client-1'), order: 1 },
    { name: 'Pinnacle Properties', logo: img(200, 80, 'client-2'), order: 2 },
    { name: 'National Heritage Foundation', logo: img(200, 80, 'client-3'), order: 3 },
    { name: 'Global Tourism Group', logo: img(200, 80, 'client-4'), order: 4 },
    { name: 'Azure Beach Collection', logo: img(200, 80, 'client-5'), order: 5 },
    { name: 'Emirates Hospitality', logo: img(200, 80, 'client-6'), order: 6 },
    { name: 'Skyline Developers', logo: img(200, 80, 'client-7'), order: 7 },
    { name: 'World Museums Alliance', logo: img(200, 80, 'client-8'), order: 8 },
  ]);
  console.log(`✅ ${clients.length} clients created`);

  // --- SETTINGS ---
  await Settings.create({
    siteName: 'TARS 360°',
    siteDescription: 'Premium 360° Photography, Virtual Tours & Drone Cinematography Agency',
    email: 'hello@tars360.com',
    phone: '+1 (555) 360-0000',
    address: '1234 Innovation Drive, Suite 500, San Francisco, CA 94105',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.097!2d-122.419!3d37.774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
    socialLinks: {
      facebook: 'https://facebook.com/tars360',
      instagram: 'https://instagram.com/tars360',
      twitter: 'https://twitter.com/tars360',
      youtube: 'https://youtube.com/tars360',
      linkedin: 'https://linkedin.com/company/tars360',
      vimeo: 'https://vimeo.com/tars360',
    },
    stats: { projectsCompleted: 2500, countriesCovered: 65, photosCaptured: 50000, happyClients: 850 },
    heroSlides: [
      { title: 'Explore The World In 360°', subtitle: 'Immersive Visual Experiences', description: 'Experience breathtaking locations through immersive virtual photography and cinematic drone captures.', image: img(1920, 1080, 'hero-mountains'), ctaPrimary: { text: 'Explore Tours', link: '/tours' }, ctaSecondary: { text: 'Contact Us', link: '/contact' }, order: 1 },
      { title: 'Virtual Tours That Inspire', subtitle: 'Step Inside Any Space', description: 'Walk through luxury hotels, historic museums, and premium properties from anywhere in the world.', image: img(1920, 1080, 'hero-resort'), ctaPrimary: { text: 'View Tours', link: '/tours' }, ctaSecondary: { text: 'Our Services', link: '/#services' }, order: 2 },
      { title: 'Cinematic Drone Experiences', subtitle: 'See The Unseen', description: 'Breathtaking aerial perspectives captured with cinema-grade drone technology and expert pilots.', image: img(1920, 1080, 'hero-drone'), ctaPrimary: { text: 'Watch Videos', link: '/videos' }, ctaSecondary: { text: 'Learn More', link: '/about' }, order: 3 },
      { title: 'Capture Every Angle', subtitle: '360° Photography Excellence', description: 'Ultra-high-resolution spherical photography that transports your audience to any location on earth.', image: img(1920, 1080, 'hero-ocean'), ctaPrimary: { text: 'View Gallery', link: '/photos' }, ctaSecondary: { text: 'Get Quote', link: '/contact' }, order: 4 },
    ],
    aboutTitle: 'Pioneering Immersive Visual Experiences Since 2018',
    aboutDescription: 'TARS 360° is a world-leading immersive media agency specializing in 360° photography, virtual tours, and drone cinematography. We combine cutting-edge technology with artistic vision to create visual experiences that transport, inspire, and engage audiences worldwide.',
    mission: 'To democratize access to the world\'s most extraordinary places through immersive visual technology, making every corner of the globe accessible to everyone.',
    vision: 'To become the global standard for immersive visual content, pioneering new ways for people to experience and connect with the world around them.',
    aboutImage: img(800, 600, 'about-team'),
    team: [
      { name: 'Alexander Frost', role: 'Founder & CEO', avatar: img(400, 400, 'team-1'), bio: 'Former NASA imaging specialist with 15+ years in panoramic photography.' },
      { name: 'Maya Patel', role: 'Creative Director', avatar: img(400, 400, 'team-2'), bio: 'Award-winning visual storyteller. Previously at National Geographic.' },
      { name: 'Lars Erikson', role: 'Lead Drone Pilot', avatar: img(400, 400, 'team-3'), bio: 'FAA certified commercial pilot with 10,000+ hours of flight time.' },
      { name: 'Sofia Nakamura', role: 'Head of Technology', avatar: img(400, 400, 'team-4'), bio: 'VR/AR pioneer. Built immersive platforms used by millions worldwide.' },
    ],
    ctaBanner: {
      title: 'Ready to Experience the World in 360°?',
      description: 'Let us create stunning immersive content that transforms how your audience sees your spaces, destinations, and brand.',
      buttonText: 'Start Your Project',
      buttonLink: '/contact',
      backgroundImage: img(1920, 800, 'cta-bg'),
    },
    seoKeywords: ['360 photography', 'virtual tours', 'drone photography', 'panoramic photography', 'immersive experience', 'real estate photography'],
    ogImage: img(1200, 630, 'og-image'),
    footerText: '© 2025 TARS 360°. All rights reserved. Premium immersive visual experiences.',
  });
  console.log('✅ Settings created');

  console.log('\n🎉 Seed complete! Database ready.');
  console.log('👤 Admin login: admin@tars360.com / admin123456\n');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
