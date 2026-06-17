import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch, useInView } from '../../hooks';
import './GalleryStrip.css';

const categories = ['All', 'Nature', 'Travel', 'Architecture', 'Tourism', 'Industrial'];

export default function GalleryStrip() {
  const [active, setActive] = useState('All');
  const { data: images, loading } = useFetch('/gallery', { category: active === 'All' ? undefined : active, limit: 12 });
  const [ref, inView] = useInView();

  return (
    <section className="section gallery-strip" ref={ref} style={{ background: 'var(--color-gray-50)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="badge badge-gold" style={{ margin: '0 auto 16px' }}>Visual Gallery</span>
          <h2 className="section-title">Stunning Visual Gallery</h2>
          <p className="section-subtitle">A curated showcase of our finest photography and cinematography work</p>
        </motion.div>

        <div className="gallery-strip__filters">
          {categories.map((cat) => (
            <button key={cat} className={`gallery-strip__filter ${active === cat ? 'active' : ''}`} onClick={() => setActive(cat)}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div className="gallery-strip__grid">
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="gallery-strip__item skeleton" />)}
          </div>
        ) : (
          <div className="gallery-strip__grid">
            {(images || []).slice(0, 8).map((img, i) => (
              <motion.div
                key={img._id}
                className="gallery-strip__item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <img src={img.image} alt={img.title} loading="lazy" />
                <div className="gallery-strip__item-overlay">
                  <span>{img.title}</span>
                  {img.location && <small>{img.location}</small>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="gallery-strip__cta">
          <Link to="/gallery" className="btn btn-outline">View Full Gallery <FiArrowRight size={16} /></Link>
          <Link to="/contact" className="btn btn-primary">Get Your 360° Photo <FiArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
