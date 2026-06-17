import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiEye, FiMapPin, FiClock, FiArrowLeft } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Skeleton from '../components/common/Skeleton';
import Video360Viewer from '../components/common/Video360Viewer';
import API from '../api/axios';
import { formatNumber, getEmbedUrl, isDirectVideoUrl, isEmbeddableVideoUrl } from '../utils/helpers';
import './VideoDetail.css';

export default function VideoDetail() {
  const { slug } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/videos/${slug}`);
        setVideo(data.data || data);
        const { data: relData } = await API.get('/videos', { params: { limit: 4 } });
        setRelated((relData.data || []).filter((v) => v.slug !== slug).slice(0, 4));
      } catch { setVideo(null); }
      finally { setLoading(false); }
    };
    fetchVideo();
  }, [slug]);

  if (loading) return <div style={{ paddingTop: 140 }} className="container"><Skeleton type="image" /></div>;
  if (!video) return <div style={{ paddingTop: 140, textAlign: 'center', minHeight: '60vh' }} className="container"><h2>Video not found</h2></div>;

  return (
    <>
      <SEO title={video.title} description={video.description} image={video.thumbnail} />
      <div className="video-detail">
        <div className="video-detail__header"><div className="container"><Link to="/videos" className="video-detail__back"><FiArrowLeft size={18} /> Back to Videos</Link></div></div>

        <div className="container">
          <div className="video-detail__player">
            {isDirectVideoUrl(video.videoUrl) ? (
              <Video360Viewer
                videoUrl={video.videoUrl}
                poster={video.thumbnail}
                title={video.title}
              />
            ) : isEmbeddableVideoUrl(video.videoUrl) ? (
              <div className="video-detail__embed">
                <iframe
                  src={getEmbedUrl(video.videoUrl)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : video.videoUrl ? (
              <video
                className="video-detail__native-video"
                src={video.videoUrl}
                poster={video.thumbnail}
                controls
                playsInline
              />
            ) : (
              <div className="video-detail__placeholder">
                <img src={video.thumbnail} alt={video.title} />
                <div className="video-detail__play-btn">▶</div>
              </div>
            )}
          </div>

          <div className="video-detail__layout">
            <div className="video-detail__info">
              <h1>{video.title}</h1>
              <div className="video-detail__meta">
                <span><FiEye size={16} /> {formatNumber(video.views)} views</span>
                <span><FiClock size={16} /> {video.duration || '3:45'}</span>
                <span><FiMapPin size={16} /> {video.location}, {video.country}</span>
              </div>
              {video.description && <div className="video-detail__desc"><h3>About This Video</h3><p>{video.description}</p></div>}
              {video.tags?.length > 0 && (
                <div className="video-detail__tags">
                  {video.tags.map((tag, i) => <span key={i} className="badge badge-primary">{tag}</span>)}
                </div>
              )}
            </div>

            <div className="video-detail__sidebar">
              <h3>Related Videos</h3>
              {related.map((r) => (
                <Link key={r._id} to={`/videos/${r.slug}`} className="video-detail__related-item">
                  <img src={r.thumbnail} alt={r.title} />
                  <div>
                    <h4>{r.title}</h4>
                    <p><FiMapPin size={12} /> {r.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
