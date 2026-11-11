/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point } from '../types/game';
import { MAP_COLS, MAP_ROWS } from './pathfinding';

export interface InteractiveZone {
  id: string;
  name: string;
  type: 
    | 'station1_lift'
    | 'station1_montazownica'
    | 'station1_wywazarka'
    | 'station1_tools'
    | 'station2_lift'
    | 'station2_montazownica'
    | 'station2_wywazarka'
    | 'station2_tools'
    | 'tire_storage'
    | 'compressor'
    | 'parts_rack'
    | 'office_desk'
    | 'office_cash'
    | 'waiting_coffee'
    | 'waiting_sofa'
    | 'parking_bay'
    | 'entrance_gate'
    | 'stolen_tool';
  gridPos: Point; // Interaction walk-to point
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  description: string;
  stationId?: 'station1' | 'station2';
}

export const WORKSHOP_ZONES: InteractiveZone[] = [
  // --- STANOWISKO 1 ---
  {
    id: 'station1_lift',
    name: 'Stanowisko 1: Podnośnik',
    type: 'station1_lift',
    gridPos: { x: 11, y: 7 }, // Stand near car/lift
    bounds: { minX: 9, maxX: 13, minY: 4, maxY: 6 },
    description: 'Podnośnik dwukolumnowy hydrauliczny - Stanowisko 1',
    stationId: 'station1',
  },
  {
    id: 'station1_montazownica',
    name: 'Stanowisko 1: Montażownica',
    type: 'station1_montazownica',
    gridPos: { x: 9, y: 3 },
    bounds: { minX: 8, maxX: 10, minY: 1, maxY: 3 },
    description: 'Montażownica do opon ze stopą demontażową i ramieniem pomocniczym',
    stationId: 'station1',
  },
  {
    id: 'station1_wywazarka',
    name: 'Stanowisko 1: Wyważarka',
    type: 'station1_wywazarka',
    gridPos: { x: 13, y: 3 },
    bounds: { minX: 12, maxX: 14, minY: 1, maxY: 3 },
    description: 'Komputerowa wyważarka do kół z cyfrowym wskaźnikiem niedoważenia',
    stationId: 'station1',
  },
  {
    id: 'station1_tools',
    name: 'Stanowisko 1: Wózek narzędziowy',
    type: 'station1_tools',
    gridPos: { x: 15, y: 4 },
    bounds: { minX: 15, maxX: 16, minY: 2, maxY: 4 },
    description: 'Wózek z kluczami nasadowymi, pneumatem i dynamometrem',
    stationId: 'station1',
  },

  // --- STANOWISKO 2 ---
  {
    id: 'station2_lift',
    name: 'Stanowisko 2: Podnośnik',
    type: 'station2_lift',
    gridPos: { x: 11, y: 10 },
    bounds: { minX: 9, maxX: 13, minY: 11, maxY: 13 },
    description: 'Podnośnik nożycowy/dwukolumnowy - Stanowisko 2',
    stationId: 'station2',
  },
  {
    id: 'station2_montazownica',
    name: 'Stanowisko 2: Montażownica',
    type: 'station2_montazownica',
    gridPos: { x: 9, y: 14 },
    bounds: { minX: 8, maxX: 10, minY: 14, maxY: 16 },
    description: 'Montażownica do opon ze stołem obrotowym i zbijakiem stopki',
    stationId: 'station2',
  },
  {
    id: 'station2_wywazarka',
    name: 'Stanowisko 2: Wyważarka',
    type: 'station2_wywazarka',
    gridPos: { x: 13, y: 14 },
    bounds: { minX: 12, maxX: 14, minY: 14, maxY: 16 },
    description: 'Wyważarka mikroprocesorowa do felg stalowych i aluminiowych',
    stationId: 'station2',
  },
  {
    id: 'station2_tools',
    name: 'Stanowisko 2: Wózek narzędziowy',
    type: 'station2_tools',
    gridPos: { x: 15, y: 13 },
    bounds: { minX: 15, maxX: 16, minY: 13, maxY: 15 },
    description: 'Wózek warsztatowy z kompletem nasadek do felg aluminiowych',
    stationId: 'station2',
  },

  // --- MAGAZYN OPON ---
  {
    id: 'tire_storage',
    name: 'Magazyn Opon',
    type: 'tire_storage',
    gridPos: { x: 19, y: 4 },
    bounds: { minX: 18, maxX: 24, minY: 1, maxY: 6 },
    description: 'Regały magazynowe z nowymi oponami letnimi, zimowymi i całorocznymi',
  },

  // --- KOMPRESOR & CZĘŚCI ---
  {
    id: 'compressor',
    name: 'Kompresor tłokowy 500L',
    type: 'compressor',
    gridPos: { x: 16, y: 7 },
    bounds: { minX: 16, maxX: 17, minY: 7, maxY: 9 },
    description: 'Mocny kompresor olejowy zasilający instalację pneumatyczną warsztatu (10 bar)',
  },
  {
    id: 'parts_rack',
    name: 'Regał z wentylami i łatkami',
    type: 'parts_rack',
    gridPos: { x: 16, y: 11 },
    bounds: { minX: 16, maxX: 17, minY: 10, maxY: 12 },
    description: 'Regał z wentylami gumowymi, czujnikami TPMS, ciężarkami i łatkami do dętek',
  },

  // --- BIURO & KASA ---
  {
    id: 'office_desk',
    name: 'Biuro Majstra',
    type: 'office_desk',
    gridPos: { x: 20, y: 16 },
    bounds: { minX: 19, maxX: 22, minY: 15, maxY: 18 },
    description: 'Biurko kierownika warsztatu z dokumentami i pieczątkami',
  },
  {
    id: 'office_cash',
    name: 'Kasa fiskalna i terminal',
    type: 'office_cash',
    gridPos: { x: 23, y: 17 },
    bounds: { minX: 22, maxX: 24, minY: 16, maxY: 19 },
    description: 'Stanowisko rozliczeń z klientami i terminal płatniczy',
  },

  // --- POCZEKALNIA ---
  {
    id: 'waiting_sofa',
    name: 'Kanapa dla klientów',
    type: 'waiting_sofa',
    gridPos: { x: 14, y: 18 },
    bounds: { minX: 13, maxX: 15, minY: 17, maxY: 19 },
    description: 'Wygodna kanapa i stolik z magazynami motoryzacyjnymi',
  },
  {
    id: 'waiting_coffee',
    name: 'Ekspres do kawy',
    type: 'waiting_coffee',
    gridPos: { x: 17, y: 18 },
    bounds: { minX: 16, maxX: 18, minY: 17, maxY: 19 },
    description: 'Ekspres do kawy dla oczekujących kierowców',
  },

  // --- PARKING ZEWNĘTRZNY ---
  {
    id: 'parking_bay',
    name: 'Parking przed warsztatem',
    type: 'parking_bay',
    gridPos: { x: 5, y: 8 },
    bounds: { minX: 0, maxX: 6, minY: 2, maxY: 15 },
    description: 'Miejsca postojowe dla oczekujących samochodów',
  },

  // --- BRAMA WARSZTATOWA ---
  {
    id: 'entrance_gate',
    name: 'Brama wjazdowa',
    type: 'entrance_gate',
    gridPos: { x: 7, y: 8 },
    bounds: { minX: 6, maxX: 7, minY: 5, maxY: 11 },
    description: 'Podnoszona brama segmentowa warsztatu',
  }
];

