/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Car, Station, Worker, WorkerId } from '../types/game';
import { soundManager } from '../utils/audio';
import {
  X,
  Car as CarIcon,
  User,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Play,
  ArrowRight
} from 'lucide-react';

interface OrderModalProps {
  car: Car | null;
  stations: Station[];
  workers: Worker[];
  selectedWorkerId: WorkerId | null;
  onClose: () => void;
  onAssignToStation: (carId: string, stationId: 'station1' | 'station2') => void;
  onAssignWorkerToStep: (workerId: WorkerId, stationId: 'station1' | 'station2', stepId: string) => void;
  onToggleLift: (stationId: 'station1' | 'station2') => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  car,
  stations,
  workers,
  selectedWorkerId,
  onClose,
  onAssignToStation,
  onAssignWorkerToStep,
  onToggleLift,
}) => {
  if (!car) return null;

  const order = car.order;
  const station = stations.find(s => s.id === car.assignedStationId) || null;
  const currentStep = order.steps[order.currentStepIndex];
  const selectedWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  const station1Free = !stations.find(s => s.id === 'station1')?.assignedCarId;
  const station2Free = !stations.find(s => s.id === 'station2')?.assignedCarId;

  // Find if worker is currently working on this car
  const activeWorker = workers.find(w => w.currentStationId === car.assignedStationId && w.state === 'working');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner"
              style={{ backgroundColor: car.color }}
            >
              <CarIcon className="w-6 h-6 text-white drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white leading-tight">
                  {car.model}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                  {car.licensePlate}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Klient: <span className="text-slate-200 font-medium">{order.customerName}</span> · {order.title}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Price */}
            <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Wynagrodzenie
              </span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">
                {order.pricePLN} zł
              </span>
            </div>

            {/* Difficulty */}
            <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Trudność
              </span>
              <span className="text-sm font-bold text-amber-400">
                {order.difficulty}
              </span>
            </div>

            {/* Location */}
            <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Lokalizacja
              </span>
              <span className="text-sm font-bold text-sky-400">
                {car.state === 'parking' ? 'Parking zewnętrzny' : station?.name}
              </span>
            </div>

            {/* Patience */}
            <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Cierpliwość
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      order.patience > 50 ? 'bg-emerald-500' : order.patience > 25 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${order.patience}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 tabular-nums">
                  {Math.round(order.patience)}%
                </span>
              </div>
            </div>
          </div>

          {/* If car is waiting in parking */}
          {car.state === 'parking' && (
            <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Samochód czeka na wolne stanowisko warsztatowe</span>
              </div>
              <p className="text-xs text-slate-300">
                Wybierz wolny podnośnik, aby wprowadzić pojazd do warsztatu i rozpocząć zlecenie:
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  disabled={!station1Free}
                  onClick={() => onAssignToStation(car.id, 'station1')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    station1Free
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>Wjedź na Stanowisko 1 (Lewe)</span>
                  {station1Free ? <ArrowRight className="w-4 h-4" /> : '(Zajęte)'}
                </button>
                <button
                  disabled={!station2Free}
                  onClick={() => onAssignToStation(car.id, 'station2')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    station2Free
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>Wjedź na Stanowisko 2 (Prawe)</span>
                  {station2Free ? <ArrowRight className="w-4 h-4" /> : '(Zajęte)'}
                </button>
              </div>
            </div>
          )}

          {/* Missing Tool Alert from Władek */}
          {station && !station.toolCartOk && (
            <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="text-xs font-bold text-red-300">
                  Władek znowu ukrył klucz udarowy tego stanowiska!
                </h4>
                <p className="text-[11px] text-red-200">
                  Kliknij na migający na czerwono znacznik w warsztacie lub porozmawiaj z Władkiem, aby odzyskać narzędzie.
                </p>
              </div>
            </div>
          )}

          {/* Step-by-Step Execution Plan */}
          {car.state === 'on_lift' && station && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Etapy realizacji zlecenia
                </h3>
                <span className="text-xs text-slate-400">
                  Krok {order.currentStepIndex + 1} z {order.steps.length}
                </span>
              </div>

              <div className="space-y-2">
                {order.steps.map((step, idx) => {
                  const isCurrent = idx === order.currentStepIndex;
                  const isDone = step.completed;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-blue-950/50 border-blue-400 shadow-md ring-1 ring-blue-400/40'
                          : isDone
                          ? 'bg-slate-800/30 border-slate-800 opacity-60'
                          : 'bg-slate-800/40 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isDone
                              ? 'bg-emerald-500 text-slate-950'
                              : isCurrent
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Button for Current Step */}
                      {isCurrent && (
                        <div className="flex items-center flex-wrap gap-2">
                          {activeWorker ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold">
                              <span className="animate-spin text-sm">⚙️</span>
                              <span>{activeWorker.name} wykonuje ({Math.round(activeWorker.workProgress * 100)}%)</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {workers
                                .filter(w => w.assignedStation === station.id)
                                .map((stWorker) => (
                                  <button
                                    key={stWorker.id}
                                    onClick={() => {
                                      onAssignWorkerToStep(stWorker.id, station.id, step.id);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>Wyślij: {stWorker.name}</span>
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {station ? (
              <span>
                Stała załoga stanowiska:{' '}
                <span className="font-bold text-white">
                  {workers.filter(w => w.assignedStation === station.id).map(w => w.name).join(' oraz ')}
                </span>
              </span>
            ) : (
              <span>Wybierz wolne stanowisko, aby przypisać samochód do załogi</span>
            )}
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
