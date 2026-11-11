/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine } from '../engine/gameEngine';
import { isoToGrid, gridToIso, getDist, TILE_WIDTH, TILE_HEIGHT } from '../engine/pathfinding';
import {
  drawFloorAndBackground,
  drawZoneHighlight,
  drawCarLift,
  drawCar,
  drawMontazownica,
  drawWywazarka,
  drawToolCart,
  drawCompressor,
  drawTireRacks,
  drawOffice,
  drawWaitingRoom,
  drawWorkshopAccessories,
  drawWorker,
  drawWladek,
  drawStolenToolMarker,
  drawMiniEventMarkers,
  drawParticles
} from '../engine/spriteDrawers';
import { WORKSHOP_ZONES, InteractiveZone } from '../engine/workshopMap';
import { ZoomIn, ZoomOut, Maximize2, Crosshair, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface GameCanvasProps {
  engine: GameEngine;
  onSelectCar: (carId: string) => void;
  onOpenWladekDialog: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  engine,
  onSelectCar,
  onOpenWladekDialog,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera state: pan offset & zoom
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [hoveredZone, setHoveredZone] = useState<InteractiveZone | null>(null);
  const [hoveredWladek, setHoveredWladek] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Interaction tracking (pan & pinch)
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const lastTouchDistRef = useRef<number | null>(null);
  const dragDistanceRef = useRef(0);

  // Center camera on start with responsive zoom
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 640;
      const initialZoom = isMobile ? 0.72 : 1;

      // Center on workshop central point (grid: 12, 10)
      const centerIso = gridToIso(12, 10);
      setCamera(prev => ({
        ...prev,
        zoom: initialZoom,
        x: width / 2 - centerIso.x * initialZoom,
        y: height / 2 - centerIso.y * initialZoom + (isMobile ? 15 : -20),
      }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main 60fps render loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      engine.update(dt);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;

          if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
          }

          ctx.save();
          ctx.scale(dpr, dpr);

          // Clear viewport with industrial dark charcoal
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, w, h);

          // Apply camera transform
          ctx.save();
          ctx.translate(camera.x, camera.y);
          ctx.scale(camera.zoom, camera.zoom);

          const tick = engine.tickCount;

          // 1. Draw floor tiles, walls, partitions, building shell, banners
          drawFloorAndBackground(ctx, tick);

          // 2. Draw wall-mounted tool boards, paste buckets, air reels, and accessories
          drawWorkshopAccessories(ctx, tick);

          // 3. Draw static structures & machines
          // Station 1 Lift
          const s1 = engine.stations.find(s => s.id === 'station1')!;
          drawCarLift(ctx, s1, 11, 5);
          drawMontazownica(ctx, s1, 9, 2, tick);
          drawWywazarka(ctx, s1, 13, 2, tick);
          drawToolCart(ctx, 15, 3, s1.toolCartOk);

          // Station 2 Lift
          const s2 = engine.stations.find(s => s.id === 'station2')!;
          drawCarLift(ctx, s2, 11, 12);
          drawMontazownica(ctx, s2, 9, 15, tick);
          drawWywazarka(ctx, s2, 13, 15, tick);
          drawToolCart(ctx, 15, 14, s2.toolCartOk);

          // Tire storage racks
          drawTireRacks(ctx, 20, 2);
          drawTireRacks(ctx, 23, 2);

          // Compressor & parts
          drawCompressor(ctx, 16, 8, tick);

          // Office & Waiting room
          drawOffice(ctx, tick);
          drawWaitingRoom(ctx, tick);

          // Stolen tool marker (if Władek hid one!)
          if (engine.wladek.stolenToolLocation && engine.wladek.stolenToolName) {
            drawStolenToolMarker(
              ctx,
              engine.wladek.stolenToolLocation,
              engine.wladek.stolenToolName,
              tick
            );
          }

          // Władek mischievous mini-events (disabled compressor, jammed changer, etc.)
          if (engine.activeMiniEvents && engine.activeMiniEvents.length > 0) {
            drawMiniEventMarkers(ctx, engine.activeMiniEvents, tick);
          }

          // 3. Draw Cars (sorted by depth)
          for (const car of engine.cars) {
            const station = engine.stations.find(s => s.id === car.assignedStationId) || null;
            drawCar(ctx, car, station, tick);
          }

          // 4. Draw Workers & Władek
          for (const worker of engine.workers) {
            const isSelected = engine.selectedWorkerId === worker.id;
            drawWorker(ctx, worker, isSelected, tick);
          }

          drawWladek(ctx, engine.wladek, hoveredWladek, tick);

          // 5. Particles
          drawParticles(ctx, engine.particles);

          ctx.restore();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [camera, engine, hoveredWladek]);

  // Screen to world click resolution
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      dragDistanceRef.current += Math.hypot(dx, dy);

      setCamera(prev => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }

    // Hit test Władek on hover
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const grid = isoToGrid(mouseX, mouseY, camera.x, camera.y, camera.zoom);
      const distWladek = getDist(grid, engine.wladek.pos);
      setHoveredWladek(distWladek < 1.5);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    // If it was a clean click without major dragging (< 6px), handle interaction
    if (dragDistanceRef.current < 6 && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      handleCanvasClick(mouseX, mouseY);
    }
  };

  // Touch pinch to zoom handler
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

      if (lastTouchDistRef.current !== null) {
        const factor = dist / lastTouchDistRef.current;
        setCamera(prev => ({
          ...prev,
          zoom: Math.max(0.6, Math.min(2.2, prev.zoom * factor)),
        }));
      }
      lastTouchDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistRef.current = null;
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(0.6, Math.min(2.2, prev.zoom * zoomFactor)),
    }));
  };

  // Handle Point & Click on elements
  const handleCanvasClick = (screenX: number, screenY: number) => {
    const grid = isoToGrid(screenX, screenY, camera.x, camera.y, camera.zoom);

    // 1. Check click on Władek
    const distWladek = getDist(grid, engine.wladek.pos);
    if (distWladek < 1.6) {
      engine.interactWithWladek();
      onOpenWladekDialog();
      return;
    }

    // 2. Check click on stolen tool marker (if any)
    if (engine.wladek.stolenToolLocation) {
      const distTool = getDist(grid, engine.wladek.stolenToolLocation);
      if (distTool < 1.8) {
        engine.recoverStolenTool();
        return;
      }
    }

    // 2b. Check click on Władek's active mini-events (disabled machine, fuse, etc.)
    if (engine.activeMiniEvents && engine.activeMiniEvents.length > 0) {
      for (const ev of engine.activeMiniEvents) {
        const distEv = getDist(grid, ev.pos);
        if (distEv < 2.5) {
          engine.resolveMiniEvent(ev.id);
          return;
        }
      }
    }

    // 3. Check click on Workers
    for (const worker of engine.workers) {
      const dist = getDist(grid, worker.pos);
      if (dist < 1.6) {
        engine.selectedWorkerId = worker.id;
        worker.speechText = `Melduję się, szefie!`;
        worker.speechTimer = 120;
        return;
      }
    }

    // 4. Check click on Cars: DIRECT ACTION ON STATION WITHOUT MENU!
    for (const car of engine.cars) {
      const dist = getDist(grid, car.pos);
      if (dist < 2.5) {
        engine.handleCarClick(car.id);
        return;
      }
    }

    // 5. Check click on Lift 1 or Lift 2 directly: trigger next station action!
    const distLift1 = getDist(grid, { x: 11, y: 5 });
    if (distLift1 < 2.5) {
      engine.performNextStationAction('station1');
      return;
    }

    const distLift2 = getDist(grid, { x: 11, y: 12 });
    if (distLift2 < 2.5) {
      engine.performNextStationAction('station2');
      return;
    }

    // 6. Check click on Montażownica / Wyważarka / Tools: trigger action!
    const zone = WORKSHOP_ZONES.find(z =>
      grid.x >= z.bounds.minX && grid.x <= z.bounds.maxX &&
      grid.y >= z.bounds.minY && grid.y <= z.bounds.maxY
    );

    if (zone && zone.stationId) {
      engine.performNextStationAction(zone.stationId);
      return;
    }
  };

  // Quick camera jump presets
  const jumpToZone = (gx: number, gy: number) => {
    if (!canvasRef.current) return;
    const w = canvasRef.current.clientWidth;
    const h = canvasRef.current.clientHeight;
    const iso = gridToIso(gx, gy);
    setCamera({
      x: w / 2 - iso.x * camera.zoom,
      y: h / 2 - iso.y * camera.zoom,
      zoom: camera.zoom,
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none block"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      />

      {/* Camera Zoom Controls - Neatly pinned to bottom-right out of the way */}
      <div className="absolute right-2 sm:right-4 bottom-14 sm:bottom-20 flex flex-col gap-1 sm:gap-2 z-10 pointer-events-auto">
        <button
          onClick={() => setCamera(prev => ({ ...prev, zoom: Math.min(2.2, prev.zoom + 0.2) }))}
          className="p-2 sm:p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 rounded-xl shadow-lg transition-transform active:scale-95"
          title="Przybliż widok (+)"
        >
          <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => setCamera(prev => ({ ...prev, zoom: Math.max(0.55, prev.zoom - 0.2) }))}
          className="p-2 sm:p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 rounded-xl shadow-lg transition-transform active:scale-95"
          title="Oddal widok (-)"
        >
          <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => {
            const centerIso = gridToIso(12, 10);
            if (canvasRef.current) {
              const isMobile = window.innerWidth < 640;
              const defZoom = isMobile ? 0.72 : 1;
              setCamera({
                x: canvasRef.current.clientWidth / 2 - centerIso.x * defZoom,
                y: canvasRef.current.clientHeight / 2 - centerIso.y * defZoom + (isMobile ? 15 : -20),
                zoom: defZoom,
              });
            }
          }}
          className="p-2 sm:p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 rounded-xl shadow-lg transition-transform active:scale-95"
          title="Wycentruj warsztat"
        >
          <Crosshair className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* MOBILE Quick Jump Collapsible Drawer (Screen < 640px) */}
      <div className="flex sm:hidden absolute left-2 top-11 z-10 pointer-events-auto items-center gap-1">
        <button
          onClick={() => setShowMobileNav(prev => !prev)}
          className="flex items-center gap-1 px-2 py-1 bg-slate-900/90 border border-slate-700 text-slate-200 text-[10px] font-bold rounded-lg shadow-md backdrop-blur-md active:scale-95"
        >
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>Skocz</span>
          {showMobileNav ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showMobileNav && (
          <div className="flex items-center gap-1 bg-slate-950/95 border border-slate-800 rounded-lg p-1 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => { jumpToZone(11, 5); setShowMobileNav(false); }}
              className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-600 text-white rounded"
            >
              St 1
            </button>
            <button
              onClick={() => { jumpToZone(11, 12); setShowMobileNav(false); }}
              className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-600 text-white rounded"
            >
              St 2
            </button>
            <button
              onClick={() => { jumpToZone(3, 7); setShowMobileNav(false); }}
              className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-200 rounded"
            >
              Parking
            </button>
            <button
              onClick={() => { jumpToZone(21, 4); setShowMobileNav(false); }}
              className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-200 rounded"
            >
              Magazyn
            </button>
            <button
              onClick={() => { jumpToZone(21, 17); setShowMobileNav(false); }}
              className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-200 rounded"
            >
              Biuro
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP Quick Jump Bar (Screen >= 640px) */}
      <div className="hidden sm:flex absolute left-4 top-24 flex-wrap gap-1.5 z-10 pointer-events-auto max-w-sm">
        <button
          onClick={() => jumpToZone(11, 5)}
          className="px-2.5 py-1 text-xs font-semibold bg-slate-900/90 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700/80 rounded-lg shadow backdrop-blur transition-colors"
        >
          Stanowisko 1
        </button>
        <button
          onClick={() => jumpToZone(11, 12)}
          className="px-2.5 py-1 text-xs font-semibold bg-slate-900/90 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700/80 rounded-lg shadow backdrop-blur transition-colors"
        >
          Stanowisko 2
        </button>
        <button
          onClick={() => jumpToZone(3, 7)}
          className="px-2.5 py-1 text-xs font-semibold bg-slate-900/90 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700/80 rounded-lg shadow backdrop-blur transition-colors"
        >
          Parking
        </button>
        <button
          onClick={() => jumpToZone(21, 4)}
          className="px-2.5 py-1 text-xs font-semibold bg-slate-900/90 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700/80 rounded-lg shadow backdrop-blur transition-colors"
        >
          Magazyn
        </button>
        <button
          onClick={() => jumpToZone(21, 17)}
          className="px-2.5 py-1 text-xs font-semibold bg-slate-900/90 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700/80 rounded-lg shadow backdrop-blur transition-colors"
        >
          Biuro / Kasa
        </button>
      </div>
    </div>
  );
};
