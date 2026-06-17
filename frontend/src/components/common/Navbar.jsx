import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenuAlt3, HiX, HiSearch } from 'react-icons/hi';
import { useUIStore } from '../../stores';
import SearchBar from './SearchBar';
import './Navbar.css';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: '360 Photos', path: '/photos' },
  { name: '360 Videos', path: '/videos' },
  { name: 'Virtual Tours', path: '/tours' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { searchOpen, toggleSearch } = useUIStore();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navClass = `navbar ${scrolled || !isHome ? 'navbar--scrolled' : ''} ${mobileOpen ? 'navbar--open' : ''}`;

  return (
    <>
      <nav className={navClass}>
        <div className="navbar__inner container">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">TARS</span>
            <span className="navbar__logo-text">360°</span>
          </Link>

          <div className="navbar__links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="navbar__actions">
            <button className="navbar__icon-btn" onClick={toggleSearch} aria-label="Search">
              <HiSearch size={20} />
            </button>
            <Link to="/admin" className="btn btn-sm btn-primary">Admin</Link>
            <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && <SearchBar />}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="mobile-menu__header">
              <Link to="/" className="navbar__logo">
                <span className="navbar__logo-icon">TARS</span>
                <span className="navbar__logo-text">360°</span>
              </Link>
              <button onClick={() => setMobileOpen(false)}><HiX size={28} /></button>
            </div>
            <div className="mobile-menu__links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-menu__link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/admin" className="btn btn-primary" style={{ marginTop: 20, textAlign: 'center' }}>Admin Panel</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
