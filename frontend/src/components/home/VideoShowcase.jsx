import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiClock, FiMapPin, FiArrowRight, FiPlay } from 'react-icons/fi';
import { useFetch, useInView } from '../../hooks';
import { formatNumber } from '../../utils/helpers';
import Skeleton from '../common/Skeleton';
import './VideoShowcase.css';

export default function VideoShowcase() {
  const { data: videos, loading } = useFetch('/videos/featured');
  const [ref, inView] = useInView();

  return (
    <section className="section video-showcase" ref={ref}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="badge badge-primary" style={{ margin: '0 auto 16px' }}>Cinematic Experience</span>
          <h2 className="section-title">360° Video Showcase</h2>
          <p className="section-subtitle">Immersive cinematic experiences that transport you to extraordinary destinations</p>
        </motion.div>

        {loading ? (
          <div className="video-showcase__grid"><Skeleton type="card" count={3} /></div>
        ) : (
          <div className="video-showcase__grid">
            {(videos || []).slice(0, 6).map((video, i) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/videos/${video.slug}`} className="video-showcase__card card">
                  <div className="video-showcase__thumb">
                    <img src={video.thumbnail} alt={video.title} loading="lazy" />
                    <div className="video-showcase__play">
                      <FiPlay size={24} />
                    </div>
                    <div className="video-showcase__duration">
                      <FiClock size={12} /> {video.duration || '3:45'}
                    </div>
                    <div className="video-showcase__views">
                      <FiEye size={14} /> {formatNumber(video.views)}
                    </div>
                  </div>
                  <div className="video-showcase__body">
                    <h3>{video.title}</h3>
                    <p className="video-showcase__location"><FiMapPin size={14} /> {video.location}, {video.country}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="video-showcase__cta">
          <Link to="/videos" className="btn btn-outline">View All Videos <FiArrowRight size={16} /></Link>
          <Link to="/contact" className="btn btn-primary">Get Your 360° Video <FiArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
