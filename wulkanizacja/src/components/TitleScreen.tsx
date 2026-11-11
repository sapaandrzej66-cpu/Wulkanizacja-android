/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { soundManager } from '../utils/audio';
import { Play, Wrench, Sparkles, Volume2 } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 select-none overflow-hidden">
      {/* Background radial gradient & subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/40 via-slate-950 to-black pointer-events-none" />

      {/* Decorative tire tracks pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 w-full max-w-xl text-center flex flex-col items-center">
        {/* Bespoke Tire & Wrench SVG Logo */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-8 border-slate-800 bg-slate-900 shadow-2xl shadow-blue-500/20 flex items-center justify-center relative">
            {/* Tread marks */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-slate-700/60" />
            {/* Rim */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center shadow-inner">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-amber-400 rotate-45" />
              </div>
            </div>
          </div>
          {/* Badge */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-[10px] tracking-widest rounded-full shadow border border-white/20 whitespace-nowrap uppercase">
            Stanowiska 1 & 2
          </span>
        </div>

        {/* Title Lockup */}
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-wider uppercase mb-2">
          WULKANIZACJA
        </h1>
        <p className="text-amber-400 font-bold text-sm sm:text-base tracking-wide uppercase mb-4">
          Izometryczna Gra Point & Click
        </p>

        <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Prawdziwy warsztat wulkanizacyjny z dwoma stanowiskami, czterema mechanikami i nieznośnym Władkiem, który wszędzie wtyka swój nos!
        </p>

        {/* Start Game CTA */}
        <button
          onClick={() => {
            soundManager.playClick();
            soundManager.playImpactWrench(0.3);
            onStartGame();
          }}
          className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm sm:text-base tracking-wider rounded-2xl shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 uppercase"
        >
          <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
          <span>Otwórz Warsztat i Graj</span>
        </button>

        {/* Controls Hint */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 w-full max-w-sm flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span>🖱️ Przeciągnij aby przesuwać</span>
          <span>·</span>
          <span>🔍 Kółko / Pinch aby przybliżyć</span>
          <span>·</span>
          <span>👆 Klikaj obiekty</span>
        </div>
      </div>
    </div>
  );
};
