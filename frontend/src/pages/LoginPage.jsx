import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import './LoginPage.css';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const result = await login(data.email, data.password);
      if (result.user?.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login" />
      <div className="login-page">
        <div className="login-page__left">
          <div className="login-page__brand">
            <Link to="/" className="login-page__logo">
              <span className="login-page__logo-icon">TARS</span>
              <span className="login-page__logo-text">360°</span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to access your dashboard and manage your immersive content.</p>
          </div>
        </div>
        <div className="login-page__right">
          <form className="login-page__form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Sign In</h2>
            {error && <div className="login-page__error">{error}</div>}
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="login-page__input">
                <FiMail size={18} />
                <input type="email" {...register('email', { required: 'Email is required' })} placeholder="admin@tars360.com" />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="login-page__input">
                <FiLock size={18} />
                <input type="password" {...register('password', { required: 'Password is required' })} placeholder="Enter your password" />
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Signing in...' : <>Sign In <FiArrowRight size={16} /></>}
            </button>
            <p className="login-page__hint">
              Don't have an account? <Link to="/register" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
