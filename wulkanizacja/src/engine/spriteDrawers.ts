/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { gridToIso, TILE_WIDTH, TILE_HEIGHT, MAP_COLS, MAP_ROWS } from './pathfinding';
import { Worker, WladekCharacter, Station, Car, Particle, WladekMiniEvent } from '../types/game';
import { WORKSHOP_ZONES, InteractiveZone } from './workshopMap';

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

// Helper for drawing isometric tiles
export function drawIsometricTile(
  ctx: CanvasRenderingContext2D,
  gx: number,
  gy: number,
  fillColor: string,
  strokeColor: string = 'rgba(0,0,0,0.08)'
) {
  const iso = gridToIso(gx, gy);
  const hw = TILE_WIDTH / 2;
  const hh = TILE_HEIGHT / 2;

  ctx.beginPath();
  ctx.moveTo(iso.x, iso.y);
  ctx.lineTo(iso.x + hw, iso.y + hh);
  ctx.lineTo(iso.x, iso.y + TILE_HEIGHT);
  ctx.lineTo(iso.x - hw, iso.y + hh);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();

  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// Draw entire floor, zones, room partitions, and building architectural shell
export function drawFloorAndBackground(ctx: CanvasRenderingContext2D, tick: number) {
  // 1. Outside parking & interior room floors with distinctive materials
  for (let x = 0; x < MAP_COLS; x++) {
    for (let y = 0; y < MAP_ROWS; y++) {
      if (x < 7) {
        // Outside parking lot (dark asphalt with texture)
        const isParkingSlot = (x === 2 || x === 4) && (y === 3 || y === 7 || y === 11);
        const isStripe = (x === 1 || x === 5) && y >= 2 && y <= 13 && y % 4 === 0;
        const asphaltColor = (x + y) % 2 === 0 ? '#1f242d' : '#181d24';
        drawIsometricTile(ctx, x, y, isStripe ? '#facc15' : isParkingSlot ? '#262d38' : asphaltColor, 'rgba(0,0,0,0.25)');
      } else if (x >= 18 && y >= 14) {
        // Office Room floor (luxurious wood parquet with boundary trim)
        const woodColor = (x + y) % 2 === 0 ? '#b47b46' : '#a26c39';
        drawIsometricTile(ctx, x, y, woodColor, 'rgba(70,35,10,0.2)');
      } else if (x >= 13 && y >= 17) {
        // Waiting Room Lounge floor (cozy slate-blue patterned carpet)
        const carpetColor = (x + y) % 2 === 0 ? '#1e293b' : '#172033';
        drawIsometricTile(ctx, x, y, carpetColor, 'rgba(56,189,248,0.06)');
      } else if (x >= 18 && y < 7) {
        // Tire Storage Warehouse floor (sealed grey industrial epoxy with safety gloss)
        const whColor = (x + y) % 2 === 0 ? '#64748b' : '#57677d';
        drawIsometricTile(ctx, x, y, whColor, 'rgba(0,0,0,0.15)');
      } else {
        // Main Workshop Service Hall (industrial checkered heavy-duty tiles)
        const isCheckered = (x + y) % 2 === 0;
        let tileColor = isCheckered ? '#94a3b8' : '#8292a6';

        // Oil & grease marks around lifts
        if ((x >= 10 && x <= 12 && y >= 4 && y <= 6) || (x >= 10 && x <= 12 && y >= 11 && y <= 13)) {
          tileColor = isCheckered ? '#596579' : '#4d596c';
        }

        drawIsometricTile(ctx, x, y, tileColor, 'rgba(0,0,0,0.12)');
      }
    }
  }

  // 2. Draw Floor Safety Markings & Stencils
  drawFloorMarkings(ctx);

  // 3. Draw Building Outline, Outer Walls, Roll-up Gate, and Signboard
  drawBuildingShellAndWalls(ctx, tick);

  // 4. Draw Room Partition Walls (Office & Waiting Lounge)
  drawRoomPartitions(ctx);
}

// Floor Safety Zones and Stenciled Bay Labels
function drawFloorMarkings(ctx: CanvasRenderingContext2D) {
  // Stanowisko 1 safety yellow box (x: 8..14, y: 3..7)
  drawSafetyZoneOutline(ctx, 8, 3, 14, 7, 'STANOWISKO 1');

  // Stanowisko 2 safety yellow box (x: 8..14, y: 10..14)
  drawSafetyZoneOutline(ctx, 8, 10, 14, 14, 'STANOWISKO 2');

  // Warehouse border line along x = 18, y: 0..7
  const whStart = gridToIso(18, 0);
  const whEnd = gridToIso(18, 7);
  ctx.save();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(whStart.x, whStart.y);
  ctx.lineTo(whEnd.x, whEnd.y);
  ctx.stroke();
  ctx.restore();

  // Parking stall labels on asphalt
  const p1 = gridToIso(3, 3);
  const p2 = gridToIso(3, 7);
  const p3 = gridToIso(3, 11);
  ctx.save();
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('P1', p1.x, p1.y + 12);
  ctx.fillText('P2', p2.x, p2.y + 12);
  ctx.fillText('P3', p3.x, p3.y + 12);
  ctx.restore();
}

function drawSafetyZoneOutline(
  ctx: CanvasRenderingContext2D,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  label: string
) {
  const pTop = gridToIso(minX, minY);
  const pRight = gridToIso(maxX, minY);
  const pBottom = gridToIso(maxX, maxY);
  const pLeft = gridToIso(minX, maxY);

  ctx.save();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  ctx.beginPath();
  ctx.moveTo(pTop.x, pTop.y);
  ctx.lineTo(pRight.x, pRight.y);
  ctx.lineTo(pBottom.x, pBottom.y);
  ctx.lineTo(pLeft.x, pLeft.y);
  ctx.closePath();
  ctx.stroke();

  // Stenciled bay label
  const pCenter = gridToIso((minX + maxX) / 2, maxY - 0.2);
  ctx.fillStyle = 'rgba(250, 204, 21, 0.85)';
  ctx.font = 'bold 9px "Oswald", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, pCenter.x, pCenter.y + 10);
  ctx.restore();
}

// Draw Building Shell, Perimeter Walls, Foundation, and Main Facade Sign
function drawBuildingShellAndWalls(ctx: CanvasRenderingContext2D, tick: number) {
  const wallHeight = 92;

  // 1. Back Wall along y = 0 (from x = 7 to MAP_COLS)
  for (let x = 7; x < MAP_COLS; x++) {
    const isoStart = gridToIso(x, 0);
    const isoEnd = gridToIso(x + 1, 0);

    ctx.beginPath();
    ctx.moveTo(isoStart.x, isoStart.y);
    ctx.lineTo(isoEnd.x, isoEnd.y);
    ctx.lineTo(isoEnd.x, isoEnd.y - wallHeight);
    ctx.lineTo(isoStart.x, isoStart.y - wallHeight);
    ctx.closePath();

    ctx.fillStyle = (x % 2 === 0) ? '#334155' : '#2b3748';
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Brick mortar lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    for (let h = 16; h < wallHeight; h += 16) {
      ctx.beginPath();
      ctx.moveTo(isoStart.x, isoStart.y - h);
      ctx.lineTo(isoEnd.x, isoEnd.y - h);
      ctx.stroke();
    }

    // Windows on upper workshop wall (high industrial clerestory windows)
    if (x === 9 || x === 11 || x === 14 || x === 21) {
      const winX = (isoStart.x + isoEnd.x) / 2;
      const winY = (isoStart.y + isoEnd.y) / 2 - 58;

      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(winX - 12, winY - 14, 24, 18);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(winX - 12, winY - 14, 24, 18);
      // Window cross
      ctx.beginPath();
      ctx.moveTo(winX, winY - 14);
      ctx.lineTo(winX, winY + 4);
      ctx.moveTo(winX - 12, winY - 5);
      ctx.lineTo(winX + 12, winY - 5);
      ctx.stroke();
    }

    // Heavy yellow steel structural column pillars with hazard striping
    if (x === 7 || x === 13 || x === 18 || x === MAP_COLS - 1) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(isoStart.x - 4, isoStart.y - wallHeight, 8, wallHeight);
      ctx.strokeStyle = '#b45309';
      ctx.strokeRect(isoStart.x - 4, isoStart.y - wallHeight, 8, wallHeight);

      // Black hazard diagonal stripes
      ctx.fillStyle = '#0f172a';
      for (let s = 0; s < 6; s++) {
        ctx.fillRect(isoStart.x - 4, isoStart.y - wallHeight + s * 16, 8, 8);
      }
    }
  }

  // 2. Right Side Building Exterior Wall (x = MAP_COLS, y from 0 to MAP_ROWS)
  for (let y = 0; y < MAP_ROWS; y++) {
    const isoStart = gridToIso(MAP_COLS, y);
    const isoEnd = gridToIso(MAP_COLS, y + 1);

    ctx.beginPath();
    ctx.moveTo(isoStart.x, isoStart.y);
    ctx.lineTo(isoEnd.x, isoEnd.y);
    ctx.lineTo(isoEnd.x, isoEnd.y - wallHeight);
    ctx.lineTo(isoStart.x, isoStart.y - wallHeight);
    ctx.closePath();

    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
  }

  // 3. Facade dividing parking from workshop along x = 7
  // Top section above entrance gate
  for (let y = 0; y < 4; y++) {
    const isoStart = gridToIso(7, y);
    const isoEnd = gridToIso(7, y + 1);

    ctx.beginPath();
    ctx.moveTo(isoStart.x, isoStart.y);
    ctx.lineTo(isoEnd.x, isoEnd.y);
    ctx.lineTo(isoEnd.x, isoEnd.y - wallHeight);
    ctx.lineTo(isoStart.x, isoStart.y - wallHeight);
    ctx.closePath();
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.stroke();
  }

  // Bottom section past gate (y from 12 to MAP_ROWS)
  for (let y = 12; y < MAP_ROWS; y++) {
    const isoStart = gridToIso(7, y);
    const isoEnd = gridToIso(7, y + 1);

    ctx.beginPath();
    ctx.moveTo(isoStart.x, isoStart.y);
    ctx.lineTo(isoEnd.x, isoEnd.y);
    ctx.lineTo(isoEnd.x, isoEnd.y - wallHeight);
    ctx.lineTo(isoStart.x, isoStart.y - wallHeight);
    ctx.closePath();
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.stroke();
  }

  // 4. Giant Sectional Roller Shutter Garage Gate (x = 7, y from 4 to 12)
  const gateTop = gridToIso(7, 4);
  const gateBottom = gridToIso(7, 12);

  ctx.save();
  // Overhead door lintel / beam with caution stripes
  ctx.beginPath();
  ctx.moveTo(gateTop.x, gateTop.y - wallHeight);
  ctx.lineTo(gateBottom.x, gateBottom.y - wallHeight);
  ctx.lineTo(gateBottom.x, gateBottom.y - 70);
  ctx.lineTo(gateTop.x, gateTop.y - 70);
  ctx.closePath();
  ctx.fillStyle = '#eab308';
  ctx.fill();
  ctx.strokeStyle = '#854d0e';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Coiled overhead door curtain / segments rolled up
  ctx.fillStyle = '#64748b';
  for (let seg = 0; seg < 4; seg++) {
    const sy = -wallHeight + seg * 5;
    ctx.beginPath();
    ctx.moveTo(gateTop.x, gateTop.y + sy);
    ctx.lineTo(gateBottom.x, gateBottom.y + sy);
    ctx.lineTo(gateBottom.x, gateBottom.y + sy + 4);
    ctx.lineTo(gateTop.x, gateTop.y + sy + 4);
    ctx.closePath();
    ctx.fill();
  }

  // Steel vertical guide tracks on left and right of gate
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(gateTop.x - 3, gateTop.y - wallHeight, 6, wallHeight);
  ctx.fillRect(gateBottom.x - 3, gateBottom.y - wallHeight, 6, wallHeight);

  // Gate threshold threshold hazard stripe on floor
  ctx.beginPath();
  ctx.moveTo(gateTop.x, gateTop.y);
  ctx.lineTo(gateBottom.x, gateBottom.y);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Yellow entrance bollards at gate entrance corners
  drawSafetyBollard(ctx, gateTop.x - 10, gateTop.y);
  drawSafetyBollard(ctx, gateBottom.x - 10, gateBottom.y);

  // 5. Grand Illuminated Workshop Signboard
  const midX = (gateTop.x + gateBottom.x) / 2;
  const midY = (gateTop.y + gateBottom.y) / 2 - 82;

  ctx.fillStyle = '#dc2626'; // Red illuminated box
  ctx.beginPath();
  ctx.roundRect(midX - 110, midY - 14, 220, 26, 6);
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Glowing neon text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Oswald", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('WULKANIZACJA 24H • WYMIANA OPON • GEOMETRIA', midX, midY + 4);
  ctx.restore();

  // 6. Overhead Industrial Steel Roof Trusses & Suspended Fluorescent Lighting
  drawOverheadTrussesAndLighting(ctx, tick);
}

