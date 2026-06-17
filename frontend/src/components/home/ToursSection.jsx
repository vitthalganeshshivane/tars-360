import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiEye, FiArrowRight, FiNavigation } from 'react-icons/fi';
import { useFetch, useInView } from '../../hooks';
import { formatNumber } from '../../utils/helpers';
import Skeleton from '../common/Skeleton';
import './ToursSection.css';

export default function ToursSection() {
  const { data: tours, loading } = useFetch('/tours/featured');
  const [ref, inView] = useInView();

  return (
    <section className="section tours-section" ref={ref} style={{ background: 'var(--color-gray-50)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="badge badge-secondary" style={{ margin: '0 auto 16px' }}>Virtual Exploration</span>
          <h2 className="section-title">Virtual Tours</h2>
          <p className="section-subtitle">Step inside world-class destinations with our immersive virtual tour experiences</p>
        </motion.div>

        {loading ? (
          <div className="tours-section__grid"><Skeleton type="card" count={3} /></div>
        ) : (
          <div className="tours-section__grid">
            {(tours || []).slice(0, 6).map((tour, i) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/tours/${tour.slug}`} className="tours-section__card card">
                  <div className="tours-section__thumb">
                    <img src={tour.coverImage} alt={tour.title} loading="lazy" />
                    <div className="tours-section__badge">
                      <FiNavigation size={12} /> Virtual Tour
                    </div>
                    <div className="tours-section__overlay">
                      <span className="btn btn-sm btn-primary">Start Tour</span>
                    </div>
                  </div>
                  <div className="tours-section__body">
                    <h3>{tour.title}</h3>
                    <p className="tours-section__location"><FiMapPin size={14} /> {tour.location}, {tour.country}</p>
                    <div className="tours-section__meta">
                      <span><FiEye size={14} /> {formatNumber(tour.views)} views</span>
                      {tour.category && <span className="badge badge-secondary">{tour.category.name}</span>}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="tours-section__cta">
          <Link to="/tours" className="btn btn-outline">Explore All Tours <FiArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
