import React, { useState } from 'react';
import { Music2, VolumeX } from 'lucide-react';

const VIDEO_ID = '7MKSqD-X_3E';

/** Optional YouTube background track. Playback starts only after a user tap. */
export const BackgroundMusic: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="fixed bottom-3 left-3 z-[60] flex items-end gap-2 pointer-events-auto">
      {enabled && (
        <div className="overflow-hidden rounded-xl border border-amber-500/50 bg-slate-950/95 shadow-2xl">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold tracking-wide text-amber-300">
            <span>MUZYKA W TLE</span>
            <button onClick={() => setEnabled(false)} className="rounded px-1 text-slate-300 hover:text-white" aria-label="Wyłącz muzykę">✕</button>
          </div>
          <iframe
            key="youtube-background-track"
            width="200"
            height="113"
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
            title="Muzyka w tle – YouTube"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="block max-w-[42vw]"
          />
        </div>
      )}
      <button
        onClick={() => setEnabled(value => !value)}
        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold shadow-xl transition active:scale-95 ${enabled ? 'border-amber-400 bg-amber-500 text-slate-950' : 'border-slate-600 bg-slate-900/95 text-amber-300'}`}
        aria-label={enabled ? 'Wyłącz muzykę' : 'Włącz muzykę'}
      >
        {enabled ? <VolumeX size={15} /> : <Music2 size={15} />}
        {enabled ? 'MUZYKA ON' : 'WŁĄCZ MUZYKĘ'}
      </button>
    </div>
  );
};
