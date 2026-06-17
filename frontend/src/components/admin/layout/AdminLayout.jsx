import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../../stores';
import { FiHome, FiImage, FiVideo, FiNavigation, FiGrid, FiSettings, FiUsers, FiMessageSquare, FiStar, FiBriefcase, FiMenu, FiX, FiLogOut, FiChevronLeft } from 'react-icons/fi';
import './AdminLayout.css';
import '../../../pages/admin/AdminPages.css';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: <FiHome size={18} />, end: true },
  { name: '360 Photos', path: '/admin/photos', icon: <FiImage size={18} /> },
  { name: '360 Videos', path: '/admin/videos', icon: <FiVideo size={18} /> },
  { name: 'Virtual Tours', path: '/admin/tours', icon: <FiNavigation size={18} /> },
  { name: 'Gallery', path: '/admin/gallery', icon: <FiGrid size={18} /> },
  { name: 'Services', path: '/admin/services', icon: <FiSettings size={18} /> },
  { name: 'Testimonials', path: '/admin/testimonials', icon: <FiStar size={18} /> },
  { name: 'Clients', path: '/admin/clients', icon: <FiBriefcase size={18} /> },
  { name: 'Contacts', path: '/admin/contacts', icon: <FiMessageSquare size={18} /> },
  { name: 'Users', path: '/admin/users', icon: <FiUsers size={18} /> },
  { name: 'Settings', path: '/admin/settings', icon: <FiSettings size={18} /> },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header">
          <Link to="/" className="admin-sidebar__logo">
            <span className="admin-sidebar__logo-icon">TARS</span>
            <span className="admin-sidebar__logo-text">360°</span>
          </Link>
          <button className="admin-sidebar__close" onClick={toggleSidebar}><FiX size={22} /></button>
        </div>

        <nav className="admin-sidebar__nav">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'active' : ''}`}
              onClick={() => sidebarOpen && toggleSidebar()}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <img src={user?.avatar || 'https://i.pravatar.cc/150?img=11'} alt={user?.name} />
            <div>
              <p className="admin-sidebar__user-name">{user?.name || 'Admin'}</p>
              <p className="admin-sidebar__user-role">{user?.role || 'admin'}</p>
            </div>
          </div>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="admin-content__topbar">
          <button className="admin-content__menu-btn" onClick={toggleSidebar}><FiMenu size={22} /></button>
          <Link to="/" className="admin-content__back"><FiChevronLeft size={18} /> View Website</Link>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