// Safety Yellow/Black Bollard
function drawSafetyBollard(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#eab308';
  ctx.fillRect(x - 3, y - 18, 6, 18);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 3, y - 14, 6, 4);
  ctx.fillRect(x - 3, y - 6, 6, 4);
  ctx.strokeStyle = '#713f12';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 3, y - 18, 6, 18);
  ctx.restore();
}

// Overhead Trusses & Fluorescent Lamp Fixtures
function drawOverheadTrussesAndLighting(ctx: CanvasRenderingContext2D, tick: number) {
  const trussYOffset = 88;

  // Overhead I-beams spanning across workshop
  const b1 = gridToIso(7, 5);
  const b1End = gridToIso(25, 5);
  const b2 = gridToIso(7, 12);
  const b2End = gridToIso(25, 12);

  ctx.save();
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.45)';
  ctx.lineWidth = 4;

  // Beam 1 over Bay 1
  ctx.beginPath();
  ctx.moveTo(b1.x, b1.y - trussYOffset);
  ctx.lineTo(b1End.x, b1End.y - trussYOffset);
  ctx.stroke();

  // Beam 2 over Bay 2
  ctx.beginPath();
  ctx.moveTo(b2.x, b2.y - trussYOffset);
  ctx.lineTo(b2End.x, b2End.y - trussYOffset);
  ctx.stroke();

  // Suspended fluorescent tube fixtures with ambient cone
  const lampPositions = [
    { x: 11, y: 5 },  // Over Bay 1
    { x: 11, y: 12 }, // Over Bay 2
    { x: 21, y: 3 },  // Over Warehouse
    { x: 21, y: 16 }  // Over Office
  ];

  for (const lamp of lampPositions) {
    const iso = gridToIso(lamp.x, lamp.y);
    const lampY = iso.y - 70;

    // Hanging wire
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(iso.x, lampY - 18);
    ctx.lineTo(iso.x, lampY);
    ctx.stroke();

    // Fluorescent fixture body
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(iso.x - 14, lampY, 28, 4);

    // Glowing tube
    const flicker = Math.sin(tick * 0.2 + lamp.x) * 0.1 + 0.9;
    ctx.fillStyle = `rgba(240, 249, 255, ${0.9 * flicker})`;
    ctx.fillRect(iso.x - 12, lampY + 2, 24, 2);

    // Subtle ambient floor glow cone
    ctx.beginPath();
    ctx.ellipse(iso.x, iso.y + 10, 48, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.fill();
  }

  ctx.restore();
}

