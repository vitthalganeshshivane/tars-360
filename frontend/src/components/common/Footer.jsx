import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiYoutube, FiFacebook, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-icon">TARS</span>
            <span className="footer__logo-text">360°</span>
          </Link>
          <p className="footer__desc">
            Premium immersive experiences through 360° photography, virtual tours, and cinematic drone videography. Explore the world like never before.
          </p>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Twitter"><FiTwitter size={18} /></a>
            <a href="#" aria-label="YouTube"><FiYoutube size={18} /></a>
            <a href="#" aria-label="Facebook"><FiFacebook size={18} /></a>
            <a href="#" aria-label="LinkedIn"><FiLinkedin size={18} /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <Link to="/photos">360° Photos</Link>
          <Link to="/videos">360° Videos</Link>
          <Link to="/tours">Virtual Tours</Link>
          <Link to="/gallery">Gallery</Link>
        </div>

        <div className="footer__col">
          <h4>Services</h4>
          <Link to="/photos">360° Photography</Link>
          <Link to="/videos">360° Video Production</Link>
          <Link to="/tours">Virtual Tour Creation</Link>
          <Link to="/gallery">Drone Coverage</Link>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <div className="footer__contact-item">
            <FiMail size={16} />
            <span>hello@tars360.com</span>
          </div>
          <div className="footer__contact-item">
            <FiPhone size={16} />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="footer__contact-item">
            <FiMapPin size={16} />
            <span>New York, NY 10001</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>&copy; {new Date().getFullYear()} TARS 360°. All rights reserved.</p>
        <p>Crafted with precision for immersive experiences.</p>
      </div>
    </footer>
  );
}
