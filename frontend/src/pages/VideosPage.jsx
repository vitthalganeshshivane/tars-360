import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiMapPin, FiPlay, FiClock, FiSearch } from 'react-icons/fi';
import { useFetch } from '../hooks';
import { formatNumber } from '../utils/helpers';
import SEO from '../components/common/SEO';
import Skeleton from '../components/common/Skeleton';
import API from '../api/axios';
import './VideosPage.css';

export default function VideosPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const { data: categories } = useFetch('/categories', { type: 'video' });

  useEffect(() => {
    let cancelled = false;
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort: '-createdAt' };
        if (search) params.search = search;
        if (category) params.category = category;
        const { data } = await API.get('/videos', { params });
        if (!cancelled) { setVideos(data.data || []); setPagination(data.pagination); }
      } catch { if (!cancelled) setVideos([]); }
      finally { if (!cancelled) setLoading(false); }
    };
    fetchVideos();
    return () => { cancelled = true; };
  }, [page, category, search]);

  return (
    <>
      <SEO title="360° Videos" description="Immersive 360° video experiences from stunning locations around the globe." />
      <div className="videos-page">
        <div className="videos-page__header">
          <div className="container">
            <h1>360° Video Library</h1>
            <p>Cinematic immersive video experiences from around the world</p>
          </div>
        </div>
        <div className="container">
          <div className="videos-page__toolbar">
            <form className="videos-page__search" onSubmit={(e) => { e.preventDefault(); setPage(1); }}>
              <FiSearch size={18} />
              <input type="text" placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </form>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              <option value="">All Categories</option>
              {(categories || []).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="videos-page__grid"><Skeleton type="card" count={6} /></div>
          ) : videos.length === 0 ? (
            <div className="videos-page__empty"><h3>No videos found</h3></div>
          ) : (
            <div className="videos-page__grid">
              {videos.map((video, i) => (
                <motion.div key={video._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/videos/${video.slug}`} className="videos-page__card card">
                    <div className="videos-page__thumb">
                      <img src={video.thumbnail} alt={video.title} loading="lazy" />
                      <div className="videos-page__play"><FiPlay size={24} /></div>
                      <div className="videos-page__duration"><FiClock size={12} /> {video.duration || '3:45'}</div>
                      <div className="videos-page__views"><FiEye size={14} /> {formatNumber(video.views)}</div>
                    </div>
                    <div className="videos-page__body">
                      <h3>{video.title}</h3>
                      <p><FiMapPin size={14} /> {video.location}, {video.country}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="videos-page__pagination">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button key={i + 1} className={i + 1 === page ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
