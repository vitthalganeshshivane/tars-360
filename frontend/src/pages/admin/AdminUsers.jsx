import { useState, useEffect } from 'react';
import { FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import API from '../../api/axios';
import { formatDate } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data.data || data || []);
    } catch (err) {
      console.warn('Unable to load users', err);
      setUsers([]);
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await API.delete(`/admin/users/${id}`); fetchUsers(); } catch (err) { console.warn('Unable to delete user', err); }
  };

  const toggleActive = async (user) => {
    try { await API.put(`/admin/users/${user._id}`, { isActive: !user.isActive }); fetchUsers(); } catch (err) { console.warn('Unable to update user', err); }
  };

  return (
    <>
      <SEO title="Manage Users" />
      <div className="admin-crud">
        <div className="admin-crud__header">
          <div><h1>Users</h1><p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>{users.length} total</p></div>
        </div>
        <div className="admin-crud__table-wrapper">
          <table className="admin-crud__table">
            <thead><tr><th>Avatar</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7}>Loading...</td></tr> : users.map((u) => (
                <tr key={u._id}>
                  <td><img src={u.avatar || 'https://i.pravatar.cc/150?img=1'} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} /></td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-primary">{u.role}</span></td>
                  <td><span className={`badge ${u.isActive ? 'badge-secondary' : 'badge-gold'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="admin-crud__actions">
                      <button className="admin-crud__btn admin-crud__btn--edit" onClick={() => toggleActive(u)}>
                        {u.isActive ? <FiUserX size={14} /> : <FiUserCheck size={14} />}
                      </button>
                      <button className="admin-crud__btn admin-crud__btn--delete" onClick={() => handleDelete(u._id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
