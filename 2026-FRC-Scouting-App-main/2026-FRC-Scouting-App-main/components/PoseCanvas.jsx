import { useEffect, useRef } from 'react';
import { getPoseLandmarker } from '@/lib/poseDetector';

// MediaPipe pose landmark indices: shoulders 11/12, elbows 13/14, wrists 15/16
const ARM_LINES = [
  [11, 13], [13, 15], // left arm
  [12, 14], [14, 16], // right arm
];
const WRIST_DOTS = [15, 16];

/**
 * Transparent canvas layered over the live camera feed that draws
 * glowing lines following the player's arms while streaming/recording.
 */
export default function PoseCanvas({ videoRef, active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const smoothedRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let lastTs = -1;
    smoothedRef.current = null;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = (result, video, w, h) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const raw = result?.landmarks?.[0];
      if (!raw) {
        smoothedRef.current = null;
        return;
      }

      // temporal smoothing (exponential moving average) to stop the
      // lines from jittering on every small movement
      const ALPHA = 0.35;
      const prev = smoothedRef.current;
      const lm = raw.map((p, i) => {
        if (!prev || !prev[i]) return { ...p };
        return {
          x: prev[i].x + (p.x - prev[i].x) * ALPHA,
          y: prev[i].y + (p.y - prev[i].y) * ALPHA,
          z: prev[i].z + (p.z - prev[i].z) * ALPHA,
          visibility: prev[i].visibility + ((p.visibility ?? 1) - prev[i].visibility) * ALPHA,
        };
      });
      smoothedRef.current = lm;

      // map normalized landmarks onto the object-cover displayed video
      const vw = video.videoWidth, vh = video.videoHeight;
      const scale = Math.max(w / vw, h / vh);
      const ox = (w - vw * scale) / 2;
      const oy = (h - vh * scale) / 2;
      const px = (p) => ({ x: ox + p.x * vw * scale, y: oy + p.y * vh * scale });
      const visible = (i) => lm[i] && (lm[i].visibility === undefined || lm[i].visibility > 0.6);

      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(3, Math.round(w / 160));
      ctx.strokeStyle = 'rgba(163, 230, 53, 0.9)';
      ctx.shadowColor = 'rgba(163, 230, 53, 0.65)';
      ctx.shadowBlur = 10;

      for (const [a, b] of ARM_LINES) {
        if (!visible(a) || !visible(b)) continue;
        const p1 = px(lm[a]), p2 = px(lm[b]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      for (const i of WRIST_DOTS) {
        if (!visible(i)) continue;
        const p = px(lm[i]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(4, Math.round(w / 120)), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    (async () => {
      let landmarker;
      try {
        landmarker = await getPoseLandmarker();
      } catch {
        return; // model unavailable (offline/blocked) � skip overlay silently
      }
      if (cancelled) return;

      const loop = () => {
        if (cancelled) return;
        const video = videoRef.current;
        if (video && video.readyState >= 2 && video.videoWidth) {
          const rect = canvas.getBoundingClientRect();
          const w = Math.round(rect.width), h = Math.round(rect.height);
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }
          const ts = performance.now();
          if (ts > lastTs) {
            lastTs = ts;
            let result = null;
            try { result = landmarker.detectForVideo(video, ts); } catch { /* skip frame */ }
            draw(result, video, w, h);
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    })();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, videoRef]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}