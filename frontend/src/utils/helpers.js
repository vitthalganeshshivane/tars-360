export const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString() || '0';
};
export const truncate = (str, len = 100) => str?.length > len ? str.slice(0, len) + '...' : str || '';
export const slugify = (text) => text?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
export const getImageUrl = (url) => url || 'https://picsum.photos/800/600';
export const getPanoramaUrl = (url) => url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Pano_tilt_effect.jpg/1280px-Pano_tilt_effect.jpg';

export const isEmbeddableVideoUrl = (url = '') => /(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(url);

export const isDirectVideoUrl = (url = '') => {
  if (!url) return false;
  if (/res\.cloudinary\.com\/[^/]+\/video\/upload\//i.test(url)) return true;
  return /\.(mp4|webm|mov|m4v|ogv)(?:[?#].*)?$/i.test(url);
};

export const getEmbedUrl = (url) => {
  if (!url) return '';
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  // Already an embed URL or other
  return url;
};
