import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import FeaturedExperiences from '../components/home/FeaturedExperiences';
import GalleryStrip from '../components/home/GalleryStrip';
import VideoShowcase from '../components/home/VideoShowcase';
import ToursSection from '../components/home/ToursSection';
import ServicesSection from '../components/home/ServicesSection';
import StatsSection from '../components/home/StatsSection';
import ClientsCarousel from '../components/home/ClientsCarousel';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTABanner from '../components/home/CTABanner';

export default function Home() {
  return (
    <>
      <SEO title="Premium 360° Photography & Virtual Tours" description="Experience the world through immersive 360° photography, virtual tours, and cinematic drone videography by TARS 360°." />
      <Hero />
      <FeaturedExperiences />
      <GalleryStrip />
      <VideoShowcase />
      <ToursSection />
      <ServicesSection />
      <StatsSection />
      <ClientsCarousel />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}
