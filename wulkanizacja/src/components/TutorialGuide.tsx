/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { soundManager } from '../utils/audio';
import { X, Play, HelpCircle, Wrench, ShieldAlert, Sparkles, ShoppingBag } from 'lucide-react';

interface TutorialGuideProps {
  onClose: () => void;
}

export const TutorialGuide: React.FC<TutorialGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-inner">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Instrukcja Warsztatu Wulkanizacji
              </h2>
              <p className="text-xs text-slate-400">
                Jak zarządzać pracą i sprawnie obsługiwać klientów
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">
                Przyjmowanie aut na stanowisko
              </h4>
              <p className="leading-relaxed">
                Samochody przyjeżdżają na parking przed bramą. Kliknij na oczekujące auto i wybierz wolne stanowisko (Stanowisko 1 lub 2), aby wjechało na podnośnik. Pierwsze auto (Passat B5) już na Ciebie czeka!
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">
                Stała 2-osobowa załoga dla każdego stanowiska
              </h4>
              <p className="leading-relaxed">
                Każde stanowisko ma na stałe przypisanych 2 wulkanizatorów: <strong className="text-blue-400">Stanowisko 1: Majster Mirek i Janusz</strong>, a <strong className="text-amber-400">Stanowisko 2: Seba i Darek</strong>. Nie ma zamieszania – pracownicy wykonują zadania tylko przy swoim stanowisku!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
            <div className="w-7 h-7 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">
                Władek – Uważaj na wybryki pomocnika!
              </h4>
              <p className="leading-relaxed">
                Władek chodzi po całym warsztacie, zagaduje mechaników i czasem kradnie klucze udarowe, chowając je np. w kanapie lub w biurze. Jeśli klucz zginie, kliknij na migający czerwony znacznik lub na Władka, aby go odzyskać!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">
                Zarabiaj i rozwijaj warsztat
              </h4>
              <p className="leading-relaxed">
                Po skończonej robocie wystaw paragon w kasie. Zadowoleni kierowcy zostawiają sowite napiwki! Zarobione złotówki wydawaj w Sklepie Ulepszeń na lepszy kompresor, laserową wyważarkę czy włoski ekspres do kawy.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Zaczynamy pracę!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
