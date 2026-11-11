/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point, IsoPoint } from '../types/game';

export const MAP_COLS = 26;
export const MAP_ROWS = 22;
export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

// Isometric projection math
export function gridToIso(gx: number, gy: number, gz: number = 0): IsoPoint {
  const x = (gx - gy) * (TILE_WIDTH / 2);
  const y = (gx + gy) * (TILE_HEIGHT / 2) - gz;
  return { x, y };
}

export function isoToGrid(screenX: number, screenY: number, originX: number, originY: number, zoom: number): Point {
  const relX = (screenX - originX) / zoom;
  const relY = (screenY - originY) / zoom;

  const gx = (relX / (TILE_WIDTH / 2) + relY / (TILE_HEIGHT / 2)) / 2;
  const gy = (relY / (TILE_HEIGHT / 2) - relX / (TILE_WIDTH / 2)) / 2;

  return {
    x: Math.round(gx),
    y: Math.round(gy)
  };
}

// Distance helper
export function getDist(p1: Point, p2: Point): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// A* Node
interface PathNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
}

// A* Pathfinding algorithm on grid
export function findPath(start: Point, goal: Point, isWalkable: (x: number, y: number) => boolean): Point[] {
  // If start is goal, return single point
  if (start.x === goal.x && start.y === goal.y) return [goal];

  // If goal is not walkable, try to find closest adjacent walkable tile
  let targetGoal = goal;
  if (!isWalkable(goal.x, goal.y)) {
    const neighbors = [
      { x: goal.x + 1, y: goal.y },
      { x: goal.x - 1, y: goal.y },
      { x: goal.x, y: goal.y + 1 },
      { x: goal.x, y: goal.y - 1 },
      { x: goal.x + 1, y: goal.y + 1 },
      { x: goal.x - 1, y: goal.y - 1 },
    ];
    const walkableNeighbors = neighbors.filter(n => isWalkable(n.x, n.y));
    if (walkableNeighbors.length > 0) {
      walkableNeighbors.sort((a, b) => getDist(start, a) - getDist(start, b));
      targetGoal = walkableNeighbors[0];
    } else {
      return [start];
    }
  }

  const openList: PathNode[] = [];
  const closedSet = new Set<string>();

  const startNode: PathNode = {
    x: start.x,
    y: start.y,
    g: 0,
    h: getDist(start, targetGoal),
    f: getDist(start, targetGoal),
    parent: null
  };

  openList.push(startNode);

  const key = (x: number, y: number) => `${x},${y}`;

  let iterations = 0;
  const maxIterations = 350;

  while (openList.length > 0 && iterations++ < maxIterations) {
    // Find node with lowest f
    let lowestIdx = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < openList[lowestIdx].f) {
        lowestIdx = i;
      }
    }

    const current = openList.splice(lowestIdx, 1)[0];

    // Reached goal
    if (current.x === targetGoal.x && current.y === targetGoal.y) {
      const path: Point[] = [];
      let temp: PathNode | null = current;
      while (temp) {
        path.push({ x: temp.x, y: temp.y });
        temp = temp.parent;
      }
      return path.reverse();
    }

    closedSet.add(key(current.x, current.y));

    // 4-way orthogonal + 4-way diagonal
    const neighbors = [
      { x: current.x + 1, y: current.y, cost: 1 },
      { x: current.x - 1, y: current.y, cost: 1 },
      { x: current.x, y: current.y + 1, cost: 1 },
      { x: current.x, y: current.y - 1, cost: 1 },
      { x: current.x + 1, y: current.y + 1, cost: 1.414 },
      { x: current.x - 1, y: current.y + 1, cost: 1.414 },
      { x: current.x + 1, y: current.y - 1, cost: 1.414 },
      { x: current.x - 1, y: current.y - 1, cost: 1.414 }
    ];

    for (const neighbor of neighbors) {
      if (neighbor.x < 0 || neighbor.x >= MAP_COLS || neighbor.y < 0 || neighbor.y >= MAP_ROWS) {
        continue;
      }
      if (closedSet.has(key(neighbor.x, neighbor.y))) {
        continue;
      }
      if (!isWalkable(neighbor.x, neighbor.y) && !(neighbor.x === targetGoal.x && neighbor.y === targetGoal.y)) {
        continue;
      }

      const gScore = current.g + neighbor.cost;
      let existingNode = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);

      if (!existingNode) {
        const hScore = getDist({ x: neighbor.x, y: neighbor.y }, targetGoal);
        const newNode: PathNode = {
          x: neighbor.x,
          y: neighbor.y,
          g: gScore,
          h: hScore,
          f: gScore + hScore,
          parent: current
        };
        openList.push(newNode);
      } else if (gScore < existingNode.g) {
        existingNode.g = gScore;
        existingNode.f = gScore + existingNode.h;
        existingNode.parent = current;
      }
    }
  }

  // Fallback direct path
  return [start, targetGoal];
}
