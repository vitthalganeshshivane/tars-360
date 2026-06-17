import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url, type = 'website' }) {
  const siteName = 'TARS 360° | Premium Immersive Experiences';
  const fullTitle = title ? `${title} | TARS 360°` : siteName;
  const defaultDesc = 'Premium 360° photography, virtual tours, drone cinematography, and immersive visual experiences by TARS 360°.';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      {image && <meta name="twitter:image" content={image} />}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url || window.location.href} />
    </Helmet>
  );
}
