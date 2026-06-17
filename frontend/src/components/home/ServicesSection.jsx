import { motion } from 'framer-motion';
import { FiCamera, FiVideo, FiSend, FiNavigation, FiImage, FiHome } from 'react-icons/fi';
import { useFetch, useInView } from '../../hooks';
import './ServicesSection.css';

const defaultServices = [
  { icon: <FiCamera size={28} />, title: '360° Photography', desc: 'Immersive spherical photography for virtual experiences and documentation.' },
  { icon: <FiVideo size={28} />, title: '360° Video Production', desc: 'Cinematic 360-degree video production for storytelling and marketing.' },
  { icon: <FiNavigation size={28} />, title: 'Drone Coverage', desc: 'Professional aerial photography and cinematography with cutting-edge drones.' },
  { icon: <FiSend size={28} />, title: 'Virtual Tours', desc: 'Interactive virtual tours for real estate, hospitality, and tourism.' },
  { icon: <FiImage size={28} />, title: 'Panoramic Photography', desc: 'Ultra-high-resolution panoramic captures for large-scale visual projects.' },
  { icon: <FiHome size={28} />, title: 'Real Estate Marketing', desc: 'Complete visual marketing solutions for properties and developments.' },
];

const iconMap = {
  camera: <FiCamera size={28} />,
  video: <FiVideo size={28} />,
  drone: <FiNavigation size={28} />,
  navigation: <FiNavigation size={28} />,
  tour: <FiSend size={28} />,
  image: <FiImage size={28} />,
  home: <FiHome size={28} />,
};

export default function ServicesSection() {
  const { data } = useFetch('/services');
  const services = data?.length > 0 ? data : defaultServices;
  const [ref, inView] = useInView();

  return (
    <section className="section services-section" ref={ref}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="badge badge-primary" style={{ margin: '0 auto 16px' }}>What We Do</span>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">End-to-end immersive visual solutions for industries that demand excellence</p>
        </motion.div>

        <div className="services-section__grid">
          {services.map((service, i) => (
            <motion.div
              key={service._id || i}
              className="services-section__card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="services-section__icon">
                {typeof service.icon === 'string' ? iconMap[service.icon] || <FiCamera size={28} /> : service.icon || <FiCamera size={28} />}
              </div>
              <h3>{service.title}</h3>
              <p>{service.shortDescription || service.desc}</p>
              <div className="services-section__line" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
