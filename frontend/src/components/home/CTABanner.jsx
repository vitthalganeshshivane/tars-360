import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useInView } from '../../hooks';
import './CTABanner.css';

export default function CTABanner() {
  const [ref, inView] = useInView();

  return (
    <section className="cta-banner" ref={ref}>
      <div className="cta-banner__bg" />
      <div className="container">
        <motion.div
          className="cta-banner__content"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="cta-banner__badge">Start Your Project</span>
          <h2>Ready to Create Something Extraordinary?</h2>
          <p>Let's bring your vision to life with immersive 360° photography, cinematic drone footage, and virtual experiences that captivate audiences worldwide.</p>
          <div className="cta-banner__actions">
            <Link to="/contact" className="btn btn-primary btn-lg">Get Started <FiArrowRight size={18} /></Link>
            <Link to="/tours" className="btn btn-secondary btn-lg">View Our Work</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
