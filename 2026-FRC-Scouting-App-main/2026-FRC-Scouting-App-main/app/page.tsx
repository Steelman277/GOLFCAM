'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { useSwingCamera } from '@/hooks/useSwingCamera';
import CameraStage from '@/components/CameraStage';
import ControlPanel from '@/components/ControlPanel';


export default function Home() {
  const cam = useSwingCamera();

  return (
    <div className="min-h-screen text-slate-100 bg-[#021706]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <header className="mb-8 items-center gap-3 hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-lime-400 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Swing Capture</h1>
            <p className="text-sm text-slate-400">Auto-record & replay when your swing crosses the speed trigger</p>
          </div>
        </header>

        {cam.error &&
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {cam.error}
          </div>
        }

        <main className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <CameraStage
              videoRef={cam.videoRef}
              status={cam.status}
              speed={cam.speed}
              threshold={cam.threshold}
              clipUrl={cam.clipUrl}
              onReplayEnded={cam.onReplayEnded}
              onSkipWait={cam.skipWait}
              waitMs={cam.waitMs} />

            <img src="https://media.base44.com/images/public/6ad2b7501a582de0ebf11ce6/8923bac95_Golf_CAM_Swing_Logo.png" alt="Golf C.A.M. Club. Action. Monitor." className="mx-auto w-64 rounded" />
          </div>

          <ControlPanel
            isStarted={cam.isStarted}
            start={cam.start}
            stop={cam.stop}
            threshold={cam.threshold}
            setThreshold={cam.setThreshold}
            status={cam.status}
            waitMs={cam.waitMs}
            setWaitMs={cam.setWaitMs} />
          
        </main>
      </div>
    </div>);

}