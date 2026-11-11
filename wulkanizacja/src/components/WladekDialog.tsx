/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { WladekCharacter } from '../types/game';
import { soundManager } from '../utils/audio';
import {
  X,
  Sparkles,
  Coffee,
  Wrench,
  ShieldAlert,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  Flame,
  Radio
} from 'lucide-react';

import { getWladekQuote, WLADEK_HANDCRAFTED_QUOTES } from '../engine/wladekQuotes';

interface WladekDialogProps {
  wladek: WladekCharacter;
  onClose: () => void;
  onScoldWladek: () => void;
  onRecoverTool: () => void;
}

export const WladekDialog: React.FC<WladekDialogProps> = ({
  wladek,
  onClose,
  onScoldWladek,
  onRecoverTool,
}) => {
  const [quoteIndex, setQuoteIndex] = useState<number>(() => Math.floor(Math.random() * 1000));
  const [currentQuote, setCurrentQuote] = useState<string>(() => wladek.speechText || getWladekQuote(quoteIndex));
  const [response, setResponse] = useState<string | null>(null);

  const rollRandomQuote = () => {
    soundManager.playWladekQuip();
    const nextIdx = Math.floor(Math.random() * 1000);
    setQuoteIndex(nextIdx);
    setCurrentQuote(getWladekQuote(nextIdx));
    setResponse(null);
  };

  const handleAction = (type: 'work' | 'coffee' | 'tool' | 'tractor' | 'paste' | 'lift' | 'radio' | 'advice') => {
    soundManager.playWladekQuip();
    if (type === 'work') {
      setResponse('Uże idu, uże idu! Idę do magazynu opony poukładać pod linijkę według rozmiaru i rocznika!');
      onScoldWladek();
    } else if (type === 'coffee') {
      setResponse('O, to ja rozumiem! Kawka z ekspresu najlepsza! Już idę, tylko klientowi w poczekalni opowiem dowcip o gaźniku!');
      onScoldWladek();
    } else if (type === 'tool') {
      setResponse('Ojojoj, to ten kluczyk był potrzebny? Ja myślałem, że to breloczek do kluczy... Już oddaję na wózek!');
      onRecoverTool();
    } else if (type === 'tractor') {
      setResponse('Od szwagra z Kołomyi przywiozłem! Założy się do Passata B5, poszerzy nadkola i będzie szedł w pole jak czołg!');
    } else if (type === 'paste') {
      setResponse('Bo stała w przeciągu i jej zimno było! Na słońcu szybciej schnie i ładniej pachnie wanilią!');
    } else if (type === 'lift') {
      setResponse('Ja tolko sprawdzam, czy hydraulika trzyma! U nas w kołchozie to się na dwóch klockach sosnowych stawiało i nikt nie płakał!');
    } else if (type === 'radio') {
      setResponse('To przecież hit sezonu, "Przez Twe oczy zielone"! Od razu mechanicy szybciej kluczami machają w rytm basu!');
    } else if (type === 'advice') {
      setResponse('Majster Mirek to nerwowy człowiek, serca nie ma do innowacji! Ja mu tolko radzę z dobroci serca!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-amber-500/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shadow-inner shrink-0">
              ⭐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-300 leading-tight">
                  Władek – Pomocnik Wulkanizatora
                </h2>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[9px] font-extrabold uppercase border border-amber-500/30">
                  Gaduła
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Wszędzie się kręci, przestawia narzędzia i komentuje pracę mechaników
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto">
          {/* Comic speech quote box */}
          <div className="p-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl relative shadow-md">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-amber-400" />
                Władek mówi:
              </span>
              <button
                onClick={rollRandomQuote}
                className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/30 px-2 py-0.5 rounded-md transition-colors"
                title="Losuj kolejny tekst Władka"
              >
                <RefreshCw className="w-2.5 h-2.5 animate-spin-reverse" />
                <span>Co tam znowu?</span>
              </button>
            </div>

            <p className="text-sm font-medium text-white italic leading-snug">
              "{response || currentQuote}"
            </p>
          </div>

          {/* Stolen tool banner */}
          {wladek.stolenTool && (
            <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-2xl flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
              <div className="text-xs">
                <p className="font-bold text-red-200">
                  Władek zwinął klucz udarowy na pamiątkę!
                </p>
                <p className="text-red-300/80">
                  Mechanicy nie mogą przez to odkręcać kół na stanowisku. Odbierz go czym prędzej!
                </p>
              </div>
            </div>
          )}

          {/* Interactive Dialog options */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
              Jak reagujesz na wybryki Władka?
            </span>

            {wladek.stolenTool && (
              <button
                onClick={() => handleAction('tool')}
                className="w-full flex items-center gap-2.5 p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-98 text-left"
              >
                <Wrench className="w-4 h-4 shrink-0" />
                <span>"Władek, oddawaj natychmiast ten klucz udarowy, robota stoi!"</span>
              </button>
            )}

            <button
              onClick={() => handleAction('lift')}
              className="w-full flex items-center gap-2.5 p-2.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all active:scale-98 text-left"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>"Władek, odejdź od podnośnika zanim komuś auto na głowę spadnie!"</span>
            </button>

            <button
              onClick={() => handleAction('advice')}
              className="w-full flex items-center gap-2.5 p-2.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all active:scale-98 text-left"
            >
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span>"Przestań pouczać Majstra Mirka, on tu pracuje od 30 lat!"</span>
            </button>

            <button
              onClick={() => handleAction('tractor')}
              className="w-full flex items-center gap-2.5 p-2.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all active:scale-98 text-left"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>"Skąd ty wytrzasnąłeś tę oponę od traktora w magazynie?"</span>
            </button>

            <button
              onClick={() => handleAction('paste')}
              className="w-full flex items-center gap-2.5 p-2.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all active:scale-98 text-left"
            >
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span>"Czemu znowu przestawiłeś pastę montażową Biały Wilk na środek przejścia?"</span>
            </button>

            <button
              onClick={() => handleAction('radio')}
              className="w-full flex items-center gap-2.5 p-2.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all active:scale-98 text-left"
            >
              <Radio className="w-4 h-4 text-pink-400 shrink-0" />
              <span>"Władek, ścisz to disco polo w radiu, klienci uciekają z poczekalni!"</span>
            </button>

            <button
              onClick={() => handleAction('work')}
              className="w-full flex items-center gap-2.5 p-2.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all active:scale-98 text-left"
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>"Władek, idź zobacz czy cię w magazynie opon nie ma i ułóż opony!"</span>
            </button>

            <button
              onClick={() => handleAction('coffee')}
              className="w-full flex items-center gap-2.5 p-2.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all active:scale-98 text-left"
            >
              <Coffee className="w-4 h-4 text-amber-300 shrink-0" />
              <span>"Wypij kawę w poczekalni i daj chłopakom pracować w spokoju."</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center shrink-0">
          <span className="text-[10px] text-amber-400/90 font-medium font-mono">
            Kwestia #{quoteIndex + 1} / 1000+ unikalnych tekstów
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

