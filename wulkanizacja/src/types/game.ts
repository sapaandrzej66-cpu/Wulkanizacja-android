/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Point {
  x: number;
  y: number;
}

export interface IsoPoint {
  x: number;
  y: number;
}

export type WorkerId = 'mirek' | 'janusz' | 'seba' | 'darek';

export interface Worker {
  id: WorkerId;
  name: string;
  role: string;
  description: string;
  speed: number; // 0.8 to 1.5
  accuracy: number; // 0.8 to 1.5
  color: string; // uniform color
  capColor?: string;
  beard?: boolean;
  hairColor: string;
  pos: Point;
  targetPos: Point | null;
  path: Point[];
  walkCycle: number;
  direction: 'NE' | 'NW' | 'SE' | 'SW';
  state: 'idle' | 'walking' | 'working' | 'carrying' | 'searching';
  currentTaskId: string | null;
  currentStationId: 'station1' | 'station2' | null;
  assignedStation: 'station1' | 'station2'; // Fixed bay assignment
  carryingItem: 'wheel' | 'new_tire' | 'old_tire' | 'wrench' | null;
  workProgress: number; // 0 to 1
  speechText: string | null;
  speechTimer: number;
  level: number;
}

export type WladekState = 
  | 'wandering'
  | 'distracting'
  | 'stealing_tool'
  | 'in_office'
  | 'drinking_coffee'
  | 'blocking_passage'
  | 'inspecting_car'
  | 'idle';

export interface WladekCharacter {
  pos: Point;
  targetPos: Point | null;
  path: Point[];
  walkCycle: number;
  direction: 'NE' | 'NW' | 'SE' | 'SW';
  state: WladekState;
  stateTimer: number;
  speechText: string | null;
  speechTimer: number;
  stolenTool: string | null;
  stolenToolLocation: Point | null;
  stolenToolName: string | null;
}

export type ServiceType = 
  | 'full_tire_swap'     // Wymiana kompletu opon (lato/zima)
  | 'puncture_repair'    // Naprawa przebitej opony (kołek/łatka)
  | 'balancing'          // Wyważanie kół (likwidacja drgań)
  | 'single_wheel'       // Wymiana jednego koła
  | 'valve_replacement'; // Wymiana uszkodzonego wentyla

export type StepType = 
  | 'raise_lift'
  | 'remove_wheels'
  | 'demount_tires'
  | 'mount_new_tires'
  | 'balance_wheels'
  | 'install_wheels'
  | 'lower_lift'
  | 'invoice';

export interface OrderStep {
  id: StepType;
  label: string;
  description: string;
  completed: boolean;
  inProgress: boolean;
  progress: number; // 0 to 1
  assignedWorkerId: WorkerId | null;
  requiresStation: boolean;
  requiredMachine?: 'lift' | 'montazownica' | 'wywazarka';
}

export interface ServiceOrder {
  id: string;
  customerName: string;
  carModel: string;
  carColor: string;
  licensePlate: string;
  bodyType?: CarBodyType;
  serviceType: ServiceType;
  title: string;
  pricePLN: number;
  maxPatience: number;
  patience: number; // decreases with time (0 to 100)
  difficulty: 'Łatwe' | 'Średnie' | 'Trudne';
  steps: OrderStep[];
  currentStepIndex: number;
  status: 'waiting' | 'in_progress' | 'completed' | 'paid';
  tipEarned: number;
}

export type CarBodyType = 'sedan' | 'wagon' | 'hatchback' | 'van' | 'suv' | 'compact' | 'sport' | 'truck';

export type WladekEventType =
  | 'compressor_off'
  | 'montazownica_jam'
  | 'wywazarka_tamper'
  | 'fuse_blown'
  | 'weights_spilled'
  | 'tool_hidden'
  | 'coffee_empty'
  | 'radio_blasting'
  | 'tire_pyramid_fallen'
  | 'pressure_leak'
  | 'paste_swapped'
  | 'parking_blocked'
  | 'customer_talked'
  | 'tv_jammed'
  | 'nap_in_armchair'
  | 'tea_brewing'
  | string;

export interface WladekMiniEvent {
  id: string;
  type: WladekEventType;
  title: string;
  description: string;
  pos: Point;
  stationId?: 'station1' | 'station2';
  active: boolean;
  resolvedMessage: string;
  penaltyText: string;
}

export interface Station {
  id: 'station1' | 'station2';
  name: string;
  liftY: number; // 0 (lowered) to 1 (raised)
  liftMoving: 'none' | 'raising' | 'lowering';
  assignedCarId: string | null;
  montazownicaState: 'idle' | 'running' | 'done';
  montazownicaProgress: number;
  montazownicaBlocked?: boolean;
  wywazarkaState: 'idle' | 'running' | 'done';
  wywazarkaProgress: number;
  wywazarkaBlocked?: boolean;
  toolCartOk: boolean;
}

export interface Car {
  id: string;
  order: ServiceOrder;
  color: string;
  model: string;
  licensePlate: string;
  bodyType?: CarBodyType;
  pos: Point;
  targetPos: Point | null;
  path?: Point[];
  assignedStationId: 'station1' | 'station2' | null;
  wheelsOff: boolean;
  state: 'parking' | 'driving_in' | 'on_lift' | 'driving_out';
}

export type UpgradeCategory = 'equipment' | 'tools' | 'comfort' | 'wladek' | 'training' | 'marketing';

export interface Upgrade {
  id: string;
  name: string;
  category: UpgradeCategory;
  cost: number;
  purchased: boolean;
  description: string;
  icon: string;
  multiplierEffect: string;
  tier?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  text?: string;
}

export interface GameStats {
  money: number;
  reputation: number; // 1.0 to 5.0
  carsServiced: number;
  day: number;
  timeHours: number; // e.g. 8.00 to 18.00
  timeMinutes: number;
  speed: 1 | 2 | 3;
  isPaused: boolean;
  soundEnabled: boolean;
  wladekIncidents: number;
  compressorDisabled?: boolean;
  officeFusesBlown?: boolean;
}

