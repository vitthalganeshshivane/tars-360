import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { useFetch, useInView } from '../../hooks';
import { formatNumber } from '../../utils/helpers';
import Skeleton from '../common/Skeleton';
import './FeaturedExperiences.css';

export default function FeaturedExperiences() {
  const { data: photos, loading } = useFetch('/photos/featured');
  const [ref, inView] = useInView();

  return (
    <section className="section featured" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="badge badge-secondary" style={{ margin: '0 auto 16px' }}>Curated Collection</span>
          <h2 className="section-title">Featured 360° Experiences</h2>
          <p className="section-subtitle">Handpicked immersive captures from the most extraordinary locations on Earth</p>
        </motion.div>

        {loading ? (
          <div className="featured__grid"><Skeleton type="card" count={4} /></div>
        ) : (
          <div className="featured__grid">
            {(photos || []).slice(0, 8).map((photo, i) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/photos/${photo.slug}`} className="featured__card card">
                  <div className="featured__card-img">
                    <img src={photo.thumbnail} alt={photo.title} loading="lazy" />
                    <div className="featured__card-badge">
                      <FiEye size={14} /> {formatNumber(photo.views)}
                    </div>
                    <div className="featured__card-overlay">
                      <span className="btn btn-sm btn-primary">Explore 360°</span>
                    </div>
                  </div>
                  <div className="featured__card-body">
                    <h3>{photo.title}</h3>
                    <p className="featured__card-location">
                      <FiMapPin size={14} /> {photo.location}, {photo.country}
                    </p>
                    <div className="featured__card-meta">
                      <span><FiHeart size={14} /> {formatNumber(photo.likes)}</span>
                      {photo.category && <span className="badge badge-secondary">{photo.category.name}</span>}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="featured__cta">
          <Link to="/photos" className="btn btn-outline">
            View All 360° Photos <FiArrowRight size={16} />
          </Link>
          <Link to="/contact" className="btn btn-primary">
            Get Your 360° Photo <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
