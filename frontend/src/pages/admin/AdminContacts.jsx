import { useState, useEffect } from 'react';
import { FiTrash2, FiEye, FiArchive } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import API from '../../api/axios';
import { formatDate } from '../../utils/helpers';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/contact/all');
      setContacts(data.data || data || []);
    } catch (err) {
      console.warn('Unable to load contacts', err);
      setContacts([]);
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/contact/${id}`, { status });
      fetchContacts();
    } catch (err) { console.warn('Unable to update contact status', err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try { await API.delete(`/contact/${id}`); fetchContacts(); } catch (err) { console.warn('Unable to delete contact', err); }
  };

  return (
    <>
      <SEO title="Manage Contacts" />
      <div className="admin-crud">
        <div className="admin-crud__header">
          <div><h1>Contact Requests</h1><p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>{contacts.length} total</p></div>
        </div>

        <div className="admin-crud__table-wrapper">
          <table className="admin-crud__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>No contacts</td></tr>
              ) : contacts.map((c) => (
                <tr key={c._id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.subject || '-'}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                  <td>
                    <span className={`badge ${c.status === 'new' ? 'badge-secondary' : c.status === 'replied' ? 'badge-primary' : 'badge-gold'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{formatDate(c.createdAt)}</td>
                  <td>
                    <div className="admin-crud__actions">
                      {c.status === 'new' && <button className="admin-crud__btn admin-crud__btn--edit" onClick={() => updateStatus(c._id, 'read')} title="Mark Read"><FiEye size={14} /></button>}
                      <button className="admin-crud__btn admin-crud__btn--edit" onClick={() => updateStatus(c._id, 'archived')} title="Archive"><FiArchive size={14} /></button>
                      <button className="admin-crud__btn admin-crud__btn--delete" onClick={() => handleDelete(c._id)}><FiTrash2 size={14} /></button>
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
