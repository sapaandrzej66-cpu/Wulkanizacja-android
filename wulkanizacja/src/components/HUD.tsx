/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameStats, WladekMiniEvent } from '../types/game';
import { soundManager } from '../utils/audio';
import {
  Wrench,
  DollarSign,
  Star,
  Users,
  Clock,
  Play,
  Pause,
  FastForward,
  Volume2,
  VolumeX,
  ShoppingBag,
  Info,
  AlertTriangle
} from 'lucide-react';

interface HUDProps {
  stats: GameStats;
  waitingCarsCount: number;
  activeMiniEvents?: WladekMiniEvent[];
  onResolveMiniEvent?: (id: string) => void;
  onTogglePause: () => void;
  onSetSpeed: (speed: 1 | 2 | 3) => void;
  onToggleSound: () => void;
  onOpenShop: () => void;
  onOpenTutorial: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  waitingCarsCount,
  activeMiniEvents,
  onResolveMiniEvent,
  onTogglePause,
  onSetSpeed,
  onToggleSound,
  onOpenShop,
  onOpenTutorial,
}) => {
  const formatTime = (h: number, m: number) => {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const cycleSpeed = () => {
    soundManager.playClick();
    const nextSpeed = stats.speed === 1 ? 2 : stats.speed === 2 ? 3 : 1;
    onSetSpeed(nextSpeed);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      {/* ============================================================== */}
      {/* MOBILE COMPACT HUD (Screen < 640px) - Single ultra-slim bar    */}
      {/* ============================================================== */}
      <div className="flex sm:hidden items-center justify-between px-2 py-1.5 bg-slate-950/95 border-b border-slate-800/90 shadow-xl backdrop-blur-md">
        {/* Brand & Mini Status Row */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow shrink-0">
            <Wrench className="w-3.5 h-3.5 text-white" />
          </div>
          
          <div className="flex items-center gap-1 text-[11px] font-bold">
            {/* Cash */}
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-950/70 border border-emerald-500/50 rounded-md text-emerald-400">
              <span className="text-[10px]">zł</span>
              <span className="tabular-nums">{stats.money}</span>
            </div>

            {/* Reputation */}
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-950/60 border border-amber-500/40 rounded-md text-amber-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{stats.reputation.toFixed(1)}</span>
            </div>

            {/* Waiting Cars */}
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-950/60 border border-blue-500/40 rounded-md text-blue-300">
              <Users className="w-3 h-3 text-blue-400" />
              <span>{waitingCarsCount}</span>
            </div>

            {/* Clock */}
            <div className="hidden xs:flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded-md text-slate-300 font-mono text-[10px]">
              <Clock className="w-2.5 h-2.5" />
              <span>{formatTime(stats.timeHours, stats.timeMinutes)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 pointer-events-auto shrink-0">
          {/* Pause / Play */}
          <button
            onClick={() => {
              soundManager.playClick();
              onTogglePause();
            }}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
              stats.isPaused
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-700'
            }`}
            title={stats.isPaused ? 'Wznów' : 'Pauza'}
          >
            {stats.isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
          </button>

          {/* Speed Toggle (1x -> 2x -> 3x -> 1x) */}
          <button
            onClick={cycleSpeed}
            className="h-7 px-1.5 bg-slate-900 border border-blue-500/40 text-blue-400 font-extrabold text-[10px] rounded-lg flex items-center gap-0.5 active:scale-95"
            title="Zmień prędkość symulacji"
          >
            <FastForward className="w-2.5 h-2.5" />
            <span>{stats.speed}x</span>
          </button>

          {/* Upgrades Shop */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenShop();
            }}
            className="w-7 h-7 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-sm active:scale-95"
            title="Sklep z ulepszeniami"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center"
            title={stats.soundEnabled ? 'Wycisz dźwięki' : 'Włącz dźwięki'}
          >
            {stats.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
          </button>

          {/* Help Info */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTutorial();
            }}
            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-sky-400 flex items-center justify-center"
            title="Instrukcja"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP HUD (Screen >= 640px) - Full featured layout           */}
      {/* ============================================================== */}
      <div className="hidden sm:block p-3 sm:p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand Lockup */}
          <div className="flex items-center gap-3 pointer-events-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3.5 py-2 shadow-xl backdrop-blur">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg tracking-wider font-bold text-white uppercase leading-none">
                WULKANIZACJA
              </h1>
              <p className="text-[10px] font-medium text-amber-400 leading-tight">
                Warsztat 24h • Point & Click
              </p>
            </div>
          </div>

          {/* Status Metrics */}
          <div className="flex items-center flex-wrap gap-2 pointer-events-auto">
            {/* Cash */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                zł
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                  Kasa
                </span>
                <span className="text-base font-bold text-emerald-400 tabular-nums leading-tight">
                  {stats.money} zł
                </span>
              </div>
            </div>

            {/* Reputation */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                  Reputacja
                </span>
                <span className="text-sm font-bold text-slate-100 tabular-nums leading-tight">
                  {stats.reputation.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            {/* Waiting Cars Queue */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-blue-500/30 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur">
              <Users className="w-4 h-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                  Kolejka aut
                </span>
                <span className="text-sm font-bold text-slate-100 tabular-nums leading-tight">
                  {waitingCarsCount} oczekuje
                </span>
              </div>
            </div>

            {/* Time & Day */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur">
              <Clock className="w-4 h-4 text-slate-300" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                  Dzień {stats.day}
                </span>
                <span className="text-sm font-bold text-slate-100 tabular-nums leading-tight font-mono">
                  {formatTime(stats.timeHours, stats.timeMinutes)}
                </span>
              </div>
            </div>
          </div>

          {/* Game Controls & Shop */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Pause */}
            <button
              onClick={() => {
                soundManager.playClick();
                onTogglePause();
              }}
              className={`p-2 rounded-xl border transition-all ${
                stats.isPaused
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-700/80 hover:bg-slate-800'
              }`}
              title={stats.isPaused ? 'Wznów grę' : 'Zatrzymaj grę (Pauza)'}
            >
              {stats.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* Speed Buttons */}
            <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl p-0.5">
              {[1, 2, 3].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    soundManager.playClick();
                    onSetSpeed(spd as 1 | 2 | 3);
                  }}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                    stats.speed === spd
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Audio Mute */}
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleSound();
              }}
              className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl transition-colors"
              title={stats.soundEnabled ? 'Wycisz dźwięki' : 'Włącz dźwięki'}
            >
              {stats.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            </button>

            {/* Tutorial / Help */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenTutorial();
              }}
              className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl transition-colors"
              title="Jak grać? (Instrukcja)"
            >
              <Info className="w-4 h-4 text-sky-400" />
            </button>

            {/* Upgrades Shop Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenShop();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span>Sklep ulepszeń</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Władek Mini-Event Alert Banner */}
      {activeMiniEvents && activeMiniEvents.length > 0 && (
        <div className="flex justify-center px-3 pt-1 pointer-events-auto animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-950/95 border border-red-500/80 rounded-full shadow-2xl backdrop-blur-md text-xs max-w-lg">
            <span className="flex items-center gap-1 text-amber-400 font-bold shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              <span>WŁADEK ZBROIŁ:</span>
            </span>
            <span className="text-red-200 font-medium truncate text-[11px] sm:text-xs">
              {activeMiniEvents[0].title}
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onResolveMiniEvent?.(activeMiniEvents[0].id);
              }}
              className="px-2.5 py-0.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-[10px] rounded-full shrink-0 shadow transition-all active:scale-95"
            >
              Napraw!
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
