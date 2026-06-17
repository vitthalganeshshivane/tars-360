import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { useFetch } from '../../hooks';
import './Hero.css';

const fallbackSlides = [
  { title: 'Explore The World In 360°', subtitle: 'Immersive Experiences', description: 'Experience breathtaking locations through immersive virtual photography and cinematic drone captures.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', cta: 'Explore Tours', link: '/tours' },
  { title: 'Discover Ocean Depths', subtitle: 'Underwater Worlds', description: 'Dive into the mesmerizing beauty of underwater landscapes captured in stunning 360° detail.', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80', cta: 'View Gallery', link: '/gallery' },
  { title: 'Aerial Cinematic Mastery', subtitle: 'Drone Perspectives', description: 'Soar above majestic landscapes with our professional drone cinematography services.', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1920&q=80', cta: 'See Drone Work', link: '/videos' },
  { title: 'Luxury Resort Experiences', subtitle: 'Virtual Tours', description: 'Walk through world-class resorts and hotels from the comfort of your home.', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80', cta: 'Virtual Tours', link: '/tours' },
  { title: 'Historic Monuments Reimagined', subtitle: 'Cultural Heritage', description: 'Preserve and explore historical monuments through immersive 360° photography.', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80', cta: 'Explore Heritage', link: '/photos' },
];

export default function Hero() {
  const { data: settings } = useFetch('/settings');
  const slides = settings?.heroSlides?.length > 0
    ? settings.heroSlides.map((s, i) => ({
        title: s.title || fallbackSlides[i]?.title || 'Explore The World',
        subtitle: s.subtitle || fallbackSlides[i]?.subtitle || '360° Experiences',
        description: s.description || fallbackSlides[i]?.description || '',
        image: s.image || fallbackSlides[i]?.image || fallbackSlides[0].image,
        cta: s.cta || fallbackSlides[i]?.cta || 'Explore',
        link: s.link || fallbackSlides[i]?.link || '/photos',
      }))
    : fallbackSlides;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="hero__slide"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero__bg" style={{ backgroundImage: `url(${slides[current].image})` }} />
          <div className="hero__overlay" />
        </motion.div>
      </AnimatePresence>

      <div className="hero__content container">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="hero__text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="hero__subtitle">{slides[current].subtitle}</span>
            <h1 className="hero__title">{slides[current].title}</h1>
            <p className="hero__desc">{slides[current].description}</p>
            <div className="hero__actions">
              <Link to={slides[current].link} className="btn btn-primary btn-lg">
                {slides[current].cta} <FiArrowRight size={18} />
              </Link>
              <Link to="/photos" className="btn btn-secondary btn-lg">
                <FiPlay size={18} /> Watch Reel
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="hero__indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        <div className="hero__scroll">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="hero__scroll-line" />
          </motion.div>
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
