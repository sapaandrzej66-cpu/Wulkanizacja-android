/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Upgrade, UpgradeCategory } from '../types/game';
import { soundManager } from '../utils/audio';
import {
  X,
  ShoppingBag,
  Check,
  Zap,
  Wind,
  Gauge,
  Wrench,
  Coffee,
  Radio,
  Award,
  Sparkles,
  Flame,
  Tv,
  Shield,
  Search,
  DollarSign
} from 'lucide-react';

interface ShopModalProps {
  upgrades: Upgrade[];
  money: number;
  onBuyUpgrade: (id: string) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  upgrades,
  money,
  onBuyUpgrade,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | UpgradeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'purchased'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'wind': return <Wind className="w-5 h-5 text-sky-400" />;
      case 'gauge': return <Gauge className="w-5 h-5 text-emerald-400" />;
      case 'wrench': return <Wrench className="w-5 h-5 text-blue-400" />;
      case 'coffee': return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'radio': return <Radio className="w-5 h-5 text-purple-400" />;
      case 'award': return <Award className="w-5 h-5 text-yellow-400" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'tv': return <Tv className="w-5 h-5 text-indigo-400" />;
      case 'shield': return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'dollar-sign': return <DollarSign className="w-5 h-5 text-emerald-400" />;
      default: return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  const filteredUpgrades = useMemo(() => {
    return upgrades.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === 'available' && item.purchased) {
        return false;
      }
      if (statusFilter === 'purchased' && !item.purchased) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesEffect = item.multiplierEffect.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesEffect) {
          return false;
        }
      }
      return true;
    });
  }, [upgrades, selectedCategory, statusFilter, searchQuery]);

  const purchasedCount = upgrades.filter(u => u.purchased).length;
  const progressPercent = Math.round((purchasedCount / (upgrades.length || 1)) * 100);

  const getCategoryCount = (cat: 'all' | UpgradeCategory) => {
    if (cat === 'all') return upgrades.length;
    return upgrades.filter(u => u.category === cat).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shrink-0 font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                  Sklep Wyposażenia Warsztatu
                </h2>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-extrabold text-[10px] rounded-full border border-amber-500/30 shrink-0">
                  100 ULEPSZEŃ
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-24 sm:w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 tabular-nums">
                  {purchasedCount} / {upgrades.length} ({progressPercent}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 font-bold text-xs sm:text-sm tabular-nums flex items-center gap-1 shadow-inner">
              <span className="text-[10px]">Kasa:</span>
              <span>{money} zł</span>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-4 sm:px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj (np. klucz, kompresor, RunFlat, Władek, TV)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Status Toggle */}
          <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wszystkie
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                statusFilter === 'available'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Do kupienia
            </button>
            <button
              onClick={() => setStatusFilter('purchased')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                statusFilter === 'purchased'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kupione
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => { soundManager.playClick(); setSelectedCategory('all'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>Wszystkie</span>
            <span className="text-[10px] px-1 bg-black/30 rounded">{getCategoryCount('all')}</span>
          </button>
          <button
            onClick={() => { soundManager.playClick(); setSelectedCategory('equipment'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'equipment'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>⚙️ Maszyny</span>
            <span className="text-[10px] px-1 bg-black/30 rounded">{getCategoryCount('equipment')}</span>
          </button>
          <button
            onClick={() => { soundManager.playClick(); setSelectedCategory('tools'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'tools'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🔧 Narzędzia</span>
            <span className="text-[10px] px-1 bg-black/30 rounded">{getCategoryCount('tools')}</span>
          </button>
          <button
            onClick={() => { soundManager.playClick(); setSelectedCategory('comfort'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'comfort'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🛋️ Poczekalnia</span>
            <span className="text-[10px] px-1 bg-black/30 rounded">{getCategoryCount('comfort')}</span>
          </button>
          <button
            onClick={() => { soundManager.playClick(); setSelectedCategory('wladek'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'wladek'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/40'
            }`}
          >
            <span>⭐ Władek & BHP</span>
            <span className="text-[10px] px-1 bg-black/30 rounded">{getCategoryCount('wladek')}</span>
          </button>
          <button
            onClick={() => { soundManager.playClick(); setSelectedCategory('training'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'training'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🎓 Szkolenia</span>
            <span className="text-[10px] px-1 bg-black/30 rounded">{getCategoryCount('training')}</span>
          </button>
          <button
            onClick={() => { soundManager.playClick(); setSelectedCategory('marketing'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'marketing'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-950/40'
            }`}
          >
            <span>🏢 Biznes & Marketing</span>
            <span className="text-[10px] px-1 bg-black/30 rounded">{getCategoryCount('marketing')}</span>
          </button>
        </div>

        {/* Catalog List */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {filteredUpgrades.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ShoppingBag className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
              <p className="text-sm font-semibold">Nie znaleziono ulepszeń spełniających kryteria.</p>
              <p className="text-xs text-slate-500 mt-1">Zmień wyszukiwaną frazę lub kategorię.</p>
            </div>
          ) : (
            filteredUpgrades.map((item) => {
              const canAfford = money >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all gap-3 ${
                    item.purchased
                      ? 'bg-slate-800/35 border-emerald-500/30'
                      : canAfford
                      ? 'bg-slate-800/70 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/90 shadow-sm'
                      : 'bg-slate-800/25 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                      item.purchased
                        ? 'bg-emerald-950/40 border-emerald-500/40'
                        : 'bg-slate-800 border-slate-700'
                    }`}>
                      {getIcon(item.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {item.name}
                        </h4>
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 whitespace-nowrap">
                          {item.multiplierEffect}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <div className="shrink-0 self-end sm:self-center">
                    {item.purchased ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Kupione</span>
                      </div>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => onBuyUpgrade(item.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        Kup za {item.cost} zł
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-slate-400">
            Wyświetlono: {filteredUpgrades.length} z {upgrades.length} ulepszeń
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
