import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiEye, FiMapPin, FiArrowLeft, FiNavigation } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Skeleton from '../components/common/Skeleton';
import PanoramaViewer from '../components/common/PanoramaViewer';
import API from '../api/axios';
import { formatNumber, getEmbedUrl } from '../utils/helpers';
import './TourDetail.css';

export default function TourDetail() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/tours/${slug}`);
        setTour(data.data || data);
      } catch { setTour(null); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  if (loading) return <div style={{ paddingTop: 140 }} className="container"><Skeleton type="image" /></div>;
  if (!tour) return <div style={{ paddingTop: 140, textAlign: 'center', minHeight: '60vh' }} className="container"><h2>Tour not found</h2></div>;

  return (
    <>
      <SEO title={tour.title} description={tour.description} image={tour.coverImage} />
      <div className="tour-detail">
        <div className="tour-detail__header"><div className="container"><Link to="/tours" className="tour-detail__back"><FiArrowLeft size={18} /> Back to Tours</Link></div></div>
        <div className="container">
          <div className="tour-detail__viewer">
            {tour.tourUrl ? (
              <iframe src={getEmbedUrl(tour.tourUrl)} title={tour.title} allowFullScreen style={{ width: '100%', height: '600px', border: 'none', borderRadius: 'var(--radius-lg)' }} />
            ) : tour.panoramaImages?.length > 0 ? (
              /* Real 360° interactive viewer for panorama images */
              <PanoramaViewer
                imageUrl={tour.panoramaImages[0]}
                caption={tour.title}
                height="600px"
                autoRotate={true}
              />
            ) : (
              /* Plain cover image fallback */
              <div className="tour-detail__panorama">
                <img src={tour.coverImage} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div className="tour-detail__layout">
            <div className="tour-detail__info">
              <div className="tour-detail__badges">
                <span className="badge badge-secondary"><FiNavigation size={12} /> Virtual Tour</span>
                {tour.category && <span className="badge badge-primary">{tour.category.name}</span>}
              </div>
              <h1>{tour.title}</h1>
              <p className="tour-detail__location"><FiMapPin size={16} /> {tour.location}, {tour.country}</p>
              {tour.description && <div className="tour-detail__desc"><h3>About This Tour</h3><p>{tour.description}</p></div>}
              {tour.tags?.length > 0 && (
                <div className="tour-detail__tags">
                  {tour.tags.map((tag, i) => <span key={i} className="badge badge-primary">{tag}</span>)}
                </div>
              )}
              <div className="tour-detail__stats">
                <span><FiEye size={16} /> {formatNumber(tour.views)} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
