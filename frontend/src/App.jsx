import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthStore } from './stores';
import ScrollToTop from './components/common/ScrollToTop';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ClickSpark from './components/common/ClickSpark';
import SplashCursor from './components/common/SplashCursor';

const Home = lazy(() => import('./pages/Home'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));
const PhotoDetail = lazy(() => import('./pages/PhotoDetail'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const VideoDetail = lazy(() => import('./pages/VideoDetail'));
const ToursPage = lazy(() => import('./pages/ToursPage'));
const TourDetail = lazy(() => import('./pages/TourDetail'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

const AdminLayout = lazy(() => import('./components/admin/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPhotos = lazy(() => import('./pages/admin/AdminPhotos'));
const AdminVideos = lazy(() => import('./pages/admin/AdminVideos'));
const AdminTours = lazy(() => import('./pages/admin/AdminTours'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminClients = lazy(() => import('./pages/admin/AdminClients'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => { loadUser(); }, [loadUser]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <SplashCursor />
        <ClickSpark sparkColor="#e60023" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/photos" element={<><Navbar /><PhotosPage /><Footer /></>} />
            <Route path="/photos/:slug" element={<><Navbar /><PhotoDetail /><Footer /></>} />
            <Route path="/videos" element={<><Navbar /><VideosPage /><Footer /></>} />
            <Route path="/videos/:slug" element={<><Navbar /><VideoDetail /><Footer /></>} />
            <Route path="/tours" element={<><Navbar /><ToursPage /><Footer /></>} />
            <Route path="/tours/:slug" element={<><Navbar /><TourDetail /><Footer /></>} />
            <Route path="/gallery" element={<><Navbar /><GalleryPage /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="photos" element={<AdminPhotos />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="tours" element={<AdminTours />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Suspense>
        </ClickSpark>
      </BrowserRouter>
    </HelmetProvider>
  );
}
