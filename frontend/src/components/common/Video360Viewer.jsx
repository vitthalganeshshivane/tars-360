import { useEffect, useRef, useState } from 'react';
import {
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  VideoTexture,
  WebGLRenderer,
} from 'three';
import './Video360Viewer.css';

export default function Video360Viewer({
  videoUrl,
  poster,
  title = '360 video',
  height = '520px',
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const dragRef = useRef({ active: false, x: 0, y: 0, yaw: 0, pitch: 0 });
  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video || !videoUrl) return undefined;

    setIsReady(false);
    setHasError(false);
    setIsPlaying(false);

    let disposed = false;
    let scene;
    let camera;
    let renderer;
    let sphere;
    let texture;

    const resize = () => {
      if (!container || !camera || !renderer) return;
      const width = container.clientWidth || 1;
      const heightPx = container.clientHeight || 1;
      camera.aspect = width / heightPx;
      camera.updateProjectionMatrix();
      renderer.setSize(width, heightPx, false);
    };

    const render = () => {
      if (disposed || !renderer || !scene || !camera) return;
      const { yaw, pitch } = rotationRef.current;
      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;
      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(render);
    };

    try {
      scene = new Scene();
      camera = new PerspectiveCamera(75, 1, 1, 1100);
      cameraRef.current = camera;

      renderer = new WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = SRGBColorSpace;
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);

      texture = new VideoTexture(video);
      texture.colorSpace = SRGBColorSpace;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;

      const geometry = new SphereGeometry(500, 64, 32);
      geometry.scale(-1, 1, 1);
      sphere = new Mesh(geometry, new MeshBasicMaterial({ map: texture }));
      scene.add(sphere);

      resize();
      frameRef.current = window.requestAnimationFrame(render);
      window.addEventListener('resize', resize);
    } catch {
      setHasError(true);
    }

    const onLoadedData = () => {
      if (disposed) return;
      setIsReady(true);
      setHasError(false);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      if (disposed) return;
      setHasError(true);
      setIsReady(false);
    };

    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplay', onLoadedData);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError);
    video.load();

    return () => {
      disposed = true;
      window.removeEventListener('resize', resize);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      video.pause();
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('canplay', onLoadedData);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError);
      if (renderer?.domElement?.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      sphere?.geometry?.dispose();
      sphere?.material?.dispose();
      texture?.dispose();
      renderer?.dispose();
      rendererRef.current = null;
    };
  }, [videoUrl]);

  const clampPitch = (value) => Math.max(-Math.PI / 2, Math.min(Math.PI / 2, value));

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      yaw: rotationRef.current.yaw,
      pitch: rotationRef.current.pitch,
    };
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active) return;
    const sensitivity = 0.004;
    rotationRef.current.yaw = dragRef.current.yaw - (event.clientX - dragRef.current.x) * sensitivity;
    rotationRef.current.pitch = clampPitch(dragRef.current.pitch - (event.clientY - dragRef.current.y) * sensitivity);
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  const handleWheel = (event) => {
    const camera = cameraRef.current;
    if (!camera) return;
    event.preventDefault();
    camera.fov = Math.max(35, Math.min(95, camera.fov + event.deltaY * 0.03));
    camera.updateProjectionMatrix();
  };

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (video.paused) await video.play();
      else video.pause();
    } catch {
      setHasError(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const enterFullscreen = () => {
    containerRef.current?.parentElement?.requestFullscreen?.();
  };

  return (
    <div className="video360-wrap" style={{ height }}>
      <video
        ref={videoRef}
        className="video360-source"
        src={videoUrl}
        poster={poster}
        title={title}
        preload="metadata"
        playsInline
        muted={isMuted}
        crossOrigin="anonymous"
      />

      {!isReady && !hasError && (
        <div className="video360-loading">
          <div className="video360-loading__spinner" />
          <span>Loading 360 video...</span>
        </div>
      )}

      {hasError && (
        <div className="video360-error">
          <p>360 video unavailable</p>
          <span>Check the video URL, format, or CORS headers.</span>
        </div>
      )}

      <div
        ref={containerRef}
        className="video360-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      />

      {isReady && !hasError && (
        <>
          <div className="video360-hint">Drag to explore 360 degrees</div>
          <div className="video360-controls">
            <button type="button" onClick={togglePlayback}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button type="button" onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
            <button type="button" onClick={enterFullscreen}>Fullscreen</button>
          </div>
        </>
      )}
    </div>
  );
}
