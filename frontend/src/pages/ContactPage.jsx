import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import API from '../api/axios';
import './ContactPage.css';

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [status, setStatus] = useState('idle');

  const onSubmit = async (data) => {
    setStatus('loading');
    try {
      await API.post('/contact', data);
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with TARS 360° for premium 360° photography, virtual tours, and drone cinematography services." />
      <div className="contact-page">
        <div className="contact-page__header">
          <div className="container"><h1>Get In Touch</h1><p>Ready to start your next project? Let's create something extraordinary together.</p></div>
        </div>

        <div className="container">
          <div className="contact-page__layout">
            <div className="contact-page__info">
              <h2>Let's Talk</h2>
              <p>Whether you need 360° photography, virtual tours, or drone cinematography, we're here to bring your vision to life.</p>

              <div className="contact-page__details">
                <div className="contact-page__detail">
                  <div className="contact-page__detail-icon"><FiMail size={20} /></div>
                  <div><h4>Email</h4><p>hello@tars360.com</p></div>
                </div>
                <div className="contact-page__detail">
                  <div className="contact-page__detail-icon"><FiPhone size={20} /></div>
                  <div><h4>Phone</h4><p>+1 (555) 123-4567</p></div>
                </div>
                <div className="contact-page__detail">
                  <div className="contact-page__detail-icon"><FiMapPin size={20} /></div>
                  <div><h4>Office</h4><p>350 Fifth Avenue, New York, NY 10118</p></div>
                </div>
              </div>
            </div>

            <form className="contact-page__form" onSubmit={handleSubmit(onSubmit)}>
              <div className="contact-page__form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input {...register('name', { required: 'Name is required' })} placeholder="John Doe" />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} placeholder="john@example.com" />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input {...register('phone')} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input {...register('subject', { required: 'Subject is required' })} placeholder="Project inquiry..." />
                {errors.subject && <p className="form-error">{errors.subject.message}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea rows={5} {...register('message', { required: 'Message is required' })} placeholder="Tell us about your project..." />
                {errors.message && <p className="form-error">{errors.message.message}</p>}
              </div>

              {status === 'success' && (
                <div className="contact-page__success"><FiCheck size={18} /> Thank you! Your message has been sent successfully.</div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'} style={{ width: '100%', justifyContent: 'center' }}>
                {status === 'loading' ? 'Sending...' : <>Send Message <FiSend size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
