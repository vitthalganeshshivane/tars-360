import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useFetch, useInView } from '../../hooks';
import './TestimonialsSection.css';

const fallbackTestimonials = [
  { name: 'Sarah Mitchell', role: 'Director of Marketing', company: 'Luxury Resorts Intl', content: 'TARS 360° transformed our property listings. The virtual tours increased our booking conversion by 40%. The quality is absolutely world-class.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'James Chen', role: 'CEO', company: 'Asia Pacific Tourism', content: 'The drone cinematography exceeded all expectations. Their team delivered a cinematic experience that truly captures the essence of our destinations.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Maria Rodriguez', role: 'Real Estate Developer', company: 'Rodriguez Properties', content: 'Our pre-construction sales doubled after implementing TARS 360° virtual tours. The immersive experience gives buyers confidence to purchase off-plan.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'David Thompson', role: 'Creative Director', company: 'National Geographic', content: 'Working with TARS 360° has been exceptional. Their 360° photography captures moments and places in ways that traditional photography simply cannot.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=8' },
];

export default function TestimonialsSection() {
  const { data } = useFetch('/testimonials');
  const testimonials = data?.length > 0 ? data : fallbackTestimonials;
  const [current, setCurrent] = useState(0);
  const [ref, inView] = useInView();

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section testimonials" ref={ref}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="badge badge-gold" style={{ margin: '0 auto 16px' }}>Client Stories</span>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Hear from the industry leaders who trust us with their most important visual projects</p>
        </motion.div>

        <div className="testimonials__wrapper">
          <button className="testimonials__nav" onClick={prev}><FiChevronLeft size={20} /></button>

          <motion.div
            key={current}
            className="testimonials__card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="testimonials__content" style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--color-gray-700)', marginBottom: 20, fontStyle: 'italic' }}>"{testimonials[current]?.content}"</p>
            <div className="testimonials__stars">
              {Array.from({ length: testimonials[current]?.rating || 5 }).map((_, i) => (
                <FiStar key={i} size={16} fill="var(--color-accent)" color="var(--color-accent)" />
              ))}
            </div>
            <div className="testimonials__author">
              <img src={testimonials[current]?.avatar || 'https://i.pravatar.cc/150'} alt={testimonials[current]?.name} />
              <div>
                <h4>{testimonials[current]?.name}</h4>
                <p>{testimonials[current]?.role} at {testimonials[current]?.company}</p>
              </div>
            </div>
          </motion.div>

          <button className="testimonials__nav" onClick={next}><FiChevronRight size={20} /></button>
        </div>

        <div className="testimonials__dots">
          {testimonials.map((_, i) => (
            <button key={i} className={`testimonials__dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
