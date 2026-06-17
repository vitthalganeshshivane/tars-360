import { motion } from 'framer-motion';
import { useFetch, useInView } from '../../hooks';
import './ClientsCarousel.css';

const fallbackClients = [
  { name: 'Luxury Resorts Intl', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png' },
  { name: 'National Geographic', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/200px-Airbnb_Logo_B%C3%A9lo.svg.png' },
  { name: 'Marriott Hotels', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png' },
  { name: 'Four Seasons', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png' },
  { name: 'Hilton Worldwide', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Spotify_logo_with_text.svg/200px-Spotify_logo_with_text.svg.png' },
  { name: 'Accor Hotels', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Logo_TeslaMotors.svg/200px-Logo_TeslaMotors.svg.png' },
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
