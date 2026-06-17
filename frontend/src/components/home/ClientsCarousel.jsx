import { motion } from 'framer-motion';
import { useFetch, useInView } from '../../hooks';
import './ClientsCarousel.css';

const fallbackClients = [
  { name: 'Luxury Resorts Intl', logo: 'https://placehold.co/200x80/fff/333?text=Luxury+Resorts' },
  { name: 'National Geographic', logo: 'https://placehold.co/200x80/fff/333?text=Nat+Geo' },
  { name: 'Marriott Hotels', logo: 'https://placehold.co/200x80/fff/333?text=Marriott' },
  { name: 'Four Seasons', logo: 'https://placehold.co/200x80/fff/333?text=Four+Seasons' },
  { name: 'Hilton Worldwide', logo: 'https://placehold.co/200x80/fff/333?text=Hilton' },
  { name: 'Accor Hotels', logo: 'https://placehold.co/200x80/fff/333?text=Accor' },
];

export default function ClientsCarousel() {
  const { data } = useFetch('/clients');
  const clients = data?.length > 0 ? data : fallbackClients;
  const [ref, inView] = useInView();

  return (
    <section className="section clients-section" ref={ref} style={{ background: 'var(--color-gray-50)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="section-title">Trusted By Leading Brands</h2>
          <p className="section-subtitle">Partnering with world-class organizations to deliver extraordinary visual experiences</p>
        </motion.div>

        <div className="clients-section__track">
          <div className="clients-section__logos">
            {[...clients, ...clients].map((client, i) => (
              <div key={i} className="clients-section__item">
                <img src={client.logo} alt={client.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