// Room Partitions (Glass office partitions & waiting lounge divider)
function drawRoomPartitions(ctx: CanvasRenderingContext2D) {
  const wallH = 50;

  // 1. Office Back Divider Wall along y = 14 (from x = 18 to 25)
  for (let x = 18; x < 25; x++) {
    const start = gridToIso(x, 14);
    const end = gridToIso(x + 1, 14);

    ctx.save();
    // Lower aluminum bulkhead (14px)
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(end.x, end.y - 14);
    ctx.lineTo(start.x, start.y - 14);
    ctx.closePath();
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    // Acoustic Safety Glass partition above
    ctx.beginPath();
    ctx.moveTo(start.x, start.y - 14);
    ctx.lineTo(end.x, end.y - 14);
    ctx.lineTo(end.x, end.y - wallH);
    ctx.lineTo(start.x, start.y - wallH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(186, 230, 253, 0.28)'; // Glass tint
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  // 2. Office Left Divider Wall along x = 18 (y from 14 to 21) with DOOR at y = 16
  for (let y = 14; y < 21; y++) {
    if (y === 16) {
      // Open doorway! Draw door frame and welcome mat
      const dStart = gridToIso(18, y);
      const dEnd = gridToIso(18, y + 1);

      ctx.save();
      // Black rubber doormat on floor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect((dStart.x + dEnd.x) / 2 - 12, (dStart.y + dEnd.y) / 2 - 4, 24, 8);

      // Aluminum door frame lintel above
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dStart.x, dStart.y - wallH);
      ctx.lineTo(dEnd.x, dEnd.y - wallH);
      ctx.stroke();

      // Sign above door: "BIURO / KASA"
      ctx.fillStyle = '#0284c7';
      ctx.fillRect((dStart.x + dEnd.x) / 2 - 20, (dStart.y + dEnd.y) / 2 - wallH - 12, 40, 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 6px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BIURO • KASA', (dStart.x + dEnd.x) / 2, (dStart.y + dEnd.y) / 2 - wallH - 4);
      ctx.restore();
      continue;
    }

    const start = gridToIso(18, y);
    const end = gridToIso(18, y + 1);

    ctx.save();
    // Lower aluminum bulkhead
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(end.x, end.y - 14);
    ctx.lineTo(start.x, start.y - 14);
    ctx.closePath();
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    // Glass panel
    ctx.beginPath();
    ctx.moveTo(start.x, start.y - 14);
    ctx.lineTo(end.x, end.y - 14);
    ctx.lineTo(end.x, end.y - wallH);
    ctx.lineTo(start.x, start.y - wallH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(186, 230, 253, 0.28)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  // 3. Waiting Lounge low decorative wood partition divider (x from 13 to 17, along y = 17)
  const lStart = gridToIso(13, 17);
  const lEnd = gridToIso(17, 17);

  ctx.save();
  // Low wood slat divider wall
  ctx.beginPath();
  ctx.moveTo(lStart.x, lStart.y);
  ctx.lineTo(lEnd.x, lEnd.y);
  ctx.lineTo(lEnd.x, lEnd.y - 20);
  ctx.lineTo(lStart.x, lStart.y - 20);
  ctx.closePath();
  ctx.fillStyle = '#78350f';
  ctx.fill();
  ctx.strokeStyle = '#451a03';
  ctx.stroke();

  // Vertical timber slats
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.5;
  for (let s = 0; s < 8; s++) {
    const sx = lStart.x + (lEnd.x - lStart.x) * (s / 8);
    const sy = lStart.y + (lEnd.y - lStart.y) * (s / 8);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy - 20);
    ctx.stroke();
  }

  // Sign: "POCZEKALNIA"
  ctx.fillStyle = '#1e293b';
  ctx.fillRect((lStart.x + lEnd.x) / 2 - 24, (lStart.y + lEnd.y) / 2 - 28, 48, 10);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 7px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('POCZEKALNIA', (lStart.x + lEnd.x) / 2, (lStart.y + lEnd.y) / 2 - 20);
  ctx.restore();
}


// Draw interactive zone indicator (glow or dashed footprint)
export function drawZoneHighlight(
  ctx: CanvasRenderingContext2D,
  zone: InteractiveZone,
  isHovered: boolean,
  isSelected: boolean,
  tick: number
) {
  const iso = gridToIso(zone.gridPos.x, zone.gridPos.y);

  if (isHovered || isSelected) {
    ctx.save();
    const pulse = Math.sin(tick * 0.08) * 0.2 + 0.8;
    ctx.strokeStyle = isSelected ? '#10b981' : '#38bdf8';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.setLineDash([4, 4]);

    const hw = TILE_WIDTH * 0.8;
    const hh = TILE_HEIGHT * 0.8;

    ctx.beginPath();
    ctx.ellipse(iso.x, iso.y + TILE_HEIGHT / 2, hw, hh, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Small label tag
    ctx.fillStyle = isSelected ? '#065f46' : 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(iso.x - 45, iso.y - 25, 90, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(zone.name.split(':')[0], iso.x, iso.y - 13);

    ctx.restore();
  }
}

// Draw Hydraulic Car Lift
export function drawCarLift(
  ctx: CanvasRenderingContext2D,
  station: Station,
  gx: number,
  gy: number
) {
  const isoCenter = gridToIso(gx, gy);
  const liftHeightPx = station.liftY * 34; // 0 to 34 pixels up

  // Base steel floor plates
  ctx.save();
  ctx.fillStyle = '#475569';
  ctx.fillRect(isoCenter.x - 28, isoCenter.y + 4, 56, 10);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(isoCenter.x - 28, isoCenter.y + 4, 56, 10);

  // Hydraulic columns (left & right)
  const colHeight = 55;
  [-24, 24].forEach((offsetX) => {
    // Outer column
    ctx.fillStyle = '#dc2626'; // Red lift column
    ctx.fillRect(isoCenter.x + offsetX - 5, isoCenter.y - colHeight + 10, 10, colHeight);
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1;
    ctx.strokeRect(isoCenter.x + offsetX - 5, isoCenter.y - colHeight + 10, 10, colHeight);

    // Inner chrome cylinder
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(isoCenter.x + offsetX - 2, isoCenter.y - colHeight + 12, 4, colHeight - 4);

    // Column motor box on right column
    if (offsetX === 24) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(isoCenter.x + offsetX + 5, isoCenter.y - 30, 8, 18);
      // Up/Down button indicators
      ctx.fillStyle = station.liftMoving === 'raising' ? '#22c55e' : '#475569';
      ctx.fillRect(isoCenter.x + offsetX + 7, isoCenter.y - 28, 4, 4);
      ctx.fillStyle = station.liftMoving === 'lowering' ? '#f59e0b' : '#475569';
      ctx.fillRect(isoCenter.x + offsetX + 7, isoCenter.y - 20, 4, 4);
    }
  });

  // Movable lift arms & pad platform
  const armY = isoCenter.y - liftHeightPx + 4;
  ctx.fillStyle = '#eab308'; // Yellow lift arms
  ctx.fillRect(isoCenter.x - 26, armY, 52, 6);
  ctx.strokeStyle = '#854d0e';
  ctx.strokeRect(isoCenter.x - 26, armY, 52, 6);

  // Rubber lift pads
  [-20, 20].forEach((padX) => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(isoCenter.x + padX - 4, armY - 3, 8, 3);
  });

  ctx.restore();
}

// Draw Car in Isometric 2.5D
export function drawCar(
  ctx: CanvasRenderingContext2D,
  car: Car,
  station: Station | null,
  tick: number
) {
  const iso = gridToIso(car.pos.x, car.pos.y);
  const liftElevation = (station && car.state === 'on_lift') ? station.liftY * 34 : 0;
  const baseHeight = iso.y - liftElevation;

  ctx.save();

  // Shadow on ground (only if lifted)
  if (liftElevation > 0) {
    ctx.beginPath();
    ctx.ellipse(iso.x, iso.y + 12, 38, 16, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();
  }

  // Car chassis drawing based on bodyType
  const bodyType = car.bodyType || 'sedan';
  const bodyColor = car.color;

  let carWidth = 68;
  let cabinLeft = 14;
  let cabinWidth = 38;
  let cabinHeight = 16;
  let bodyHeight = 20;

  if (bodyType === 'compact') {
    carWidth = 50;
    cabinLeft = 10;
    cabinWidth = 30;
    cabinHeight = 15;
  } else if (bodyType === 'van') {
    carWidth = 78;
    cabinLeft = 12;
    cabinWidth = 54;
    cabinHeight = 22;
    bodyHeight = 22;
  } else if (bodyType === 'wagon') {
    carWidth = 72;
    cabinLeft = 14;
    cabinWidth = 46;
    cabinHeight = 16;
  } else if (bodyType === 'suv') {
    carWidth = 72;
    cabinLeft = 14;
    cabinWidth = 42;
    cabinHeight = 19;
    bodyHeight = 22;
  } else if (bodyType === 'sport') {
    carWidth = 72;
    cabinLeft = 16;
    cabinWidth = 34;
    cabinHeight = 14;
    bodyHeight = 18;
  } else if (bodyType === 'truck') {
    carWidth = 74;
    cabinLeft = 12;
    cabinWidth = 26;
    cabinHeight = 19;
  } else if (bodyType === 'hatchback') {
    carWidth = 64;
    cabinLeft = 12;
    cabinWidth = 38;
    cabinHeight = 16;
  }

  // Car lower body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.roundRect(iso.x - carWidth / 2, baseHeight - 14, carWidth, bodyHeight, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Dark plastic protective cladding for SUVs & Trucks
  if (bodyType === 'suv' || bodyType === 'truck') {
    ctx.fillStyle = '#334155';
    ctx.fillRect(iso.x - carWidth / 2, baseHeight + bodyHeight - 18, carWidth, 4);
  }

  // Open cargo bed for truck (Żuk)
  if (bodyType === 'truck') {
    // Wooden / metal cargo bed
    ctx.fillStyle = '#78350f';
    ctx.fillRect(iso.x - carWidth / 2 + 40, baseHeight - 20, 32, 10);
    ctx.strokeStyle = '#451a03';
    ctx.strokeRect(iso.x - carWidth / 2 + 40, baseHeight - 20, 32, 10);
    // Stakes
    for (let bx = 0; bx < 32; bx += 8) {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(iso.x - carWidth / 2 + 40 + bx, baseHeight - 25, 3, 15);
    }
  }

  // Car cabin / roof
  const roofTop = baseHeight - 14 - cabinHeight;
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.roundRect(iso.x - carWidth / 2 + cabinLeft, roofTop, cabinWidth, cabinHeight + 2, [6, 6, 0, 0]);
  ctx.fill();
  ctx.stroke();

  // Roof rails on Wagon & SUV
  if (bodyType === 'wagon' || bodyType === 'suv') {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(iso.x - carWidth / 2 + cabinLeft + 4, roofTop);
    ctx.lineTo(iso.x - carWidth / 2 + cabinLeft + cabinWidth - 4, roofTop);
    ctx.stroke();
  }

  // Rear Racing Wing / Spoiler for Sport
  if (bodyType === 'sport') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(iso.x + carWidth / 2 - 10, baseHeight - 22, 10, 4);
    ctx.fillRect(iso.x + carWidth / 2 - 8, baseHeight - 18, 3, 5);
  }

  // Windshield & windows
  ctx.fillStyle = '#bae6fd';
  // Front windshield
  ctx.fillRect(iso.x - carWidth / 2 + cabinLeft + 2, roofTop + 2, 8, cabinHeight - 4);
  // Rear window
  if (bodyType !== 'truck') {
    ctx.fillRect(iso.x - carWidth / 2 + cabinLeft + cabinWidth - 9, roofTop + 2, 7, cabinHeight - 4);
  }
  // Side windows
  const sideWinWidth = Math.max(6, cabinWidth - 20);
  ctx.fillRect(iso.x - carWidth / 2 + cabinLeft + 11, roofTop + 2, sideWinWidth, cabinHeight - 4);

  // Van cargo seam lines
  if (bodyType === 'van') {
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(iso.x + 8, roofTop + 2);
    ctx.lineTo(iso.x + 8, baseHeight + 4);
    ctx.stroke();
  }

  // Headlights
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(iso.x - carWidth / 2 + 2, baseHeight - 8, 4, 6);
  // Taillights
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(iso.x + carWidth / 2 - 6, baseHeight - 8, 4, 6);

  // License plate
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(iso.x - 13, baseHeight + bodyHeight - 16, 26, 7);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 6px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(car.licensePlate, iso.x, baseHeight + bodyHeight - 11);

  // Wheels or Exposed Hubs
  const wheelOffsets = [
    { x: -carWidth / 2 + 11, y: baseHeight + bodyHeight - 13 },
    { x: carWidth / 2 - 13, y: baseHeight + bodyHeight - 13 }
  ];

  wheelOffsets.forEach((wo) => {
    if (car.wheelsOff) {
      // Exposed brake rotor & caliper
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(iso.x + wo.x, wo.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.stroke();
      // Caliper
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(iso.x + wo.x - 2, wo.y - 6, 4, 4);
    } else {
      // Tire & rim
      const tireRadius = bodyType === 'compact' ? 6 : bodyType === 'suv' || bodyType === 'van' ? 8 : 7;
      ctx.fillStyle = '#0f172a'; // Black tire
      ctx.beginPath();
      ctx.arc(iso.x + wo.x, wo.y, tireRadius, 0, Math.PI * 2);
      ctx.fill();
      // Alloy / steel rim
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(iso.x + wo.x, wo.y, tireRadius - 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Dynamic Car Model Badge Tag above car
  ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
  const tagWidth = Math.max(76, ctx.measureText(car.model).width + 12);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.beginPath();
  ctx.roundRect(iso.x - tagWidth / 2, baseHeight - 46, tagWidth, 14, 4);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.fillText(car.model, iso.x, baseHeight - 36);

  ctx.restore();
}

// Draw Montażownica (Tire Changer)
export function drawMontazownica(
  ctx: CanvasRenderingContext2D,
  station: Station,
  gx: number,
  gy: number,
  tick: number
) {
  const iso = gridToIso(gx, gy);
  ctx.save();

  // Machine heavy base
  ctx.fillStyle = '#1e3a8a'; // Royal blue chassis
  ctx.fillRect(iso.x - 14, iso.y - 12, 28, 24);
  ctx.strokeStyle = '#172554';
  ctx.lineWidth = 1;
  ctx.strokeRect(iso.x - 14, iso.y - 12, 28, 24);

  // Turntable clamping plate
  const isRunning = station.montazownicaState === 'running';
  const angle = isRunning ? (tick * 0.15) % (Math.PI * 2) : 0;

  ctx.save();
  ctx.translate(iso.x, iso.y - 14);
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.stroke();

  // Rotating clamp jaws
  for (let j = 0; j < 4; j++) {
    const jawAngle = angle + (j * Math.PI) / 2;
    const jx = Math.cos(jawAngle) * 9;
    const jy = Math.sin(jawAngle) * 5;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(jx - 2, jy - 2, 4, 4);
  }

  // If running, draw tire on table being worked on
  if (isRunning) {
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Montażowa pasta (white tire mounting paste)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();

  // Vertical column & mounting arm
  ctx.fillStyle = '#eab308'; // Yellow helper arm
  ctx.fillRect(iso.x + 8, iso.y - 36, 6, 26);
  ctx.fillRect(iso.x - 4, iso.y - 36, 16, 5);

  // Status indicator LED
  ctx.fillStyle = isRunning ? '#22c55e' : '#64748b';
  ctx.beginPath();
  ctx.arc(iso.x - 9, iso.y - 4, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Wyważarka (Wheel Balancer)
export function drawWywazarka(
  ctx: CanvasRenderingContext2D,
  station: Station,
  gx: number,
  gy: number,
  tick: number
) {
  const iso = gridToIso(gx, gy);
  ctx.save();

  // Balancer main body
  ctx.fillStyle = '#0f766e'; // Teal industrial housing
  ctx.fillRect(iso.x - 14, iso.y - 14, 28, 26);
  ctx.strokeStyle = '#134e4a';
  ctx.lineWidth = 1;
  ctx.strokeRect(iso.x - 14, iso.y - 14, 28, 26);

  // Protective hood guard (arched back)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(iso.x + 10, iso.y - 12, 10, Math.PI, 0);
  ctx.fill();

  // Spindle with wheel
  const isRunning = station.wywazarkaState === 'running';
  ctx.save();
  ctx.translate(iso.x + 8, iso.y - 6);
  const spinAngle = isRunning ? tick * 0.35 : 0;
  ctx.rotate(spinAngle);

  // Wheel rim
  ctx.fillStyle = isRunning ? '#334155' : '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Digital LED Display
  ctx.fillStyle = '#020617';
  ctx.fillRect(iso.x - 12, iso.y - 28, 22, 11);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(iso.x - 12, iso.y - 28, 22, 11);

  ctx.fillStyle = isRunning ? '#ef4444' : '#22c55e';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  const displayVal = isRunning ? `${Math.floor((tick * 7) % 35)}g` : '00 : 00';
  ctx.fillText(displayVal, iso.x - 1, iso.y - 20);

  ctx.restore();
}

// Draw Tool Trolley (Wózek narzędziowy)
export function drawToolCart(
  ctx: CanvasRenderingContext2D,
  gx: number,
  gy: number,
  hasTools: boolean
) {
  const iso = gridToIso(gx, gy);
  ctx.save();

  // Red roll-cab
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(iso.x - 10, iso.y - 12, 20, 20);
  ctx.strokeStyle = '#7f1d1d';
  ctx.strokeRect(iso.x - 10, iso.y - 12, 20, 20);

  // Black drawers
  for (let d = 0; d < 3; d++) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(iso.x - 8, iso.y - 10 + d * 6, 16, 4);
    // Silver handle
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(iso.x - 3, iso.y - 9 + d * 6, 6, 1.5);
  }

  // Pneumatic wrench sitting on top (if not stolen by Władek)
  if (hasTools) {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(iso.x - 4, iso.y - 16, 8, 4);
  } else {
    // Missing wrench question mark!
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('?', iso.x, iso.y - 14);
  }

  ctx.restore();
}

// Draw Compressor
export function drawCompressor(
  ctx: CanvasRenderingContext2D,
  gx: number,
  gy: number,
  tick: number
) {
  const iso = gridToIso(gx, gy);
  ctx.save();

  // Vibration shake
  const shakeX = Math.sin(tick * 0.4) * 0.8;

  // Red horizontal pressure tank (500L)
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.roundRect(iso.x - 22 + shakeX, iso.y - 10, 44, 20, 8);
  ctx.fill();
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Motor & belt guard on top
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(iso.x - 14 + shakeX, iso.y - 24, 28, 14);

  // Round pressure gauge with needle
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(iso.x + 12 + shakeX, iso.y - 20, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();

  // Gauge needle
  const needleAngle = Math.sin(tick * 0.1) * 0.3 + 1.2;
  ctx.beginPath();
  ctx.moveTo(iso.x + 12 + shakeX, iso.y - 20);
  ctx.lineTo(
    iso.x + 12 + shakeX + Math.cos(needleAngle) * 4,
    iso.y - 20 + Math.sin(needleAngle) * 4
  );
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Coiled yellow air hose
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(iso.x - 18 + shakeX, iso.y);
  ctx.bezierCurveTo(
    iso.x - 24, iso.y + 10,
    iso.x - 16, iso.y + 18,
    iso.x - 28, iso.y + 22
  );
  ctx.stroke();

  ctx.restore();
}

// Draw Workshop Accessories (Tool shadow boards on wall, mounting paste tubs, parts shelf)
export function drawWorkshopAccessories(ctx: CanvasRenderingContext2D, tick: number) {
  ctx.save();

  // 1. Tool shadow boards mounted on back wall (gx: 10 and gx: 14)
  [10, 14].forEach((gx) => {
    const iso = gridToIso(gx, 0);
    // Dark grey perforated tool board
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(iso.x - 14, iso.y - 50, 28, 26);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(iso.x - 14, iso.y - 50, 28, 26);

    // Hanging combination spanners / wrenches (silver lines)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    for (let k = 0; k < 6; k++) {
      ctx.beginPath();
      ctx.moveTo(iso.x - 10 + k * 4, iso.y - 46);
      ctx.lineTo(iso.x - 10 + k * 4, iso.y - 32 + k * 1.5);
      ctx.stroke();
    }

    // Heavy sledgehammer / rubber mallet
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(iso.x + 4, iso.y - 44, 6, 4);
    ctx.strokeStyle = '#b45309'; // Wooden handle
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(iso.x + 7, iso.y - 42);
    ctx.lineTo(iso.x + 7, iso.y - 28);
    ctx.stroke();
  });

  // 2. Tire Mounting Paste Buckets ("PASTA BIAŁY WILK") next to Montażownica 1 & 2
  [{ gx: 9.8, gy: 3.2 }, { gx: 9.8, gy: 15.2 }].forEach((pos) => {
    const iso = gridToIso(pos.gx, pos.gy);
    // Yellow industrial bucket
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(iso.x, iso.y - 2, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(iso.x - 5, iso.y - 8, 10, 6);
    ctx.strokeStyle = '#ca8a04';
    ctx.strokeRect(iso.x - 5, iso.y - 8, 10, 6);

    // White paste inside
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(iso.x, iso.y - 8, 4.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pasting brush sticking out
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(iso.x, iso.y - 8);
    ctx.lineTo(iso.x + 3, iso.y - 14);
    ctx.stroke();
  });

  // 3. Wall Retractable Hose Reels (zwijadła pneumatyczne z żółtym wężem)
  [{ gx: 8, gy: 0 }, { gx: 15, gy: 0 }].forEach((pos) => {
    const iso = gridToIso(pos.gx, pos.gy);
    // Blue drum
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.arc(iso.x, iso.y - 62, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e40af';
    ctx.stroke();
    // Yellow hanging hose tip
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(iso.x, iso.y - 55);
    ctx.lineTo(iso.x - 2, iso.y - 42);
    ctx.stroke();
  });

  // 4. Parts rack with organizer bins (gx: 16, gy: 11)
  const partsIso = gridToIso(16, 11);
  ctx.fillStyle = '#334155';
  ctx.fillRect(partsIso.x - 8, partsIso.y - 24, 16, 22);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(partsIso.x - 8, partsIso.y - 24, 16, 22);
  // Red & blue small parts bins
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#ef4444' : '#3b82f6';
      ctx.fillRect(partsIso.x - 6 + c * 7, partsIso.y - 22 + r * 6, 5, 4);
    }
  }

  // 5. Scrap used tires stack (gx: 15.5, gy: 6)
  const scrapIso = gridToIso(15.5, 6);
  for (let sc = 0; sc < 3; sc++) {
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(scrapIso.x, scrapIso.y - 3 - sc * 5, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();
  }

  ctx.restore();
}

// Draw Tire Racks (Magazyn Opon)
export function drawTireRacks(
  ctx: CanvasRenderingContext2D,
  gx: number,
  gy: number
) {
  const iso = gridToIso(gx, gy);
  ctx.save();

  // Industrial steel frame (blue uprights & orange crossbeams)
  const rackWidth = 44;
  const rackHeight = 62;

  ctx.fillStyle = '#1e40af'; // Blue upright frame
  ctx.fillRect(iso.x - rackWidth / 2, iso.y - rackHeight, 4, rackHeight);
  ctx.fillRect(iso.x + rackWidth / 2 - 4, iso.y - rackHeight, 4, rackHeight);

  // Crossbracing
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(iso.x - rackWidth / 2, iso.y - rackHeight);
  ctx.lineTo(iso.x + rackWidth / 2, iso.y - rackHeight + 25);
  ctx.moveTo(iso.x + rackWidth / 2, iso.y - rackHeight);
  ctx.lineTo(iso.x - rackWidth / 2, iso.y - rackHeight + 25);
  ctx.stroke();

  // Shelves with stacked tires & category labels
  const categories = ['OPONY ZIMOWE', 'OPONY LETNIE', 'RUNFLAT & SUV'];

  for (let s = 0; s < 3; s++) {
    const shelfY = iso.y - rackHeight + 14 + s * 18;
    ctx.fillStyle = '#ea580c'; // Orange load beam
    ctx.fillRect(iso.x - rackWidth / 2, shelfY, rackWidth, 4);

    // Shelf category label tag
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(iso.x - rackWidth / 2 + 2, shelfY - 16, 26, 6);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 4.5px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(categories[s], iso.x - rackWidth / 2 + 3, shelfY - 11);

    // Row of detailed 3D tires
    for (let t = 0; t < 5; t++) {
      const tireX = iso.x - rackWidth / 2 + 6 + t * 7.5;
      ctx.fillStyle = '#0f172a'; // Black tread rubber
      ctx.beginPath();
      ctx.ellipse(tireX, shelfY - 6, 3.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Tire sidewall rim hole
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(tireX, shelfY - 6, 1.8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw Hand Pallet Jack (Paleciak) & Wooden Pallet next to rack at gx: 20
  if (gx === 20) {
    drawPalletJack(ctx, gx - 1.5, gy + 3);
  }

  ctx.restore();
}

// Draw Industrial Yellow Hand Pallet Truck (Paleciak) with tires
function drawPalletJack(ctx: CanvasRenderingContext2D, gx: number, gy: number) {
  const iso = gridToIso(gx, gy);
  ctx.save();

  // Wooden Euro-pallet on ground
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(iso.x - 14, iso.y - 4, 28, 6);
  ctx.strokeStyle = '#451a03';
  ctx.strokeRect(iso.x - 14, iso.y - 4, 28, 6);

  // Stack of 3 tires on pallet
  for (let st = 0; st < 3; st++) {
    const ty = iso.y - 7 - st * 6;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(iso.x, ty, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();
  }

  // Yellow Pallet Jack forks and steer handle
  ctx.fillStyle = '#eab308'; // Safety yellow body
  ctx.fillRect(iso.x - 18, iso.y - 6, 8, 8);
  // Handle tiller bar
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(iso.x - 16, iso.y - 6);
  ctx.lineTo(iso.x - 22, iso.y - 20);
  ctx.lineTo(iso.x - 25, iso.y - 20);
  ctx.stroke();

  ctx.restore();
}

// Draw Office Furniture, Boss Desk, Chair, Certificates & Cash Desk
export function drawOffice(
  ctx: CanvasRenderingContext2D,
  tick: number
) {
  const deskIso = gridToIso(20, 16);
  const cashIso = gridToIso(23, 17);
  const wallIso = gridToIso(22, 14);

  ctx.save();

  // 1. Wall-mounted Office Decor (Calendar & Certificates)
  // Wall Calendar "WULKANIZACJA 2026"
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(wallIso.x - 28, wallIso.y - 42, 16, 20);
  ctx.strokeStyle = '#94a3b8';
  ctx.strokeRect(wallIso.x - 28, wallIso.y - 42, 16, 20);
  ctx.fillStyle = '#dc2626'; // Red header
  ctx.fillRect(wallIso.x - 28, wallIso.y - 42, 16, 5);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 4px sans-serif';
  ctx.fillText('2026', wallIso.x - 26, wallIso.y - 38);

  // Framed Master Certificate (Certyfikat Mistrza Wulkanizacji)
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(wallIso.x - 8, wallIso.y - 44, 20, 14);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(wallIso.x - 8, wallIso.y - 44, 20, 14);
  // Gold seal
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(wallIso.x + 2, wallIso.y - 34, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Metal Filing Cabinet with binders (Segregatory)
  ctx.fillStyle = '#475569';
  ctx.fillRect(wallIso.x + 18, wallIso.y - 32, 18, 30);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(wallIso.x + 18, wallIso.y - 32, 18, 30);
  // Colored binders on shelf
  const binderColors = ['#dc2626', '#2563eb', '#16a34a', '#eab308'];
  for (let b = 0; b < 4; b++) {
    ctx.fillStyle = binderColors[b];
    ctx.fillRect(wallIso.x + 20 + b * 3.5, wallIso.y - 28, 3, 10);
  }

  // 2. Boss Executive Leather Swivel Chair
  ctx.fillStyle = '#0f172a'; // Black leather
  ctx.beginPath();
  ctx.roundRect(deskIso.x - 6, deskIso.y - 22, 12, 14, 3);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(deskIso.x, deskIso.y - 26, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Boss Desk
  ctx.fillStyle = '#78350f'; // Solid mahogany desk
  ctx.fillRect(deskIso.x - 18, deskIso.y - 10, 36, 16);
  ctx.strokeStyle = '#451a03';
  ctx.strokeRect(deskIso.x - 18, deskIso.y - 10, 36, 16);

  // Computer monitor on desk
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(deskIso.x - 8, deskIso.y - 24, 16, 12);
  ctx.fillStyle = '#38bdf8'; // Glowing LCD screen
  ctx.fillRect(deskIso.x - 6, deskIso.y - 22, 12, 8);
  // Monitor stand
  ctx.fillStyle = '#64748b';
  ctx.fillRect(deskIso.x - 2, deskIso.y - 12, 4, 3);

  // Keyboard & Coffee mug on desk
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(deskIso.x - 7, deskIso.y - 7, 10, 4);
  ctx.fillStyle = '#dc2626'; // Red mug
  ctx.fillRect(deskIso.x + 6, deskIso.y - 8, 4, 4);

  // 4. Cash Register Desk & Fiscal Terminal
  ctx.fillStyle = '#451a03';
  ctx.fillRect(cashIso.x - 14, cashIso.y - 10, 28, 16);
  ctx.strokeStyle = '#291002';
  ctx.strokeRect(cashIso.x - 14, cashIso.y - 10, 28, 16);

  // Retro cash register
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(cashIso.x - 10, cashIso.y - 20, 20, 14);
  ctx.strokeStyle = '#64748b';
  ctx.strokeRect(cashIso.x - 10, cashIso.y - 20, 20, 14);

  // Cash register green numeric LED
  ctx.fillStyle = '#052e16';
  ctx.fillRect(cashIso.x - 6, cashIso.y - 25, 12, 6);
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 5px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('0.00', cashIso.x, cashIso.y - 21);

  // Credit card PIN terminal
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(cashIso.x + 4, cashIso.y - 14, 6, 8);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(cashIso.x + 5, cashIso.y - 13, 4, 3);

  ctx.restore();
}

// Draw Customer Waiting Lounge (Sofa, TV, Coffee Machine, Water Cooler, Ficus Plant)
export function drawWaitingRoom(
  ctx: CanvasRenderingContext2D,
  tick: number
) {
  const sofaIso = gridToIso(14, 18);
  const coffeeIso = gridToIso(17, 18);
  const plantIso = gridToIso(13, 20);
  const coolerIso = gridToIso(17, 20);

  ctx.save();

  // 1. Deep retro leather couch (rich cognac brown)
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.roundRect(sofaIso.x - 20, sofaIso.y - 12, 40, 18, 4);
  ctx.fill();
  ctx.strokeStyle = '#713f12';
  ctx.stroke();

  // Sofa backrest & side armrests
  ctx.fillStyle = '#78350f';
  ctx.fillRect(sofaIso.x - 20, sofaIso.y - 24, 40, 12);
  // Cushions
  ctx.fillStyle = '#b45309';
  ctx.fillRect(sofaIso.x - 16, sofaIso.y - 10, 15, 12);
  ctx.fillRect(sofaIso.x + 1, sofaIso.y - 10, 15, 12);

  // Throw pillows
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(sofaIso.x - 18, sofaIso.y - 18, 6, 8);

  // 2. Glass Coffee Table with Automotive Magazines
  ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
  ctx.fillRect(sofaIso.x - 12, sofaIso.y + 6, 24, 10);
  ctx.strokeStyle = '#0284c7';
  ctx.strokeRect(sofaIso.x - 12, sofaIso.y + 6, 24, 10);
  // Magazine "Auto Świat"
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(sofaIso.x - 8, sofaIso.y + 7, 8, 6);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 3px sans-serif';
  ctx.fillText('AUTO', sofaIso.x - 4, sofaIso.y + 11);

  // 3. Wall-mounted Flat TV playing rally car footage
  ctx.fillStyle = '#020617';
  ctx.fillRect(sofaIso.x - 16, sofaIso.y - 48, 32, 18);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(sofaIso.x - 16, sofaIso.y - 48, 32, 18);
  // Animated TV screen (racing car)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(sofaIso.x - 14, sofaIso.y - 46, 28, 14);
  // Small moving racing car on TV
  const carX = Math.sin(tick * 0.1) * 8;
  ctx.fillStyle = '#eab308';
  ctx.fillRect(sofaIso.x + carX - 4, sofaIso.y - 40, 8, 4);

  // 4. Beverage Counter with Espresso Coffee Machine
  ctx.fillStyle = '#334155';
  ctx.fillRect(coffeeIso.x - 10, coffeeIso.y - 8, 20, 16);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(coffeeIso.x - 10, coffeeIso.y - 8, 20, 16);

  // Deluxe red espresso maker
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(coffeeIso.x - 7, coffeeIso.y - 22, 14, 14);
  ctx.strokeStyle = '#7f1d1d';
  ctx.strokeRect(coffeeIso.x - 7, coffeeIso.y - 22, 14, 14);

  // Espresso steam
  const steamY = Math.sin(tick * 0.15) * 3;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.arc(coffeeIso.x, coffeeIso.y - 26 + steamY, 3, 0, Math.PI * 2);
  ctx.fill();

  // 5. Water Cooler Dispenser (Dystrybutor wody z niebieską butlą)
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(coolerIso.x - 5, coolerIso.y - 16, 10, 18);
  // Blue 19L water bottle inverted
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.roundRect(coolerIso.x - 4, coolerIso.y - 26, 8, 10, 3);
  ctx.fill();

  // 6. Potted Ficus / Monstera Plant
  ctx.fillStyle = '#b45309'; // Terracotta pot
  ctx.fillRect(plantIso.x - 5, plantIso.y - 6, 10, 8);
  // Green lush leaves
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(plantIso.x, plantIso.y - 10, 7, 0, Math.PI * 2);
  ctx.arc(plantIso.x - 4, plantIso.y - 12, 5, 0, Math.PI * 2);
  ctx.arc(plantIso.x + 4, plantIso.y - 12, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}


// Draw Animated Worker
export function drawWorker(
  ctx: CanvasRenderingContext2D,
  worker: Worker,
  isSelected: boolean,
  tick: number
) {
  const iso = gridToIso(worker.pos.x, worker.pos.y);
  ctx.save();

  const isMoving = worker.state === 'walking';
  const walkPhase = isMoving ? Math.sin(worker.walkCycle * 0.5) : 0;
  const bobbing = isMoving ? Math.abs(Math.sin(worker.walkCycle * 0.5)) * 2 : 0;

  const baseHeadY = iso.y - 32 - bobbing;

  // Selected aura / indicator
  if (isSelected) {
    ctx.beginPath();
    ctx.ellipse(iso.x, iso.y + 4, 14, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arrow pointer above head
    const arrowBounce = Math.sin(tick * 0.15) * 3;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(iso.x, baseHeadY - 14 + arrowBounce);
    ctx.lineTo(iso.x - 5, baseHeadY - 22 + arrowBounce);
    ctx.lineTo(iso.x + 5, baseHeadY - 22 + arrowBounce);
    ctx.closePath();
    ctx.fill();
  }

  // Shadow
  ctx.beginPath();
  ctx.ellipse(iso.x, iso.y + 4, 10, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fill();

  // Legs (walking animation)
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  // Left leg
  ctx.beginPath();
  ctx.moveTo(iso.x - 3, iso.y - 14 - bobbing);
  ctx.lineTo(iso.x - 3 + walkPhase * 4, iso.y + 2);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(iso.x + 3, iso.y - 14 - bobbing);
  ctx.lineTo(iso.x + 3 - walkPhase * 4, iso.y + 2);
  ctx.stroke();

  // Shoes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(iso.x - 5 + walkPhase * 4, iso.y + 1, 5, 3);
  ctx.fillRect(iso.x + 1 - walkPhase * 4, iso.y + 1, 5, 3);

  // Torso / Overalls
  ctx.fillStyle = worker.color;
  ctx.beginPath();
  ctx.roundRect(iso.x - 6, iso.y - 25 - bobbing, 12, 14, 3);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.stroke();

  // Head
  ctx.fillStyle = '#fbcfe8'; // Skin tone
  ctx.beginPath();
  ctx.arc(iso.x, baseHeadY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Hair or Cap
  if (worker.capColor) {
    ctx.fillStyle = worker.capColor;
    ctx.beginPath();
    ctx.arc(iso.x, baseHeadY - 2, 5.5, Math.PI, 0);
    ctx.fill();
    // Cap visor
    ctx.fillRect(iso.x, baseHeadY - 2, 6, 2);
  } else {
    // Hair
    ctx.fillStyle = worker.hairColor;
    ctx.beginPath();
    ctx.arc(iso.x, baseHeadY - 2, 5.5, Math.PI, 0);
    ctx.fill();
  }

  // Mirek's classic moustache
  if (worker.beard) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(iso.x - 3, baseHeadY + 2, 6, 2);
  }

  // Carrying item (tire / wheel / wrench)
  if (worker.carryingItem) {
    if (worker.carryingItem === 'wheel' || worker.carryingItem === 'new_tire' || worker.carryingItem === 'old_tire') {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(iso.x, baseHeadY - 14, 7, 0, Math.PI * 2);
      ctx.fill();
      if (worker.carryingItem === 'wheel') {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(iso.x, baseHeadY - 14, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (worker.carryingItem === 'wrench') {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(iso.x + 4, iso.y - 20 - bobbing, 3, 10);
    }
  }

  // Worker Name Tag
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(iso.x - 20, baseHeadY - 18, 40, 11);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(worker.name, iso.x, baseHeadY - 10);

  // Speech bubble
  if (worker.speechText) {
    drawSpeechBubble(ctx, iso.x, baseHeadY - 22, worker.speechText);
  }

  ctx.restore();
}

// Draw Władek (Autonomous Mischief Character)
export function drawWladek(
  ctx: CanvasRenderingContext2D,
  wladek: WladekCharacter,
  isHovered: boolean,
  tick: number
) {
  const iso = gridToIso(wladek.pos.x, wladek.pos.y);
  ctx.save();

  const isMoving = wladek.state === 'wandering';
  const walkPhase = isMoving ? Math.sin(wladek.walkCycle * 0.5) : 0;
  const bobbing = isMoving ? Math.abs(Math.sin(wladek.walkCycle * 0.5)) * 2 : 0;
  const headY = iso.y - 30 - bobbing;

  // Hover outline
  if (isHovered) {
    ctx.beginPath();
    ctx.ellipse(iso.x, iso.y + 4, 16, 8, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Shadow
  ctx.beginPath();
  ctx.ellipse(iso.x, iso.y + 4, 10, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fill();

  // Legs
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(iso.x - 3, iso.y - 12 - bobbing);
  ctx.lineTo(iso.x - 3 + walkPhase * 4, iso.y + 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(iso.x + 3, iso.y - 12 - bobbing);
  ctx.lineTo(iso.x + 3 - walkPhase * 4, iso.y + 2);
  ctx.stroke();

  // Cheerful Plaid / Yellow shirt
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.roundRect(iso.x - 6, iso.y - 24 - bobbing, 12, 13, 3);
  ctx.fill();

  // Blue overalls strap
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(iso.x - 4, iso.y - 24 - bobbing);
  ctx.lineTo(iso.x - 4, iso.y - 11 - bobbing);
  ctx.moveTo(iso.x + 4, iso.y - 24 - bobbing);
  ctx.lineTo(iso.x + 4, iso.y - 11 - bobbing);
  ctx.stroke();

  // Head with cheeky smile
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(iso.x, headY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Blonde / light brown curly hair
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(iso.x, headY - 2, 5.5, Math.PI, 0);
  ctx.fill();

  // If holding stolen tool
  if (wladek.stolenTool) {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(iso.x + 5, iso.y - 22 - bobbing, 4, 10);
  }

  // Władek Name Tag (Golden/Amber)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(iso.x - 22, headY - 18, 44, 11);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⭐ WŁADEK', iso.x, headY - 10);

  // Speech bubble
  if (wladek.speechText) {
    drawSpeechBubble(ctx, iso.x, headY - 22, wladek.speechText);
  }

  ctx.restore();
}

// Draw Stolen Tool marker on ground (so player can find and click it!)
export function drawStolenToolMarker(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number },
  name: string,
  tick: number
) {
  const iso = gridToIso(pos.x, pos.y);
  ctx.save();

  const bounce = Math.sin(tick * 0.2) * 3;

  // Pulsing ring
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(iso.x, iso.y + 4, 14, 7, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Tool icon floating
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(iso.x - 3, iso.y - 12 + bounce, 6, 12);
  ctx.strokeStyle = '#78350f';
  ctx.strokeRect(iso.x - 3, iso.y - 12 + bounce, 6, 12);

  // Exclamation mark
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('!', iso.x, iso.y - 16 + bounce);

  // Tag
  ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
  ctx.fillRect(iso.x - 42, iso.y - 32 + bounce, 84, 14);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`ZGUBIONY KLUCZ!`, iso.x, iso.y - 22 + bounce);

  ctx.restore();
}

// Draw Władek Mini-Event Hazard Markers & Alerts
export function drawMiniEventMarkers(
  ctx: CanvasRenderingContext2D,
  events: WladekMiniEvent[],
  tick: number
) {
  if (!events || events.length === 0) return;

  ctx.save();
  for (const ev of events) {
    const iso = gridToIso(ev.pos.x, ev.pos.y);
    const bounce = Math.sin(tick * 0.15 + ev.pos.x) * 4;
    const pulse = (Math.sin(tick * 0.2) + 1) / 2; // 0 to 1

    // Floor hazard pulsing ring
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.5})`;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(iso.x, iso.y + 6, 26 + pulse * 6, 13 + pulse * 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Specific ground graphics per event type
    if (ev.type === 'weights_spilled') {
      const offsets = [
        { dx: -12, dy: 4 }, { dx: 8, dy: -6 }, { dx: -6, dy: 10 },
        { dx: 14, dy: 8 }, { dx: 4, dy: 2 }, { dx: -15, dy: -2 }
      ];
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      offsets.forEach(off => {
        ctx.fillRect(iso.x + off.dx, iso.y + off.dy, 5, 3);
        ctx.strokeRect(iso.x + off.dx, iso.y + off.dy, 5, 3);
      });
    } else if (ev.type === 'fuse_blown') {
      if (Math.sin(tick * 0.5) > 0.2) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(iso.x + (Math.sin(tick) * 8), iso.y - 10 + (Math.cos(tick) * 8), 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (ev.type === 'compressor_off') {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(iso.x + 12, iso.y - 18, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Floating Hazard Pill
    const tagY = iso.y - 38 + bounce;
    const boxW = 130;
    const boxH = 28;
    const boxX = iso.x - boxW / 2;

    // Glowing shadow
    ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
    ctx.shadowBlur = 10;

    // Background pill
    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(boxX, tagY, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0; // reset shadow

    // Pulsing warning icon & title
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`⚠️ ${ev.title}`, iso.x, tagY + 12);

    // Call to action subtext
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('👉 Kliknij, by zresetować!', iso.x, tagY + 23);

    // Pointer downward triangle
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(iso.x - 5, tagY + boxH);
    ctx.lineTo(iso.x, tagY + boxH + 5);
    ctx.lineTo(iso.x + 5, tagY + boxH);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// Draw Speech Bubble
function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string
) {
  ctx.save();
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  const textWidth = ctx.measureText(text).width;
  const bubbleWidth = Math.max(textWidth + 14, 50);
  const bubbleHeight = 22;

  const bx = x - bubbleWidth / 2;
  const by = y - bubbleHeight - 6;

  // Bubble background
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(bx, by, bubbleWidth, bubbleHeight, 5);
  ctx.fill();
  ctx.stroke();

  // Bubble tail
  ctx.beginPath();
  ctx.moveTo(x - 4, by + bubbleHeight);
  ctx.lineTo(x, by + bubbleHeight + 6);
  ctx.lineTo(x + 4, by + bubbleHeight);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.stroke();

  // Bubble text
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, by + 14);

  ctx.restore();
}

// Draw Canvas Particles
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  ctx.save();
  for (const p of particles) {
    ctx.globalAlpha = p.alpha;
    if (p.text) {
      ctx.fillStyle = p.color;
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}
