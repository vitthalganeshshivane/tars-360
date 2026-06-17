import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiPlus, FiTrash2, FiUpload, FiLink } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import API from '../../api/axios';
import './AdminPages.css';

export default function AdminSettings() {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [heroSlides, setHeroSlides] = useState([]);
  const [teamPhotoMode, setTeamPhotoMode] = useState('url');
  const [teamPhotoPreview, setTeamPhotoPreview] = useState('');
  const teamPhotoValue = watch('teamPhoto');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/settings');
        const s = data.data || data;
        reset({
          siteName: s.siteName || '',
          siteDescription: s.siteDescription || '',
          email: s.email || '',
          phone: s.phone || '',
          address: s.address || '',
          aboutTitle: s.aboutTitle || '',
          aboutDescription: s.aboutDescription || '',
          mission: s.mission || '',
          vision: s.vision || '',
          teamPhoto: s.teamPhoto || '',
          footerText: s.footerText || '',
          'socialLinks.instagram': s.socialLinks?.instagram || '',
          'socialLinks.twitter': s.socialLinks?.twitter || '',
          'socialLinks.youtube': s.socialLinks?.youtube || '',
          'socialLinks.facebook': s.socialLinks?.facebook || '',
          'socialLinks.linkedin': s.socialLinks?.linkedin || '',
        });
        setHeroSlides(s.heroSlides || []);
        setTeamPhotoPreview(s.teamPhoto || '');
      } catch (err) { console.warn('Unable to load settings', err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [reset]);

  useEffect(() => {
    if (teamPhotoMode === 'url') {
      setTeamPhotoPreview(teamPhotoValue || '');
    }
  }, [teamPhotoValue, teamPhotoMode]);

  const onSubmit = async (data) => {
    setSaving(true);
    setStatus('');
    try {
      const payload = {
        ...data,
        heroSlides,
        socialLinks: {
          instagram: data['socialLinks.instagram'],
          twitter: data['socialLinks.twitter'],
          youtube: data['socialLinks.youtube'],
          facebook: data['socialLinks.facebook'],
          linkedin: data['socialLinks.linkedin'],
        },
      };
      // Remove nested keys
      delete payload['socialLinks.instagram'];
      delete payload['socialLinks.twitter'];
      delete payload['socialLinks.youtube'];
      delete payload['socialLinks.facebook'];
      delete payload['socialLinks.linkedin'];
      await API.put('/settings', payload);
      setStatus('success');
      setTimeout(() => setStatus(''), 3000);
    } catch { setStatus('error'); }
    finally { setSaving(false); }
  };

  const addSlide = () => {
    setHeroSlides([...heroSlides, { title: '', subtitle: '', description: '', image: '', cta: '', link: '/photos' }]);
  };

  const removeSlide = (i) => {
    setHeroSlides(heroSlides.filter((_, idx) => idx !== i));
  };

  const updateSlide = (i, key, value) => {
    const updated = [...heroSlides];
    updated[i] = { ...updated[i], [key]: value };
    setHeroSlides(updated);
  };

  const handleTeamPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamPhotoPreview(reader.result);
        setValue('teamPhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="admin-page"><p>Loading settings...</p></div>;

  return (
    <>
      <SEO title="Site Settings" />
      <div className="admin-page">
        <h1 className="admin-page__title">Site Settings</h1>
        <p className="admin-page__subtitle">Manage your site content, social links, and hero slides.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="admin-settings__section">
            <h2>General</h2>
            <div className="form-group"><label className="form-label">Site Name</label><input {...register('siteName')} /></div>
            <div className="form-group"><label className="form-label">Site Description</label><textarea rows={3} {...register('siteDescription')} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label className="form-label">Email</label><input type="email" {...register('email')} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input {...register('phone')} /></div>
            </div>
            <div className="form-group"><label className="form-label">Address</label><input {...register('address')} /></div>
          </div>

          <div className="admin-settings__section">
            <h2>Hero Slides</h2>
            {heroSlides.map((slide, i) => (
              <div key={i} className="admin-settings__slide">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <strong>Slide {i + 1}</strong>
                  <button type="button" className="admin-crud__btn admin-crud__btn--delete" onClick={() => removeSlide(i)}><FiTrash2 size={14} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">Title</label><input value={slide.title} onChange={(e) => updateSlide(i, 'title', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Subtitle</label><input value={slide.subtitle} onChange={(e) => updateSlide(i, 'subtitle', e.target.value)} /></div>
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea rows={2} value={slide.description} onChange={(e) => updateSlide(i, 'description', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Image URL</label><input value={slide.image} onChange={(e) => updateSlide(i, 'image', e.target.value)} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">CTA Text</label><input value={slide.cta} onChange={(e) => updateSlide(i, 'cta', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">CTA Link</label><input value={slide.link} onChange={(e) => updateSlide(i, 'link', e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm" onClick={addSlide} style={{ marginTop: 12 }}><FiPlus size={14} /> Add Slide</button>
          </div>

          <div className="admin-settings__section">
            <h2>Social Links</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label className="form-label">Instagram</label><input {...register('socialLinks.instagram')} placeholder="https://instagram.com/..." /></div>
              <div className="form-group"><label className="form-label">Twitter</label><input {...register('socialLinks.twitter')} placeholder="https://twitter.com/..." /></div>
              <div className="form-group"><label className="form-label">YouTube</label><input {...register('socialLinks.youtube')} placeholder="https://youtube.com/..." /></div>
              <div className="form-group"><label className="form-label">Facebook</label><input {...register('socialLinks.facebook')} placeholder="https://facebook.com/..." /></div>
              <div className="form-group"><label className="form-label">LinkedIn</label><input {...register('socialLinks.linkedin')} placeholder="https://linkedin.com/..." /></div>
            </div>
          </div>

          <div className="admin-settings__section">
            <h2>About</h2>
            <div className="form-group"><label className="form-label">About Title</label><input {...register('aboutTitle')} /></div>
            <div className="form-group"><label className="form-label">About Description</label><textarea rows={4} {...register('aboutDescription')} /></div>
            <div className="form-group"><label className="form-label">Mission</label><textarea rows={3} {...register('mission')} /></div>
            <div className="form-group"><label className="form-label">Vision</label><textarea rows={3} {...register('vision')} /></div>
            
            <div className="form-group">
              <label className="form-label">Team Photo</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${teamPhotoMode === 'url' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setTeamPhotoMode('url')}
                >
                  <FiLink size={14} /> URL
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${teamPhotoMode === 'upload' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setTeamPhotoMode('upload')}
                >
                  <FiUpload size={14} /> Upload
                </button>
              </div>
              {teamPhotoMode === 'url' ? (
                <input {...register('teamPhoto')} placeholder="https://example.com/image.jpg" />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTeamPhotoUpload}
                  style={{ padding: '8px 0' }}
                />
              )}
              {teamPhotoPreview && (
                <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-gray-200)' }}>
                  <img
                    src={teamPhotoPreview}
                    alt="Team preview"
                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>

          {status === 'success' && <div style={{ padding: 12, background: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', borderRadius: 8, marginBottom: 16 }}>Settings saved successfully!</div>}
          {status === 'error' && <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', borderRadius: 8, marginBottom: 16 }}>Error saving settings</div>}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </>
  );
}
