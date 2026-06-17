import { useState, useEffect } from 'react';
import { FiImage, FiVideo, FiNavigation, FiUsers, FiMessageSquare, FiEye } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import API from '../../api/axios';
import { formatNumber } from '../../utils/helpers';
import './AdminPages.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data.data);
      } catch { setStats(null); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const cards = [
    { icon: <FiImage size={24} />, label: '360 Photos', value: stats?.photos || 0, color: '#10b981' },
    { icon: <FiVideo size={24} />, label: '360 Videos', value: stats?.videos || 0, color: '#06b6d4' },
    { icon: <FiNavigation size={24} />, label: 'Virtual Tours', value: stats?.tours || 0, color: '#8b5cf6' },
    { icon: <FiEye size={24} />, label: 'Gallery Images', value: stats?.gallery || 0, color: '#f59e0b' },
    { icon: <FiMessageSquare size={24} />, label: 'Contact Requests', value: stats?.contacts || 0, color: '#ef4444' },
    { icon: <FiUsers size={24} />, label: 'Users', value: stats?.users || 0, color: '#3b82f6' },
  ];

  return (
    <>
      <SEO title="Admin Dashboard" />
      <div className="admin-page">
        <h1 className="admin-page__title">Dashboard</h1>
        <p className="admin-page__subtitle">Welcome back! Here's an overview of your content.</p>

        <div className="admin-stats__grid">
          {cards.map((card, i) => (
            <div key={i} className="admin-stats__card" style={{ borderTopColor: card.color }}>
              <div className="admin-stats__icon" style={{ background: `${card.color}15`, color: card.color }}>{card.icon}</div>
              <div className="admin-stats__value">{loading ? '...' : formatNumber(card.value)}</div>
              <div className="admin-stats__label">{card.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
