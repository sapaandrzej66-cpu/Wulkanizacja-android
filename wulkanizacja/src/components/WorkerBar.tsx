import React from 'react';
import { Worker, WorkerId } from '../types/game';
import { soundManager } from '../utils/audio';
import { CheckCircle2, Footprints, Wrench, AlertCircle, Users } from 'lucide-react';

interface WorkerBarProps {
  workers: Worker[];
  selectedStationId: 'station1' | 'station2' | null;
  onSelectStation: (id: 'station1' | 'station2') => void;
  onSelectWorker?: (id: WorkerId) => void;
}

export const WorkerBar: React.FC<WorkerBarProps> = ({
  workers,
  selectedStationId,
  onSelectStation,
}) => {
  const station1Workers = workers.filter(w => w.assignedStation === 'station1');
  const station2Workers = workers.filter(w => w.assignedStation === 'station2');

  const getWorkerStatus = (worker: Worker) => {
    if (worker.state === 'walking') {
      return { icon: <Footprints className="w-3 h-3 text-sky-400 animate-pulse" />, text: 'Idzie' };
    }
    if (worker.state === 'working') {
      return { icon: <Wrench className="w-3 h-3 text-amber-400 animate-spin" />, text: `${Math.round(worker.workProgress * 100)}%` };
    }
    if (worker.state === 'searching') {
      return { icon: <AlertCircle className="w-3 h-3 text-red-400" />, text: 'Szuka' };
    }
    return { icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />, text: 'Gotowy' };
  };

  return (
    <footer className="absolute bottom-2 left-0 right-0 z-20 pointer-events-none px-2 sm:px-4">
      {/* ============================================================== */}
      {/* MOBILE COMPACT STATION BAR (Screen < 640px)                    */}
      {/* ============================================================== */}
      <div className="flex sm:hidden items-center justify-center gap-2 py-1 px-1.5 max-w-full">
        {/* Stanowisko 1 Team Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onSelectStation('station1');
          }}
          className={`pointer-events-auto flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border transition-all shadow-lg backdrop-blur-md ${
            selectedStationId === 'station1'
              ? 'bg-blue-950/95 border-blue-400 ring-2 ring-blue-400/60 shadow-blue-500/30'
              : 'bg-slate-950/90 border-blue-500/30 hover:border-blue-400/50'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-400 leading-none">
              Stanowisko 1
            </span>
            <span className="text-[11px] font-bold text-white leading-tight">
              Mirek & Janusz
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {station1Workers.map(w => {
              const status = getWorkerStatus(w);
              return (
                <div
                  key={w.id}
                  className="w-5 h-5 rounded-md flex items-center justify-center relative border border-white/20"
                  style={{ backgroundColor: w.color }}
                  title={`${w.name}: ${status.text}`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: w.hairColor }} />
                  {w.state === 'working' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        </button>

        {/* Stanowisko 2 Team Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onSelectStation('station2');
          }}
          className={`pointer-events-auto flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border transition-all shadow-lg backdrop-blur-md ${
            selectedStationId === 'station2'
              ? 'bg-amber-950/95 border-amber-400 ring-2 ring-amber-400/60 shadow-amber-500/30'
              : 'bg-slate-950/90 border-amber-500/30 hover:border-amber-400/50'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400 leading-none">
              Stanowisko 2
            </span>
            <span className="text-[11px] font-bold text-white leading-tight">
              Seba & Darek
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {station2Workers.map(w => {
              const status = getWorkerStatus(w);
              return (
                <div
                  key={w.id}
                  className="w-5 h-5 rounded-md flex items-center justify-center relative border border-white/20"
                  style={{ backgroundColor: w.color }}
                  title={`${w.name}: ${status.text}`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: w.hairColor }} />
                  {w.state === 'working' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        </button>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP STATION TEAMS DOCK (Screen >= 640px)                   */}
      {/* ============================================================== */}
      <div className="hidden sm:flex max-w-4xl mx-auto items-center justify-center gap-4 py-1">
        {/* Stanowisko 1 Box */}
        <div
          onClick={() => {
            soundManager.playClick();
            onSelectStation('station1');
          }}
          className={`pointer-events-auto cursor-pointer flex items-center gap-3 p-2 rounded-2xl border transition-all shadow-xl backdrop-blur-md ${
            selectedStationId === 'station1'
              ? 'bg-blue-950/90 border-blue-400 ring-2 ring-blue-400/50 scale-102'
              : 'bg-slate-900/90 border-blue-500/30 hover:border-blue-400/60'
          }`}
        >
          <div className="px-2.5 py-1.5 rounded-xl bg-blue-600 text-white flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">STANOWISKO 1</span>
            <span className="text-[9px] text-blue-200">2 Mechaników</span>
          </div>

          <div className="flex items-center gap-2">
            {station1Workers.map(worker => {
              const status = getWorkerStatus(worker);
              return (
                <div key={worker.id} className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center relative border border-white/10 shrink-0"
                    style={{ backgroundColor: worker.color }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: worker.hairColor }} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-tight">{worker.name}</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-300 font-medium">
                      {status.icon}
                      <span>{status.text}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stanowisko 2 Box */}
        <div
          onClick={() => {
            soundManager.playClick();
            onSelectStation('station2');
          }}
          className={`pointer-events-auto cursor-pointer flex items-center gap-3 p-2 rounded-2xl border transition-all shadow-xl backdrop-blur-md ${
            selectedStationId === 'station2'
              ? 'bg-amber-950/90 border-amber-400 ring-2 ring-amber-400/50 scale-102'
              : 'bg-slate-900/90 border-amber-500/30 hover:border-amber-400/60'
          }`}
        >
          <div className="px-2.5 py-1.5 rounded-xl bg-amber-600 text-white flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">STANOWISKO 2</span>
            <span className="text-[9px] text-amber-200">2 Mechaników</span>
          </div>

          <div className="flex items-center gap-2">
            {station2Workers.map(worker => {
              const status = getWorkerStatus(worker);
              return (
                <div key={worker.id} className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center relative border border-white/10 shrink-0"
                    style={{ backgroundColor: worker.color }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: worker.hairColor }} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-tight">{worker.name}</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-300 font-medium">
                      {status.icon}
                      <span>{status.text}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

