import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiMapPin, FiNavigation, FiSearch } from 'react-icons/fi';
import { useFetch } from '../hooks';
import { formatNumber } from '../utils/helpers';
import SEO from '../components/common/SEO';
import Skeleton from '../components/common/Skeleton';
import API from '../api/axios';
import './ToursPage.css';

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { data: categories } = useFetch('/categories', { type: 'tour' });

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (category) params.category = category;
        if (search) params.search = search;
        const { data } = await API.get('/tours', { params });
        if (!cancelled) { setTours(data.data || []); setPagination(data.pagination); }
      } catch { if (!cancelled) setTours([]); }
      finally { if (!cancelled) setLoading(false); }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, category, search]);

  return (
    <>
      <SEO title="Virtual Tours" description="Immersive virtual tours of hotels, resorts, museums, and real estate properties." />
      <div className="tours-page">
        <div className="tours-page__header">
          <div className="container"><h1>Virtual Tours</h1><p>Step inside extraordinary destinations with immersive virtual experiences</p></div>
        </div>
        <div className="container">
          <div className="tours-page__toolbar">
            <form className="tours-page__search" onSubmit={(e) => { e.preventDefault(); setPage(1); }}>
              <FiSearch size={18} />
              <input type="text" placeholder="Search tours..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </form>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              <option value="">All Tour Types</option>
              {(categories || []).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="tours-page__grid"><Skeleton type="card" count={6} /></div>
          ) : tours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80 }}><h3>No tours found</h3></div>
          ) : (
            <div className="tours-page__grid">
              {tours.map((tour, i) => (
                <motion.div key={tour._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/tours/${tour.slug}`} className="tours-page__card card">
                    <div className="tours-page__thumb">
                      <img src={tour.coverImage} alt={tour.title} loading="lazy" />
                      <div className="tours-page__badge"><FiNavigation size={12} /> Virtual Tour</div>
                      <div className="tours-page__overlay"><span className="btn btn-sm btn-primary">Start Tour</span></div>
                    </div>
                    <div className="tours-page__body">
                      <h3>{tour.title}</h3>
                      <p><FiMapPin size={14} /> {tour.location}, {tour.country}</p>
                      <div className="tours-page__meta">
                        <span><FiEye size={14} /> {formatNumber(tour.views)} views</span>
                        {tour.category && <span className="badge badge-secondary">{tour.category.name}</span>}
                      </div>
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
