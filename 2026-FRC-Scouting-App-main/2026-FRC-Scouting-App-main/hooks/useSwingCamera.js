import { useRef, useState, useCallback, useEffect } from 'react';

const ROLLING_CHUNKS = 50; // ~5s rolling buffer at 100ms slices
const POST_DETECT_RECORD_MS = 3000; // keep recording this long after a swing
const DEFAULT_WAIT_MS = 15000; // 15s wait before replay
const DETECT_INTERVAL_MS = 33; // ~30fps motion sampling

/**
 * Live camera swing detector + recorder + replay loop.
 * States: idle -> streaming -> recording -> waiting -> replaying -> streaming ...
 */
export function useSwingCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const rollingChunksRef = useRef([]);
  const detectChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const prevFrameRef = useRef(null);
  const loopRef = useRef(null);
  const statusRef = useRef('idle');
  const thresholdRef = useRef(75);
  const waitMsRef = useRef(DEFAULT_WAIT_MS);
  const armedRef = useRef(true);
  const timersRef = useRef([]);

  const [status, setStatus] = useState('idle');
  const [speed, setSpeed] = useState(0);
  const [threshold, setThresholdState] = useState(75);
  const [waitMs, setWaitMsState] = useState(DEFAULT_WAIT_MS);
  const [clipUrl, setClipUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isStarted, setIsStarted] = useState(false);

  const setStatusBoth = useCallback((s) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const setThreshold = useCallback((v) => {
    thresholdRef.current = v;
    setThresholdState(v);
  }, []);

  const setWaitMs = useCallback((ms) => {
    waitMsRef.current = ms;
    setWaitMsState(ms);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const startRecorder = useCallback(() => {
    if (!streamRef.current) return;
    rollingChunksRef.current = [];
    detectChunksRef.current = [];
    let rec;
    const tryMake = (opts) => {
      try { return new MediaRecorder(streamRef.current, opts); }
      catch { return null; }
    };
    rec = tryMake({ mimeType: 'video/webm;codecs=vp9' })
       || tryMake({ mimeType: 'video/webm;codecs=vp8' })
       || tryMake({ mimeType: 'video/webm' })
       || new MediaRecorder(streamRef.current);

    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        rollingChunksRef.current.push(e.data);
        if (rollingChunksRef.current.length > ROLLING_CHUNKS) rollingChunksRef.current.shift();
        if (statusRef.current === 'recording') detectChunksRef.current.push(e.data);
      }
    };
    rec.onstop = () => {
      if (statusRef.current === 'recording') {
        const blob = new Blob(detectChunksRef.current, { type: 'video/webm' });
        setClipUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setStatusBoth('waiting');
        addTimer(() => setStatusBoth('replaying'), waitMsRef.current);
      }
    };
    rec.start(100);
    recorderRef.current = rec;
  }, [setStatusBoth, addTimer]);

  const onSwingDetected = useCallback(() => {
    if (statusRef.current !== 'streaming') return;
    armedRef.current = false;
    // snapshot the rolling buffer so the clip includes ~3s before the swing
    detectChunksRef.current = [...rollingChunksRef.current];
    setStatusBoth('recording');
    addTimer(() => {
      const rec = recorderRef.current;
      if (rec && rec.state !== 'inactive') {
        try { rec.stop(); } catch { /* noop */ }
      }
    }, POST_DETECT_RECORD_MS);
  }, [setStatusBoth, addTimer]);

  const detect = useCallback(() => {
    if (statusRef.current !== 'streaming') return;
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
    const canvas = canvasRef.current;
    const W = 160, H = 120;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, W, H);
    let frame;
    try { frame = ctx.getImageData(0, 0, W, H); }
    catch { return; }
    const data = frame.data;
    const prev = prevFrameRef.current;
    prevFrameRef.current = data;
    if (!prev) return;

    const px = 28;
    let motionPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const d = (Math.abs(data[i] - prev[i])
        + Math.abs(data[i + 1] - prev[i + 1])
        + Math.abs(data[i + 2] - prev[i + 2])) / 3;
      if (d > px) motionPixels++;
    }
    const ratio = motionPixels / (W * H);
    // motion-calibrated speed estimate (mph). Tunable via threshold slider.
    const est = Math.round(ratio * 1100);
    setSpeed((s) => (Math.abs(est - s) >= 2 ? est : s));

    const thr = thresholdRef.current;
    if (est >= thr && armedRef.current) {
      onSwingDetected();
    } else if (est < thr * 0.45) {
      armedRef.current = true;
    }
  }, [onSwingDetected]);

  const startDetectionLoop = useCallback(() => {
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = setInterval(detect, DETECT_INTERVAL_MS);
  }, [detect]);

  const skipWait = useCallback(() => {
    if (statusRef.current !== 'waiting') return;
    clearTimers();
    setStatusBoth('replaying');
  }, [clearTimers, setStatusBoth]);

  const resume = useCallback(() => {
    setClipUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    prevFrameRef.current = null;
    armedRef.current = true;
    startRecorder();
    setStatusBoth('streaming');
  }, [startRecorder, setStatusBoth]);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setIsStarted(true);
      setStatusBoth('streaming');
      startRecorder();
      startDetectionLoop();
    } catch (e) {
      setError(e?.message || 'Camera access denied. Allow camera permission and try again.');
    }
  }, [startRecorder, startDetectionLoop, setStatusBoth]);

  const stop = useCallback(() => {
    clearTimers();
    if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; }
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') {
      try { rec.stop(); } catch { /* noop */ }
    }
    recorderRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setClipUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setStatusBoth('idle');
    setIsStarted(false);
    setSpeed(0);
    prevFrameRef.current = null;
    armedRef.current = true;
  }, [clearTimers, setStatusBoth]);

  useEffect(() => () => {
    clearTimers();
    if (loopRef.current) clearInterval(loopRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  }, [clearTimers]);

  return {
    videoRef, status, speed, threshold, setThreshold,
    clipUrl, error, isStarted, start, stop, skipWait,
    waitMs, setWaitMs,
    onReplayEnded: resume,
  };
}