import { useEffect, useRef, useState } from 'react';
import { EquirectangularAdapter, Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import './PanoramaViewer.css';

const getWebGLSafeImageUrl = (url) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }
  const transform = 'w_4096,c_limit,q_auto,f_jpg';
  if (url.includes(transform)) return url;
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
};

export default function PanoramaViewer({
  imageUrl,
  caption = '',
  height = '520px',
  autoRotate = true,
}) {
  const viewerImageUrl = getWebGLSafeImageUrl(imageUrl);
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const blobUrlRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !viewerImageUrl) return;

    if (viewerRef.current) {
      try { viewerRef.current.destroy(); } catch { /* viewer may already be disposed */ }
      viewerRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setIsReady(false);
    setHasError(false);

    let disposed = false;
    let fallbackTimer;

    fetch(viewerImageUrl, { mode: 'cors' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (disposed) return;

        const blobUrl = URL.createObjectURL(blob);
        blobUrlRef.current = blobUrl;

        const viewer = new Viewer({
          container: containerRef.current,
          adapter: EquirectangularAdapter,
          panorama: blobUrl,
          caption: caption,
          loadingImg: null,
          loadingTxt: 'Loading...',
          touchmoveTwoFingers: false,
          mousewheelCtrlKey: false,
          navbar: ['zoom', 'fullscreen'],
          defaultYaw: 0,
          defaultPitch: 0,
          defaultZoomLvl: 50,
        });

        viewer.addEventListener('ready', () => {
          if (disposed) return;
          window.clearTimeout(fallbackTimer);
          setIsReady(true);
          setHasError(false);
        });

        viewer.addEventListener('panorama-loaded', () => {
          if (disposed) return;
          window.clearTimeout(fallbackTimer);
          setIsReady(true);
          setHasError(false);
        });

        viewer.addEventListener('panorama-error', () => {
          if (disposed) return;
          window.clearTimeout(fallbackTimer);
          setHasError(true);
          setIsReady(false);
        });

        fallbackTimer = window.setTimeout(() => {
          if (disposed) return;
          if (!viewer.state?.ready) {
            setHasError(true);
            setIsReady(false);
          }
        }, 20000);

        viewerRef.current = viewer;
      })
      .catch(() => {
        if (disposed) return;
        setHasError(true);
      });

    return () => {
      disposed = true;
      window.clearTimeout(fallbackTimer);
      if (viewerRef.current) {
        try { viewerRef.current.destroy(); } catch { /* viewer may already be disposed */ }
        viewerRef.current = null;
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [autoRotate, caption, viewerImageUrl]);

  return (
    <div className="panorama-viewer-wrap" style={{ position: 'relative', width: '100%', height, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {!isReady && !hasError && (
        <div className="panorama-loading">
          <div className="panorama-loading__spinner" />
          <span>Loading 360° view…</span>
        </div>
      )}

      {hasError && (
        <div className="panorama-error">
          <span style={{ fontSize: 40 }}>🌐</span>
          <p>360° panorama unavailable</p>
          <p style={{ opacity: 0.6, fontSize: 13 }}>Check image URL or CORS headers</p>
        </div>
      )}

      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />

      {isReady && !hasError && (
        <div className="panorama-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20" />
          </svg>
          Drag to explore 360°
        </div>
      )}
    </div>
  );
}
