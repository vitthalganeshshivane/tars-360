import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import './LoginPage.css';

export default function RegisterPage() {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Register" />
      <div className="login-page">
        <div className="login-page__left">
          <div className="login-page__brand">
            <Link to="/" className="login-page__logo">
              <span className="login-page__logo-icon">TARS</span>
              <span className="login-page__logo-text">360°</span>
            </Link>
            <h1>Join TARS 360°</h1>
            <p>Create your account to explore premium immersive experiences.</p>
          </div>
        </div>
        <div className="login-page__right">
          <form className="login-page__form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Create Account</h2>
            {error && <div className="login-page__error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="login-page__input">
                <FiUser size={18} />
                <input {...register('name', { required: 'Name is required' })} placeholder="Your full name" />
              </div>
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="login-page__input">
                <FiMail size={18} />
                <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} placeholder="you@example.com" />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="login-page__input">
                <FiLock size={18} />
                <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="Min 6 characters" />
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Creating account...' : <>Create Account <FiArrowRight size={16} /></>}
            </button>

            <p className="login-page__hint">
              Already have an account? <Link to="/login" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
