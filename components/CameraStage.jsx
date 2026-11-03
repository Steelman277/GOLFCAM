import React, { useEffect, useRef, useState } from 'react';
import { Radio, Circle, Timer, Play, Video, Zap, FastForward } from 'lucide-react';

const STATUS_INFO = {
  idle: { label: 'Idle', dot: 'bg-slate-400', Icon: Video, ring: 'ring-slate-400/30' },
  streaming: { label: 'LIVE', dot: 'bg-emerald-500', Icon: Radio, ring: 'ring-emerald-500/40' },
  recording: { label: 'RECORDING', dot: 'bg-red-500', Icon: Circle, ring: 'ring-red-500/50' },
  waiting: { label: 'WAITING', dot: 'bg-amber-500', Icon: Timer, ring: 'ring-amber-500/40' },
  replaying: { label: 'REPLAY', dot: 'bg-sky-500', Icon: Play, ring: 'ring-sky-500/40' },
};

export default function CameraStage({ videoRef, status, speed, threshold, clipUrl, onReplayEnded, onSkipWait, waitMs }) {
  const info = STATUS_INFO[status] || STATUS_INFO.idle;
  const isLive = status === 'streaming';
  const isRecording = status === 'recording';
  const waitSeconds = Math.round(waitMs / 1000);
  const [countdown, setCountdown] = useState(waitSeconds);
  const replayRef = useRef(null);

  useEffect(() => {
    if (status !== 'waiting') { setCountdown(waitSeconds); return; }
    setCountdown(waitSeconds);
    const id = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [status, waitSeconds]);

  const speedPct = Math.min(100, (speed / Math.max(threshold * 1.4, 100)) * 100);
  const overThreshold = speed >= threshold;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-900 ring-1 ring-white/10 shadow-2xl">
      {/* Live stream (hidden during replay) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`h-full w-full object-cover transition-opacity duration-300 ${status === 'replaying' ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Replay video */}
      {status === 'replaying' && clipUrl && (
        <video
          key={clipUrl}
          ref={replayRef}
          src={clipUrl}
          autoPlay
          muted
          playsInline
          onEnded={onReplayEnded}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Arm-tracking overlay (live and replay) */}
     

      {/* Idle placeholder */}
      {status === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Video className="h-12 w-12" />
          <p className="text-sm">Press Start to activate the camera</p>
        </div>
      )}

      {/* Top status bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className={`flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-md ring-1 ${info.ring}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${info.dot} ${(isLive || isRecording) ? 'animate-pulse' : ''}`} />
          <span className="text-xs font-semibold tracking-wider text-white">{info.label}</span>
        </div>

        {isLive && (
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md ring-1 ${overThreshold ? 'bg-red-500/30 ring-red-400/60' : 'bg-black/55 ring-white/15'}`}>
            <Zap className={`h-3.5 w-3.5 ${overThreshold ? 'text-red-300' : 'text-emerald-300'}`} />
            <span className="font-mono text-sm font-bold text-white">{speed}<span className="text-[10px] font-normal text-white/70">mph</span></span>
          </div>
        )}
      </div>

      {/* Bottom speed meter (only while live) */}
      {isLive && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
          <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-white/70">
            <span>Swing speed</span>
            <span>Trigger {threshold}mph</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/50">
            <div
              className={`h-full rounded-full transition-all duration-100 ${overThreshold ? 'bg-red-500' : 'bg-linear-to-r from-emerald-400 to-lime-400'}`}
              style={{ width: `${speedPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Waiting countdown */}
      {status === 'waiting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 backdrop-blur-sm">
          <Timer className="h-10 w-10 text-amber-300" />
          <div className="font-mono text-6xl font-bold text-white">{countdown}</div>
          <p className="text-sm text-white/80">Replaying swing in a moment</p>
          <button
            onClick={onSkipWait}
            className="mt-3 flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95"
          >
            <FastForward className="h-4 w-4" /> Skip to replay
          </button>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-white">REC</span>
        </div>
      )}
    </div>
  );
}