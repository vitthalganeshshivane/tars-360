import { motion } from 'framer-motion';

export function Reveal({ children, className = '', delay = 0, y = 24 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function PremiumCard({ children, className = '' }) {
  return (
    <motion.div
      className={`premium-card ${className}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function GradientText({ children, tone = 'emerald', className = '' }) {
  const toneClass = tone === 'gold' ? 'premium-text-gold' : 'premium-text-emerald';
  return <span className={`${toneClass} ${className}`}>{children}</span>;
}
