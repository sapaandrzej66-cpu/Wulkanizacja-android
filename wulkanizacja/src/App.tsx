/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { gameEngine } from './engine/gameEngine';
import { WorkerId } from './types/game';
import { soundManager } from './utils/audio';

import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { WorkerBar } from './components/WorkerBar';
import { ShopModal } from './components/ShopModal';
import { WladekDialog } from './components/WladekDialog';
import { TutorialGuide } from './components/TutorialGuide';
import { TitleScreen } from './components/TitleScreen';
import { BackgroundMusic } from './components/BackgroundMusic';

export default function App() {
  const [gameState, setGameState] = useState<'TITLE' | 'PLAYING'>('TITLE');
  const [, setTick] = useState(0);

  // Modals
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isWladekOpen, setIsWladekOpen] = useState(false);

  // Force re-render on engine state change
  useEffect(() => {
    gameEngine.setListener(() => {
      setTick(prev => prev + 1);
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'TITLE') {
        if (e.key === 'Enter' || e.key === ' ') {
          setGameState('PLAYING');
        }
        return;
      }

      if (e.key === 'Escape') {
        if (isShopOpen || isTutorialOpen || isWladekOpen) {
          setIsShopOpen(false);
          setIsTutorialOpen(false);
          setIsWladekOpen(false);
        } else {
          gameEngine.stats.isPaused = !gameEngine.stats.isPaused;
          setTick(prev => prev + 1);
        }
      } else if (e.key === 'p' || e.key === 'P') {
        gameEngine.stats.isPaused = !gameEngine.stats.isPaused;
        setTick(prev => prev + 1);
      } else if (e.key === '1') {
        gameEngine.selectedWorkerId = 'mirek';
        setTick(prev => prev + 1);
      } else if (e.key === '2') {
        gameEngine.selectedWorkerId = 'janusz';
        setTick(prev => prev + 1);
      } else if (e.key === '3') {
        gameEngine.selectedWorkerId = 'seba';
        setTick(prev => prev + 1);
      } else if (e.key === '4') {
        gameEngine.selectedWorkerId = 'darek';
        setTick(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isShopOpen, isTutorialOpen, isWladekOpen]);

  const waitingCars = gameEngine.cars.filter(c => c.state === 'parking');

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      <BackgroundMusic />
      {gameState === 'TITLE' ? (
        <TitleScreen onStartGame={() => setGameState('PLAYING')} />
      ) : (
        <>
          {/* Main 2.5D Isometric World Viewport */}
          <GameCanvas
            engine={gameEngine}
            onSelectCar={(_carId) => {
              // Direct station action executed immediately, no popup menu!
              soundManager.playClick();
            }}
            onOpenWladekDialog={() => {
              setIsWladekOpen(true);
            }}
          />

          {/* Top Bar Status HUD */}
          <HUD
            stats={gameEngine.stats}
            waitingCarsCount={waitingCars.length}
            activeMiniEvents={gameEngine.activeMiniEvents}
            onResolveMiniEvent={(id) => {
              gameEngine.resolveMiniEvent(id);
              setTick(prev => prev + 1);
            }}
            onTogglePause={() => {
              gameEngine.stats.isPaused = !gameEngine.stats.isPaused;
              setTick(prev => prev + 1);
            }}
            onSetSpeed={(speed) => {
              gameEngine.stats.speed = speed;
              setTick(prev => prev + 1);
            }}
            onToggleSound={() => {
              const newState = soundManager.toggle();
              gameEngine.stats.soundEnabled = newState;
              setTick(prev => prev + 1);
            }}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
          />

          {/* Bottom Dock with 2 Fixed Station Teams */}
          <WorkerBar
            workers={gameEngine.workers}
            selectedStationId={gameEngine.selectedStationId}
            onSelectStation={(stationId) => {
              gameEngine.selectedStationId = stationId;
              gameEngine.selectedWorkerId = stationId === 'station1' ? 'mirek' : 'seba';
              setTick(prev => prev + 1);
            }}
          />

          {/* Upgrades Shop Modal */}
          {isShopOpen && (
            <ShopModal
              upgrades={gameEngine.upgrades}
              money={gameEngine.stats.money}
              onBuyUpgrade={(id) => {
                const bought = gameEngine.buyUpgrade(id);
                if (bought) {
                  confetti({
                    particleCount: 40,
                    spread: 50,
                    origin: { y: 0.6 },
                  });
                }
              }}
              onClose={() => setIsShopOpen(false)}
            />
          )}

          {/* Władek Dialog Modal */}
          {isWladekOpen && (
            <WladekDialog
              wladek={gameEngine.wladek}
              onClose={() => setIsWladekOpen(false)}
              onScoldWladek={() => {
                gameEngine.interactWithWladek();
                setTick(prev => prev + 1);
              }}
              onRecoverTool={() => {
                gameEngine.recoverStolenTool();
                setTick(prev => prev + 1);
              }}
            />
          )}

          {/* Tutorial / Help Modal */}
          {isTutorialOpen && (
            <TutorialGuide onClose={() => setIsTutorialOpen(false)} />
          )}
        </>
      )}
    </div>
  );
}
