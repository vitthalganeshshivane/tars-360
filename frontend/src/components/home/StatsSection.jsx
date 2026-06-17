import { motion } from 'framer-motion';
import { FiCamera, FiGlobe, FiImage, FiUsers } from 'react-icons/fi';
import { useCounter, useInView } from '../../hooks';
import './StatsSection.css';

const stats = [
  { icon: <FiCamera size={32} />, end: 1250, label: 'Projects Completed', suffix: '+' },
  { icon: <FiGlobe size={32} />, end: 85, label: 'Countries Covered', suffix: '+' },
  { icon: <FiImage size={32} />, end: 50000, label: 'Photos Captured', suffix: '+' },
  { icon: <FiUsers size={32} />, end: 800, label: 'Happy Clients', suffix: '+' },
];

export default function StatsSection() {
  const [ref, inView] = useInView();

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-section__bg" />
      <div className="container">
        <div className="stats-section__grid">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat, index, inView }) {
  const [counterRef, count] = useCounter(stat.end, 2000, inView);
  return (
    <motion.div
      ref={counterRef}
      className="stats-section__item"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="stats-section__icon">{stat.icon}</div>
      <div className="stats-section__number">{count.toLocaleString()}{stat.suffix}</div>
      <div className="stats-section__label">{stat.label}</div>
    </motion.div>
  );
}
