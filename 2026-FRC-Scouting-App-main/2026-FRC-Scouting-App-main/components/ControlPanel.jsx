import React from 'react';
import { Play, Square, Gauge, Info, Timer } from 'lucide-react';

export default function ControlPanel({ isStarted, start, stop, threshold, setThreshold, status, waitMs, setWaitMs }) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl p-5 ring-1 ring-white/10 bg-[#358243]/60">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#ffffff]">CONTROLS:</h2>
      </div>

      <div className="flex gap-3">
        {!isStarted ?
        <button
          onClick={start}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 active:scale-[0.98] capitalize text-center">
          
            <Play className="h-4 w-4" /> Start camera
          </button> :

        <button
          onClick={stop}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-[0.98]">
          
            <Square className="h-4 w-4" /> Stop
          </button>
        }
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Gauge className="h-4 w-4 text-lime-300" /> Swing Trigger
          </span>
          <span className="font-mono text-sm font-bold text-white normal-case">{threshold}mph</span>
        </div>
        <input
          type="range"
          min={20}
          max={150}
          step={1}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-lime-400" />
        
        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-[hsl(var(--background))]">
          <span className="lowercase">20mph</span><span className="lowercase">150mph</span>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Timer className="h-4 w-4 text-amber-300" /> Wait Time
          </span>
          <span className="font-mono text-sm font-bold text-white">{Math.round(waitMs / 1000)}s</span>
        </div>
        <input
          type="range"
          min={1}
          max={60}
          step={1}
          value={Math.round(waitMs / 1000)}
          onChange={(e) => setWaitMs(Number(e.target.value) * 1000)}
          className="w-full accent-amber-400" />
        
        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-[hsl(var(--background))]">
          <span className="capitalize">1s</span><span className="capitalize">60s</span>
        </div>
      </div>

      <div className="rounded-xl bg-slate-800/60 p-3 text-xs leading-relaxed text-slate-400">
        <p className="mb-1 flex items-center gap-1.5 font-semibold text-slate-300">
          <Info className="h-3.5 w-3.5" /> How It Works:
        </p>
        <p>The camera live-streams and watches for motion. When estimated swing speed crosses the trigger, it saves the 5 seconds before the trigger plus the 3 seconds after it, waits for the set delay, replays the clip, then returns to live automatically. Speed is a motion-based estimate � calibrate the slider to your distance from the camera.</p>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px]">
        {[
        ['LIVE', 'bg-emerald-500'],
        ['REC', 'bg-red-500'],
        ['WAIT', 'bg-amber-500'],
        ['REPLAY', 'bg-sky-500']].
        map(([l, c]) => null



        )}
      </div>
    </div>);

}