// Build obstacle grid (true = blocked)
export function createObstacleGrid(): boolean[][] {
  const grid: boolean[][] = [];
  for (let x = 0; x < MAP_COLS; x++) {
    grid[x] = [];
    for (let y = 0; y < MAP_ROWS; y++) {
      grid[x][y] = false;

      // Outer workshop walls (except entrance gate)
      if (y === 0) grid[x][y] = true;
      if (y === MAP_ROWS - 1) grid[x][y] = true;
      if (x === MAP_COLS - 1) grid[x][y] = true;

      // Left workshop wall separating parking from interior
      if (x === 7 && (y < 4 || y > 12)) {
        grid[x][y] = true;
      }

      // Office partition wall
      if (x === 18 && y >= 14) {
        // Leave a door at y = 16
        if (y !== 16) {
          grid[x][y] = true;
        }
      }
      if (y === 14 && x >= 18) {
        grid[x][y] = true;
      }

      // Machine solid obstacles:
      // Montażownica 1 & 2
      if (x === 9 && (y === 2 || y === 15)) grid[x][y] = true;
      // Wyważarka 1 & 2
      if (x === 13 && (y === 2 || y === 15)) grid[x][y] = true;
      // Tool carts
      if (x === 15 && (y === 3 || y === 14)) grid[x][y] = true;
      // Compressor
      if (x === 16 && (y === 8 || y === 9)) grid[x][y] = true;
      // Parts rack
      if (x === 16 && y === 11) grid[x][y] = true;
      // Tire shelves
      if ((x === 20 || x === 23) && y >= 1 && y <= 5) grid[x][y] = true;
      // Office desk & cash
      if (x === 21 && y === 17) grid[x][y] = true;
      if (x === 23 && y === 18) grid[x][y] = true;
      // Waiting room sofa
      if (x === 14 && y === 18) grid[x][y] = true;
      if (x === 17 && y === 19) grid[x][y] = true; // coffee stand
    }
  }

  return grid;
}

export const obstacleGrid = createObstacleGrid();

export function isWalkable(x: number, y: number): boolean {
  if (x < 0 || x >= MAP_COLS || y < 0 || y >= MAP_ROWS) return false;
  return !obstacleGrid[x][y];
}
