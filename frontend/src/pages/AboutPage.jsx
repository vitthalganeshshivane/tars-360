import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';
import { useFetch, useInView } from '../hooks';
import SEO from '../components/common/SEO';
import './AboutPage.css';

export default function AboutPage() {
  const { data: settings } = useFetch('/settings');
  const [ref] = useInView();

  return (
    <>
      <SEO title="About Us" description="Learn about TARS 360° — our story, mission, and the team behind premium immersive experiences." />
      <div className="about-page">
        <div className="about-page__hero">
          <div className="container">
            <h1>About TARS 360°</h1>
            <p>Redefining visual storytelling through immersive technology</p>
          </div>
        </div>

        <section className="section" ref={ref}>
          <div className="container">
            <div className="about-page__story">
              <div className="about-page__story-text">
                <span className="badge badge-secondary">Our Story</span>
                <h2>{settings?.aboutTitle || 'Crafting Immersive Experiences Since 2018'}</h2>
                <p>{settings?.aboutDescription || 'TARS 360° was born from a passion for capturing the world in its full glory. What started as a small team of photography enthusiasts has grown into a global leader in immersive visual content. We combine cutting-edge technology with artistic vision to create experiences that transport viewers to extraordinary locations.'}</p>
                <p>Our work spans across continents — from the peaks of the Himalayas to the depths of the Pacific Ocean, from ancient historical monuments to modern architectural marvels. Every project we undertake is a new adventure, a new story waiting to be told in 360 degrees.</p>
              </div>
              <div className="about-page__story-image">
                <img src={settings?.aboutImage || 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80'} alt="Our Story" />
              </div>
            </div>
          </div>
        </section>

        <section className="about-page__values" style={{ background: 'var(--color-gray-50)' }}>
          <div className="container">
            <div className="about-page__values-grid">
              <div className="about-page__value">
                <div className="about-page__value-icon"><FiTarget size={28} /></div>
                <h3>Mission</h3>
                <p>{settings?.mission || 'To revolutionize visual storytelling through immersive 360° photography, virtual tours, and cinematic drone videography that captivates and inspires.'}</p>
              </div>
              <div className="about-page__value">
                <div className="about-page__value-icon"><FiEye size={28} /></div>
                <h3>Vision</h3>
                <p>{settings?.vision || 'To become the global standard for immersive visual experiences, making the world accessible to everyone through technology and creativity.'}</p>
              </div>
              <div className="about-page__value">
                <div className="about-page__value-icon"><FiHeart size={28} /></div>
                <h3>Passion</h3>
                <p>We are driven by an unwavering passion for excellence. Every pixel, every frame, every virtual experience is crafted with meticulous attention to detail.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">The creative minds behind every extraordinary experience</p>
            <div className="about-page__team-photo">
              <img src={settings?.teamPhoto || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80'} alt="Our Team" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
