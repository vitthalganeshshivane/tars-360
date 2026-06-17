import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiMapPin, FiSearch } from 'react-icons/fi';
import { useFetch } from '../hooks';
import { formatNumber } from '../utils/helpers';
import SEO from '../components/common/SEO';
import Skeleton from '../components/common/Skeleton';
import API from '../api/axios';
import './PhotosPage.css';

const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-views', label: 'Most Viewed' },
  { value: '-likes', label: 'Most Liked' },
];

export default function PhotosPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const { data: categories } = useFetch('/categories', { type: 'photo' });

  useEffect(() => {
    let cancelled = false;
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (search) params.search = search;
        if (category) params.category = category;
        const { data } = await API.get('/photos', { params });
        if (!cancelled) {
          setPhotos(data.data || []);
          setPagination(data.pagination);
        }
      } catch { if (!cancelled) setPhotos([]); }
      finally { if (!cancelled) setLoading(false); }
    };
    fetchPhotos();
    return () => { cancelled = true; };
  }, [page, category, sort, search]);

  useEffect(() => { setPage(1); }, [category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>
      <SEO title="360° Photos" description="Explore our collection of stunning 360° panoramic photographs from around the world." />
      <div className="photos-page">
        <div className="photos-page__header">
          <div className="container">
            <h1>360° Photo Collection</h1>
            <p>Explore immersive panoramic photographs from breathtaking destinations worldwide</p>
          </div>
        </div>

        <div className="container">
          <div className="photos-page__toolbar">
            <form className="photos-page__search" onSubmit={handleSearch}>
              <FiSearch size={18} />
              <input type="text" placeholder="Search by location, country..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </form>

            <div className="photos-page__filters">
              <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                <option value="">All Categories</option>
                {(categories || []).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="photos-page__grid"><Skeleton type="card" count={8} /></div>
          ) : photos.length === 0 ? (
            <div className="photos-page__empty"><h3>No photos found</h3><p>Try adjusting your search or filters</p></div>
          ) : (
            <div className="photos-page__grid">
              {photos.map((photo, i) => (
                <motion.div key={photo._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/photos/${photo.slug}`} className="photos-page__card card">
                    <div className="photos-page__card-img">
                      <img src={photo.thumbnail} alt={photo.title} loading="lazy" />
                      <div className="photos-page__card-badge"><FiEye size={14} /> {formatNumber(photo.views)}</div>
                      <div className="photos-page__card-overlay"><span className="btn btn-sm btn-primary">View 360°</span></div>
                    </div>
                    <div className="photos-page__card-body">
                      <h3>{photo.title}</h3>
                      <p><FiMapPin size={14} /> {photo.location}, {photo.country}</p>
                      <div className="photos-page__card-meta">
                        <span><FiHeart size={14} /> {formatNumber(photo.likes)}</span>
                        {photo.category && <span className="badge badge-secondary">{photo.category.name}</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="photos-page__pagination">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button key={i + 1} className={`photos-page__page ${i + 1 === page ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
