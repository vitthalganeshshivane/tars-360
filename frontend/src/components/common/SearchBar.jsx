import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiX } from 'react-icons/hi';
import { useUIStore } from '../../stores';
import { useDebounce } from '../../hooks';
import API from '../../api/axios';
import './SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ photos: [], videos: [], tours: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { toggleSearch } = useUIStore();
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults({ photos: [], videos: [], tours: [] }); return; }
    const search = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/search', { params: { q: debouncedQuery } });
        setResults(data.data || data);
      } catch (err) {
        console.warn('Search failed', err);
        setResults({ photos: [], videos: [], tours: [] });
      }
      finally { setLoading(false); }
    };
    search();
  }, [debouncedQuery]);

  const handleSelect = (type, slug) => {
    toggleSearch();
    navigate(`/${type}/${slug}`);
  };

  const totalResults = results.photos.length + results.videos.length + results.tours.length;

  return (
    <motion.div
      className="search-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={toggleSearch}
    >
      <motion.div
        className="search-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-bar__input-wrapper">
          <HiSearch size={22} className="search-bar__icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-bar__input"
            placeholder="Search 360° photos, videos, virtual tours..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-bar__close" onClick={toggleSearch}>
            <HiX size={22} />
          </button>
        </div>

        {query.length >= 2 && (
          <div className="search-bar__results">
            {loading ? (
              <div className="search-bar__loading">
                <div className="skeleton" style={{ height: 40, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 40, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 40 }} />
              </div>
            ) : totalResults === 0 ? (
              <p className="search-bar__empty">No results found for "{query}"</p>
            ) : (
              <>
                {results.photos.length > 0 && (
                  <div className="search-bar__group">
                    <h4>360° Photos</h4>
                    {results.photos.slice(0, 3).map((p) => (
                      <button key={p._id} className="search-bar__item" onClick={() => handleSelect('photos', p.slug)}>
                        <img src={p.thumbnail} alt={p.title} />
                        <div>
                          <p>{p.title}</p>
                          <span>{p.location}, {p.country}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {results.videos.length > 0 && (
                  <div className="search-bar__group">
                    <h4>360° Videos</h4>
                    {results.videos.slice(0, 3).map((v) => (
                      <button key={v._id} className="search-bar__item" onClick={() => handleSelect('videos', v.slug)}>
                        <img src={v.thumbnail} alt={v.title} />
                        <div>
                          <p>{v.title}</p>
                          <span>{v.location}, {v.country}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {results.tours.length > 0 && (
                  <div className="search-bar__group">
                    <h4>Virtual Tours</h4>
                    {results.tours.slice(0, 3).map((t) => (
                      <button key={t._id} className="search-bar__item" onClick={() => handleSelect('tours', t.slug)}>
                        <img src={t.coverImage} alt={t.title} />
                        <div>
                          <p>{t.title}</p>
                          <span>{t.location}, {t.country}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="search-bar__hint">
          <kbd>ESC</kbd> to close • <kbd>ENTER</kbd> to search
        </div>
      </motion.div>
    </motion.div>
  );
}
