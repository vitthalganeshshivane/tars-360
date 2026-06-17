import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiEye, FiHeart, FiMapPin, FiShare2, FiMaximize, FiArrowLeft } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Skeleton from '../components/common/Skeleton';
import PanoramaViewer from '../components/common/PanoramaViewer';
import API from '../api/axios';
import { formatNumber } from '../utils/helpers';
import './PhotoDetail.css';

export default function PhotoDetail() {
  const { slug } = useParams();
  const [photo, setPhoto] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/photos/${slug}`);
        setPhoto(data.data || data);
        const { data: relData } = await API.get('/photos', { params: { limit: 4 } });
        setRelated((relData.data || []).filter((p) => p.slug !== slug).slice(0, 4));
      } catch { setPhoto(null); }
      finally { setLoading(false); }
    };
    fetchPhoto();
  }, [slug]);

  if (loading) return <div style={{ paddingTop: 140 }} className="container"><Skeleton type="image" /><Skeleton type="text" /></div>;
  if (!photo) return <div style={{ paddingTop: 140, textAlign: 'center', minHeight: '60vh' }} className="container"><h2>Photo not found</h2><Link to="/photos" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Photos</Link></div>;

  return (
    <>
      <SEO title={photo.title} description={photo.description} image={photo.thumbnail} />
      <div className={`photo-detail ${fullscreen ? 'photo-detail--fullscreen' : ''}`}>
        <div className="photo-detail__header">
          <div className="container">
            <Link to="/photos" className="photo-detail__back"><FiArrowLeft size={18} /> Back to Photos</Link>
          </div>
        </div>

        <div className="photo-detail__layout container">
          <div className="photo-detail__viewer">
            {/* Real 360° interactive viewer — WebGL sphere with drag/touch/zoom */}
            <PanoramaViewer
              imageUrl={photo.panoramaImage || photo.thumbnail}
              caption={photo.title}
              height={fullscreen ? '100vh' : '520px'}
              autoRotate={true}
            />
            {/* Share / fullscreen overlay controls */}
            <div className="photo-detail__viewer-controls photo-detail__viewer-controls--float">
              <button onClick={() => setFullscreen(!fullscreen)} title="Toggle fullscreen"><FiMaximize size={18} /></button>
              <button onClick={() => { navigator.share?.({ title: photo.title, url: window.location.href }); }} title="Share"><FiShare2 size={18} /></button>
            </div>
          </div>

          <div className="photo-detail__info">
            <div className="photo-detail__info-inner">
              <div className="photo-detail__meta-top">
                {photo.category && <span className="badge badge-secondary">{photo.category.name}</span>}
                <span className="badge badge-primary"><FiEye size={12} /> {formatNumber(photo.views)}</span>
              </div>
              <h1>{photo.title}</h1>
              <p className="photo-detail__location"><FiMapPin size={16} /> {photo.location}, {photo.country}</p>

              {photo.description && (
                <div className="photo-detail__desc">
                  <h3>About This Photo</h3>
                  <p>{photo.description}</p>
                </div>
              )}

              {photo.tags?.length > 0 && (
                <div className="photo-detail__tags">
                  <h3>Tags</h3>
                  <div className="photo-detail__tags-list">
                    {photo.tags.map((tag, i) => <span key={i} className="badge badge-primary">{tag}</span>)}
                  </div>
                </div>
              )}

              <div className="photo-detail__stats">
                <div><FiEye size={18} /><span>{formatNumber(photo.views)} views</span></div>
                <div><FiHeart size={18} /><span>{formatNumber(photo.likes)} likes</span></div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="photo-detail__related container">
            <h2>Related Photos</h2>
            <div className="photo-detail__related-grid">
              {related.map((r) => (
                <Link key={r._id} to={`/photos/${r.slug}`} className="photo-detail__related-card card">
                  <img src={r.thumbnail} alt={r.title} loading="lazy" />
                  <div className="photo-detail__related-info">
                    <h4>{r.title}</h4>
                    <p><FiMapPin size={12} /> {r.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
