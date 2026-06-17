import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMaximize2, FiX } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Skeleton from '../components/common/Skeleton';
import API from '../api/axios';
import './GalleryPage.css';

const categories = ['All', 'Nature', 'Travel', 'Architecture', 'Tourism', 'Industrial'];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { limit: 50 };
        if (active !== 'All') params.category = active;
        const { data } = await API.get('/gallery', { params });
        setImages(data.data || []);
      } catch { setImages([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [active]);

  return (
    <>
      <SEO title="Gallery" description="Stunning visual gallery showcasing our finest photography and cinematography work." />
      <div className="gallery-page">
        <div className="gallery-page__header">
          <div className="container"><h1>Visual Gallery</h1><p>A curated showcase of our finest photographic and cinematic work</p></div>
        </div>
        <div className="container">
          <div className="gallery-page__filters">
            {categories.map((cat) => (
              <button key={cat} className={active === cat ? 'active' : ''} onClick={() => setActive(cat)}>{cat}</button>
            ))}
          </div>

          {loading ? (
            <div className="gallery-page__masonry"><Skeleton type="card" count={8} /></div>
          ) : (
            <div className="gallery-page__masonry">
              {images.map((img, i) => (
                <motion.div
                  key={img._id}
                  className="gallery-page__item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setLightbox(img)}
                >
                  <img src={img.image} alt={img.title} loading="lazy" />
                  <div className="gallery-page__item-overlay">
                    <FiMaximize2 size={20} />
                    <div>
                      <h4>{img.title}</h4>
                      {img.location && <p>{img.location}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {lightbox && (
          <div className="gallery-page__lightbox" onClick={() => setLightbox(null)}>
            <button className="gallery-page__lightbox-close" onClick={() => setLightbox(null)}><FiX size={28} /></button>
            <img src={lightbox.image} alt={lightbox.title} onClick={(e) => e.stopPropagation()} />
            <div className="gallery-page__lightbox-info">
              <h3>{lightbox.title}</h3>
              {lightbox.location && <p>{lightbox.location}</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
