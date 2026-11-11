/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Worker,
  WladekCharacter,
  Station,
  Car,
  ServiceOrder,
  OrderStep,
  Particle,
  GameStats,
  WorkerId,
  Upgrade,
  WladekMiniEvent,
  WladekEventType
} from '../types/game';
import { findPath, getDist } from './pathfinding';
import { isWalkable, WORKSHOP_ZONES } from './workshopMap';
import { soundManager } from '../utils/audio';
import { getWladekQuote } from './wladekQuotes';
import { CAR_FLEET, getRandomCarTemplate } from './carFleet';
import { WORKSHOP_100_UPGRADES } from './workshopUpgrades';
import { WLADEK_50_EVENTS, getRandomWladekEvent } from './wladekEventsData';

const STORAGE_KEY = 'wulkanizacja_save_v1';

// Initial default workers
export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'mirek',
    name: 'Majster Mirek',
    role: 'Stanowisko 1 • Weteran wulkanizacji',
    description: 'Doświadczony fachowiec z sumiastym wąsem. Stały mechanik Stanowiska 1.',
    speed: 1.2,
    accuracy: 1.3,
    color: '#1d4ed8', // Blue overalls
    beard: true,
    hairColor: '#451a03',
    pos: { x: 10, y: 7 },
    targetPos: null,
    path: [],
    walkCycle: 0,
    direction: 'SE',
    state: 'idle',
    currentTaskId: null,
    currentStationId: 'station1',
    assignedStation: 'station1',
    carryingItem: null,
    workProgress: 0,
    speechText: null,
    speechTimer: 0,
    level: 1,
  },
  {
    id: 'janusz',
    name: 'Janusz',
    role: 'Stanowisko 1 • Spokojny rutyniarz',
    description: 'Zawsze z termosem herbaty. Stały mechanik Stanowiska 1.',
    speed: 1.0,
    accuracy: 1.15,
    color: '#334155', // Slate
    capColor: '#1d4ed8',
    hairColor: '#64748b',
    pos: { x: 12, y: 7 },
    targetPos: null,
    path: [],
    walkCycle: 0,
    direction: 'SW',
    state: 'idle',
    currentTaskId: null,
    currentStationId: 'station1',
    assignedStation: 'station1',
    carryingItem: null,
    workProgress: 0,
    speechText: null,
    speechTimer: 0,
    level: 1,
  },
  {
    id: 'seba',
    name: 'Seba',
    role: 'Stanowisko 2 • Młody adept',
    description: 'Pełen energii adept wulkanizacji. Stały mechanik Stanowiska 2.',
    speed: 1.35,
    accuracy: 0.95,
    color: '#d97706', // Amber overalls
    capColor: '#dc2626',
    hairColor: '#0f172a',
    pos: { x: 10, y: 13 },
    targetPos: null,
    path: [],
    walkCycle: 0,
    direction: 'NE',
    state: 'idle',
    currentTaskId: null,
    currentStationId: 'station2',
    assignedStation: 'station2',
    carryingItem: null,
    workProgress: 0,
    speechText: null,
    speechTimer: 0,
    level: 1,
  },
  {
    id: 'darek',
    name: 'Darek',
    role: 'Stanowisko 2 • Siłacz warsztatowy',
    description: 'Mistrz montażownicy i kół RunFlat. Stały mechanik Stanowiska 2.',
    speed: 1.15,
    accuracy: 1.2,
    color: '#b91c1c', // Crimson
    hairColor: '#1e293b',
    pos: { x: 12, y: 13 },
    targetPos: null,
    path: [],
    walkCycle: 0,
    direction: 'NW',
    state: 'idle',
    currentTaskId: null,
    currentStationId: 'station2',
    assignedStation: 'station2',
    carryingItem: null,
    workProgress: 0,
    speechText: null,
    speechTimer: 0,
    level: 1,
  }
];

// Initial Władek state
export const INITIAL_WLADEK: WladekCharacter = {
  pos: { x: 17, y: 16 },
  targetPos: null,
  path: [],
  walkCycle: 0,
  direction: 'SE',
  state: 'wandering',
  stateTimer: 60,
  speechText: 'Szefie, ja tolko smatriu!',
  speechTimer: 180,
  stolenTool: null,
  stolenToolLocation: null,
  stolenToolName: null,
};

// Initial Stations
export const INITIAL_STATIONS: Station[] = [
  {
    id: 'station1',
    name: 'Stanowisko 1 (Lewe)',
    liftY: 0,
    liftMoving: 'none',
    assignedCarId: null,
    montazownicaState: 'idle',
    montazownicaProgress: 0,
    wywazarkaState: 'idle',
    wywazarkaProgress: 0,
    toolCartOk: true,
  },
  {
    id: 'station2',
    name: 'Stanowisko 2 (Prawe)',
    liftY: 0,
    liftMoving: 'none',
    assignedCarId: null,
    montazownicaState: 'idle',
    montazownicaProgress: 0,
    wywazarkaState: 'idle',
    wywazarkaProgress: 0,
    toolCartOk: true,
  }
];

// Pre-packaged orders generator
export function createOrder(type: 'full_tire_swap' | 'puncture_repair' | 'balancing' | 'valve_replacement'): ServiceOrder {
  const chosen = getRandomCarTemplate();

  let steps: OrderStep[] = [];
  let title = '';
  let price = 160;
  let difficulty: 'Łatwe' | 'Średnie' | 'Trudne' = 'Średnie';

  if (type === 'full_tire_swap') {
    title = 'Sezonowa wymiana 4 opon + wyważenie';
    price = 180;
    difficulty = 'Średnie';
    steps = [
      { id: 'raise_lift', label: '1. Podnieś auto na podnośniku', description: 'Bezpiecznie podnieś auto na wysokość roboczą', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'lift' },
      { id: 'remove_wheels', label: '2. Odkręć koła kluczem udarowym', description: 'Zdejmij 4 koła za pomocą klucza pneumatycznego', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true },
      { id: 'demount_tires', label: '3. Zdemontuj stare opony', description: 'Użyj montażownicy i zbijaka stopki', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'montazownica' },
      { id: 'mount_new_tires', label: '4. Nałóż nowe opony z pastą', description: 'Posmaruj ranty pastą montażową i naciągnij gumę', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'montazownica' },
      { id: 'balance_wheels', label: '5. Wyważ koła na maszynie (0g/0g)', description: 'Nabij lub naklej ciężarki wyważające', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'wywazarka' },
      { id: 'install_wheels', label: '6. Załóż koła i dokręć kluczem dyno', description: 'Dokręć śruby momentem 120 Nm', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true },
      { id: 'lower_lift', label: '7. Opuść podnośnik', description: 'Opuść bezpiecznie auto na ziemię', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'lift' },
      { id: 'invoice', label: '8. Wystaw paragon w biurze i odbierz zapłatę', description: 'Wystaw paragon fiskalny i pożegnaj zadowolonego klienta', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: false }
    ];
  } else if (type === 'puncture_repair') {
    title = 'Naprawa przebitej opony (kołek/sznur)';
    price = 90;
    difficulty = 'Łatwe';
    steps = [
      { id: 'raise_lift', label: '1. Podnieś auto na podnośniku', description: 'Podnieś auto, aby zdjąć uszkodzone koło', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'lift' },
      { id: 'remove_wheels', label: '2. Zdejmij uszkodzone koło', description: 'Odkręć koło ze wbitym gwoździem', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true },
      { id: 'demount_tires', label: '3. Usunięcie gwoździa i załatanie', description: 'Zalep otwór sznurem wulkanizacyjnym i klejem', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'montazownica' },
      { id: 'balance_wheels', label: '4. Kontrola wyważenia koła', description: 'Sprawdź bicie na wyważarce', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'wywazarka' },
      { id: 'install_wheels', label: '5. Załóż naprawione koło', description: 'Dokręć koło na piaście', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true },
      { id: 'lower_lift', label: '6. Opuść podnośnik', description: 'Opuść auto', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'lift' },
      { id: 'invoice', label: '7. Rozlicz naprawę w biurze', description: 'Odbierz należność od kierowcy', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: false }
    ];
  } else if (type === 'balancing') {
    title = 'Wyważanie kół (likwidacja drgań)';
    price = 110;
    difficulty = 'Łatwe';
    steps = [
      { id: 'raise_lift', label: '1. Podnieś auto na podnośniku', description: 'Podnieś samochód na stanowisku', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'lift' },
      { id: 'remove_wheels', label: '2. Odkręć 4 koła', description: 'Zdejmij koła kluczem udarowym', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true },
      { id: 'balance_wheels', label: '3. Precyzyjne wyważenie 4 kół', description: 'Wyważ koła na zero (00:00) na wyważarce', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'wywazarka' },
      { id: 'install_wheels', label: '4. Ponowny montaż kół', description: 'Przykręć koła do piast', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true },
      { id: 'lower_lift', label: '5. Opuść podnośnik', description: 'Opuść samochód', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'lift' },
      { id: 'invoice', label: '6. Paragon i rozliczenie', description: 'Wystaw rachunek za wyważenie', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: false }
    ];
  } else {
    title = 'Wymiana sparciałych wentyli gumowych';
    price = 80;
    difficulty = 'Łatwe';
    steps = [
      { id: 'raise_lift', label: '1. Podnieś auto', description: 'Podnieś auto na podnośniku', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'lift' },
      { id: 'remove_wheels', label: '2. Zdejmij koła', description: 'Odkręć koła', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true },
      { id: 'demount_tires', label: '3. Zbij stopkę i wymień wentyle', description: 'Zainstaluj nowe wentyle TR414 z magazynu części', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'montazownica' },
      { id: 'install_wheels', label: '4. Zamontuj koła i napompuj', description: 'Dokręć koła i dopompuj do 2.3 bar', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true },
      { id: 'lower_lift', label: '5. Opuść auto', description: 'Opuść podnośnik', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: true, requiredMachine: 'lift' },
      { id: 'invoice', label: '6. Rozliczenie w kasie', description: 'Wydrukuj paragon', completed: false, inProgress: false, progress: 0, assignedWorkerId: null, requiresStation: false }
    ];
  }

  return {
    id: 'ord_' + Math.random().toString(36).substring(2, 8),
    customerName: chosen.customer,
    carModel: chosen.model,
    carColor: chosen.color,
    licensePlate: chosen.plate,
    bodyType: chosen.bodyType,
    serviceType: type,
    title,
    pricePLN: price,
    maxPatience: 100,
    patience: 100,
    difficulty,
    steps,
    currentStepIndex: 0,
    status: 'waiting',
    tipEarned: 0,
  };
}

// Exactly 100 authentic workshop upgrades across 6 categories
export const INITIAL_UPGRADES: Upgrade[] = WORKSHOP_100_UPGRADES;

export class GameEngine {
  public workers: Worker[] = [];
  public wladek: WladekCharacter = { ...INITIAL_WLADEK };
  public stations: Station[] = [];
  public cars: Car[] = [];
  public upgrades: Upgrade[] = [];
  public particles: Particle[] = [];
  public activeMiniEvents: WladekMiniEvent[] = [];
  public miniEventTimer: number = 500;
  public stats: GameStats = {
    money: 350,
    reputation: 4.5,
    carsServiced: 0,
    day: 1,
    timeHours: 8,
    timeMinutes: 30,
    speed: 1,
    isPaused: false,
    soundEnabled: true,
    wladekIncidents: 0,
    compressorDisabled: false,
    officeFusesBlown: false,
  };

  public selectedWorkerId: WorkerId | null = 'mirek';
  public selectedStationId: 'station1' | 'station2' | null = null;
  public selectedCarId: string | null = null;
  public tickCount: number = 0;
  private onStateChange: (() => void) | null = null;

  constructor() {
    this.resetToInitial();
    this.loadGame();
  }

  public setListener(cb: () => void) {
    this.onStateChange = cb;
  }

  private notify() {
    if (this.onStateChange) this.onStateChange();
  }

  public resetToInitial() {
    this.workers = JSON.parse(JSON.stringify(INITIAL_WORKERS));
    this.wladek = JSON.parse(JSON.stringify(INITIAL_WLADEK));
    this.stations = JSON.parse(JSON.stringify(INITIAL_STATIONS));
    this.upgrades = JSON.parse(JSON.stringify(INITIAL_UPGRADES));
    this.particles = [];

    // Pre-create initial cars:
    // Car 1 waiting to be assigned
    const order1 = createOrder('full_tire_swap');
    const order2 = createOrder('puncture_repair');

    this.cars = [
      {
        id: 'car_1',
        order: order1,
        color: order1.carColor,
        model: order1.carModel,
        licensePlate: order1.licensePlate,
        bodyType: order1.bodyType,
        pos: { x: 3, y: 5 },
        targetPos: null,
        assignedStationId: null,
        wheelsOff: false,
        state: 'parking',
      },
      {
        id: 'car_2',
        order: order2,
        color: order2.carColor,
        model: order2.carModel,
        licensePlate: order2.licensePlate,
        bodyType: order2.bodyType,
        pos: { x: 3, y: 9 },
        targetPos: null,
        assignedStationId: null,
        wheelsOff: false,
        state: 'parking',
      }
    ];

    // Immediately park car 1 onto station 1 so the player can start right away!
    this.assignCarToStation('car_1', 'station1');
  }

  // Assign a car from parking to a bay station
  public assignCarToStation(carId: string, stationId: 'station1' | 'station2') {
    const car = this.cars.find(c => c.id === carId);
    const station = this.stations.find(s => s.id === stationId);
    if (!car || !station || station.assignedCarId) return false;

    station.assignedCarId = car.id;
    car.assignedStationId = station.id;
    car.state = 'on_lift';

    // Position car right on the lift
    const liftPos = stationId === 'station1' ? { x: 11, y: 5 } : { x: 11, y: 12 };
    car.pos = { ...liftPos };
    car.targetPos = null;

    soundManager.playClick();
    this.addParticle(car.pos.x, car.pos.y, 'Wjeżdża na stanowisko!', '#38bdf8');
    this.notify();
    return true;
  }

  // Raise or lower the lift
  public toggleLift(stationId: 'station1' | 'station2') {
    const station = this.stations.find(s => s.id === stationId);
    if (!station) return;

    if (station.liftY <= 0.1) {
      station.liftMoving = 'raising';
      soundManager.playLiftSound();
    } else {
      station.liftMoving = 'lowering';
      soundManager.playLiftSound();
    }
    this.notify();
  }

  // Main simulation tick (called from requestAnimationFrame loop)
  public update(dt: number) {
    if (this.stats.isPaused) return;

    const simSpeed = this.stats.speed;
    this.tickCount++;

    // Update game clock (e.g. 1 minute every 120 frames at 1x speed)
    if (this.tickCount % Math.max(1, Math.floor(120 / simSpeed)) === 0) {
      this.stats.timeMinutes++;
      if (this.stats.timeMinutes >= 60) {
        this.stats.timeMinutes = 0;
        this.stats.timeHours++;
        if (this.stats.timeHours > 18) {
          this.stats.timeHours = 8;
          this.stats.day++;
          this.saveGame();
        }
      }
    }

    // Spawn new cars in parking if slots free
    if (this.tickCount % (360 / simSpeed) === 0) {
      this.checkAndSpawnCars();
    }

    // Update lifts movement (doubled with hydraulic_rapid_lift)
    const liftSpeedBonus = this.hasUpgrade('hydraulic_rapid_lift') ? 2.0 : 1.0;
    for (const station of this.stations) {
      if (station.liftMoving === 'raising') {
        station.liftY = Math.min(1, station.liftY + 0.02 * simSpeed * liftSpeedBonus);
        if (station.liftY >= 1) {
          station.liftMoving = 'none';
          this.checkStepCompletion(station.id, 'raise_lift');
        }
      } else if (station.liftMoving === 'lowering') {
        station.liftY = Math.max(0, station.liftY - 0.02 * simSpeed * liftSpeedBonus);
        if (station.liftY <= 0) {
          station.liftMoving = 'none';
          this.checkStepCompletion(station.id, 'lower_lift');
        }
      }

      // Montażownica auto-progress
      if (station.montazownicaState === 'running' && !station.montazownicaBlocked) {
        station.montazownicaProgress += 0.015 * simSpeed;
        if (station.montazownicaProgress >= 1) {
          station.montazownicaState = 'done';
          station.montazownicaProgress = 0;
          soundManager.playAirHiss();
        }
      }

      // Wyważarka auto-progress
      if (station.wywazarkaState === 'running' && !station.wywazarkaBlocked) {
        station.wywazarkaProgress += 0.012 * simSpeed;
        if (station.wywazarkaProgress >= 1) {
          station.wywazarkaState = 'done';
          station.wywazarkaProgress = 0;
        }
      }
    }

    // Update customer patience (comfort upgrades)
    const coffeeBonus = this.hasUpgrade('coffee_machine_deluxe') ? 0.5 : 1.0;
    const acBonus = this.hasUpgrade('air_conditioning') ? 0.6 : 1.0;
    for (const car of this.cars) {
      if (car.order.status === 'in_progress' || car.order.status === 'waiting') {
        car.order.patience = Math.max(10, car.order.patience - 0.015 * simSpeed * coffeeBonus * acBonus);
      }
    }

    // Periodic Władek mini-events (calmed by wladek upgrades)
    const wladekCalmFactor = this.hasUpgrade('wladek_tractor_corner') ? 3.0 : (this.hasUpgrade('wladek_radio_disco') ? 2.0 : 1.0);
    this.miniEventTimer -= simSpeed;
    if (this.miniEventTimer <= 0) {
      this.miniEventTimer = Math.floor((450 + Math.random() * 600) * wladekCalmFactor);
      if (this.activeMiniEvents.length === 0) {
        this.triggerWladekMiniEvent();
      }
    }

    // Auto-reset fuses if fuse_stabilizer upgrade is purchased
    if (this.stats.officeFusesBlown && this.hasUpgrade('fuse_stabilizer')) {
      if (this.tickCount % 180 === 0) {
        this.resolveMiniEvent('fuse_blown');
      }
    }

    // Update cars (auto drive-in onto free lifts and driving out)
    this.updateCars(simSpeed);

    // Update workers
    this.updateWorkers(simSpeed);

    // Update Władek autonomous behaviors
    this.updateWladek(simSpeed);

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Update cars (auto drive-in onto free lifts and driving out)
  private updateCars(simSpeed: number) {
    // 1. Auto drive-in: Check free stations and automatically send waiting cars!
    for (const station of this.stations) {
      if (!station.assignedCarId) {
        // Find if any car is already driving into this station
        const alreadyDrivingIn = this.cars.some(c => c.assignedStationId === station.id && c.state === 'driving_in');
        if (!alreadyDrivingIn) {
          const waitingCar = this.cars.find(c => c.state === 'parking');
          if (waitingCar) {
            this.startCarDriveIn(waitingCar, station.id);
          }
        }
      }
    }

    // 2. Animate cars driving along path
    for (const car of this.cars) {
      if (car.path && car.path.length > 0) {
        const nextTarget = car.path[0];
        const dist = getDist(car.pos, nextTarget);
        const speed = 0.055 * simSpeed;

        if (dist <= speed) {
          car.pos = { ...nextTarget };
          car.path.shift();
          if (car.path.length === 0) {
            // Reached destination
            if (car.state === 'driving_in' && car.assignedStationId) {
              car.state = 'on_lift';
              const liftPos = car.assignedStationId === 'station1' ? { x: 11, y: 5 } : { x: 11, y: 12 };
              car.pos = { ...liftPos };
              car.order.status = 'in_progress';
              soundManager.playCarHorn();
              this.addParticle(car.pos.x, car.pos.y, 'Auto gotowe do obsługi!', '#22c55e');
              this.notify();
            }
          }
        } else {
          const angle = Math.atan2(nextTarget.y - car.pos.y, nextTarget.x - car.pos.x);
          car.pos.x += Math.cos(angle) * speed;
          car.pos.y += Math.sin(angle) * speed;
        }
      }
    }
  }

  // Launch automatic car drive-in through the gate onto the lift
  public startCarDriveIn(car: Car, stationId: 'station1' | 'station2') {
    const station = this.stations.find(s => s.id === stationId);
    if (!station || station.assignedCarId) return;

    station.assignedCarId = car.id;
    car.assignedStationId = station.id;
    car.state = 'driving_in';

    const liftPos = stationId === 'station1' ? { x: 11, y: 5 } : { x: 11, y: 12 };

    // Path from parking through entrance gate (7, 8) right onto the lift!
    car.path = [
      { x: 5, y: car.pos.y },
      { x: 7, y: 8 }, // Entrance gate threshold
      { x: 9, y: stationId === 'station1' ? 6 : 11 },
      liftPos
    ];

    soundManager.playClick();
    this.addParticle(car.pos.x, car.pos.y, `Auto wjeżdża na ${station.name}!`, '#38bdf8');
    this.notify();
  }

  // Update workers walking, working, speech
  private updateWorkers(simSpeed: number) {
    const trainingBonus = this.hasUpgrade('worker_training') ? 1.25 : 1.0;

    for (const worker of this.workers) {
      // Worker speech timer
      if (worker.speechTimer > 0) {
        worker.speechTimer--;
        if (worker.speechTimer <= 0) worker.speechText = null;
      }

      // Moving along path
      if (worker.path.length > 0) {
        worker.state = 'walking';
        worker.walkCycle += 0.25 * simSpeed;

        const nextTarget = worker.path[0];
        const dist = getDist(worker.pos, nextTarget);
        const effectiveSpeed = 0.06 * worker.speed * trainingBonus * simSpeed;

        if (dist <= effectiveSpeed) {
          worker.pos = { ...nextTarget };
          worker.path.shift();
          if (worker.path.length === 0) {
            worker.state = 'idle';
            this.onWorkerReachedDestination(worker);
          }
        } else {
          const angle = Math.atan2(nextTarget.y - worker.pos.y, nextTarget.x - worker.pos.x);
          worker.pos.x += Math.cos(angle) * effectiveSpeed;
          worker.pos.y += Math.sin(angle) * effectiveSpeed;
        }
      } else if (worker.state === 'working' && worker.currentTaskId) {
        // Performing active task
        this.advanceWorkerTask(worker, simSpeed * trainingBonus);
      }
    }
  }

  private advanceWorkerTask(worker: Worker, simSpeed: number) {
    // Check if machine is disabled by Władek mini-event!
    if (this.stats.compressorDisabled && (worker.currentTaskId === 'remove_wheels' || worker.currentTaskId === 'install_wheels')) {
      if (this.tickCount % 90 === 0) {
        worker.speechText = 'Kompresor wyłączony przez Władka! Kliknij kompresor!';
        worker.speechTimer = 80;
      }
      return; // Paused until player clicks compressor
    }

    const currentStation = this.stations.find(s => s.id === worker.currentStationId);
    if (currentStation?.montazownicaBlocked && (worker.currentTaskId === 'demount_tires' || worker.currentTaskId === 'mount_new_tires')) {
      if (this.tickCount % 90 === 0) {
        worker.speechText = 'Montażownica zacięta! Kliknij ją, aby odblokować!';
        worker.speechTimer = 80;
      }
      return; // Paused until player clicks montażownica
    }

    if (currentStation?.wywazarkaBlocked && worker.currentTaskId === 'balance_wheels') {
      if (this.tickCount % 90 === 0) {
        worker.speechText = 'Wyważarka rozkalibrowana! Kliknij ją!';
        worker.speechTimer = 80;
      }
      return; // Paused until player clicks wyważarka
    }

    if (this.stats.officeFusesBlown && worker.currentTaskId === 'invoice') {
      if (this.tickCount % 90 === 0) {
        worker.speechText = 'Korki wybite w biurze! Kliknij biuro!';
        worker.speechTimer = 80;
      }
      return; // Paused until player clicks office
    }

    const compressorBonus = this.hasUpgrade('turbo_compressor') ? 1.35 : 1.0;
    const titaniumBonus = this.hasUpgrade('titanium_wrenches') ? 1.5 : 1.0;
    const balancerBonus = this.hasUpgrade('laser_balancer') ? 2.0 : 1.0;
    const montazownicaBonus = this.hasUpgrade('auto_montazownica') ? 1.4 : 1.0;
    const bubblegumBonus = this.hasUpgrade('bubblegum_paste') ? 1.2 : 1.0;

    let speedRate = 0.008 * worker.speed * simSpeed;

    if (worker.currentTaskId === 'remove_wheels' || worker.currentTaskId === 'install_wheels') {
      speedRate *= compressorBonus * titaniumBonus;
      if (this.tickCount % 25 === 0) {
        soundManager.playImpactWrench(0.3);
        this.addSparks(worker.pos.x, worker.pos.y);
      }
    } else if (worker.currentTaskId === 'demount_tires' || worker.currentTaskId === 'mount_new_tires') {
      speedRate *= montazownicaBonus * bubblegumBonus;
    } else if (worker.currentTaskId === 'balance_wheels') {
      speedRate *= balancerBonus;
    }

    worker.workProgress += speedRate;

    if (worker.workProgress >= 1) {
      worker.workProgress = 0;
      worker.state = 'idle';
      const taskId = worker.currentTaskId;
      const stationId = worker.currentStationId;
      worker.currentTaskId = null;
      worker.carryingItem = null;

      // Return to dedicated station home spot
      const homePos = worker.id === 'mirek' ? { x: 10, y: 7 }
        : worker.id === 'janusz' ? { x: 12, y: 7 }
        : worker.id === 'seba' ? { x: 10, y: 13 }
        : { x: 12, y: 13 };
      
      worker.path = findPath(
        { x: Math.round(worker.pos.x), y: Math.round(worker.pos.y) },
        homePos,
        isWalkable
      );

      if (stationId && taskId) {
        this.checkStepCompletion(stationId, taskId as any);
      }
    }
  }

  // When worker arrives at designated location
  private onWorkerReachedDestination(worker: Worker) {
    if (!worker.currentTaskId || !worker.currentStationId) return;

    const station = this.stations.find(s => s.id === worker.currentStationId);
    if (!station) return;

    worker.state = 'working';
    worker.workProgress = 0;

    if (worker.currentTaskId === 'raise_lift') {
      this.toggleLift(station.id);
    } else if (worker.currentTaskId === 'lower_lift') {
      this.toggleLift(station.id);
    } else if (worker.currentTaskId === 'remove_wheels') {
      worker.speechText = 'Pneumat w dłoń i odkręcamy!';
      worker.speechTimer = 100;
      soundManager.playImpactWrench(0.6);
    } else if (worker.currentTaskId === 'demount_tires' || worker.currentTaskId === 'mount_new_tires') {
      station.montazownicaState = 'running';
      worker.carryingItem = 'wheel';
      soundManager.playAirHiss();
    } else if (worker.currentTaskId === 'balance_wheels') {
      station.wywazarkaState = 'running';
      soundManager.playBalancerSound();
    } else if (worker.currentTaskId === 'invoice') {
      this.completeInvoice(station.id);
    }
  }

  // Issue order step to a worker
  public assignWorkerToStep(workerId: WorkerId, stationId: 'station1' | 'station2', stepId: string) {
    const worker = this.workers.find(w => w.id === workerId);
    const station = this.stations.find(s => s.id === stationId);
    if (!worker || !station || !station.assignedCarId) return false;

    // Strict rule: 2 fixed workers per station (Mirek & Janusz -> Station 1, Seba & Darek -> Station 2)
    if (worker.assignedStation !== stationId) {
      worker.speechText = `Jestem na stałe na ${worker.assignedStation === 'station1' ? 'Stanowisku 1' : 'Stanowisku 2'}!`;
      worker.speechTimer = 140;
      soundManager.playClick();
      this.notify();
      return false;
    }

    const car = this.cars.find(c => c.id === station.assignedCarId);
    if (!car) return false;

    const currentStep = car.order.steps[car.order.currentStepIndex];
    if (!currentStep || currentStep.id !== stepId) return false;

    // Check if station tool cart is missing tools stolen by Władek!
    if (!station.toolCartOk && (stepId === 'remove_wheels' || stepId === 'install_wheels')) {
      worker.speechText = 'Szefie, Władek znowu zwędził klucz udarowy! Muszę go najpierw znaleźć!';
      worker.speechTimer = 160;
      soundManager.playWladekQuip();
      this.notify();
      return false;
    }

    currentStep.inProgress = true;
    currentStep.assignedWorkerId = worker.id;
    worker.currentTaskId = stepId;
    worker.currentStationId = stationId;

    // Determine target location for the step
    let targetPos: { x: number; y: number } = { x: 11, y: stationId === 'station1' ? 7 : 10 };

    if (stepId === 'raise_lift' || stepId === 'lower_lift') {
      targetPos = { x: 13, y: stationId === 'station1' ? 4 : 11 };
    } else if (stepId === 'demount_tires' || stepId === 'mount_new_tires') {
      targetPos = { x: 9, y: stationId === 'station1' ? 3 : 14 };
    } else if (stepId === 'balance_wheels') {
      targetPos = { x: 13, y: stationId === 'station1' ? 3 : 14 };
    } else if (stepId === 'invoice') {
      targetPos = { x: 23, y: 17 }; // Office cash desk
    }

    worker.path = findPath(
      { x: Math.round(worker.pos.x), y: Math.round(worker.pos.y) },
      targetPos,
      isWalkable
    );

    if (worker.path.length <= 1) {
      this.onWorkerReachedDestination(worker);
    } else {
      worker.state = 'walking';
    }

    soundManager.playClick();
    this.notify();
    return true;
  }

  // Complete an order step
  public checkStepCompletion(stationId: 'station1' | 'station2', stepId: string) {
    const station = this.stations.find(s => s.id === stationId);
    if (!station || !station.assignedCarId) return;

    const car = this.cars.find(c => c.id === station.assignedCarId);
    if (!car) return;

    const step = car.order.steps[car.order.currentStepIndex];
    if (step && step.id === stepId) {
      step.completed = true;
      step.inProgress = false;
      step.progress = 1;

      // Visual updates
      if (stepId === 'remove_wheels') {
        car.wheelsOff = true;
        this.addParticle(car.pos.x, car.pos.y, 'Koła odkręcone!', '#22c55e');
      } else if (stepId === 'install_wheels') {
        car.wheelsOff = false;
        this.addParticle(car.pos.x, car.pos.y, 'Koła dokręcone!', '#22c55e');
      }

      car.order.currentStepIndex++;

      // If all steps done
      if (car.order.currentStepIndex >= car.order.steps.length) {
        this.finishOrder(car, station);
      } else {
        this.notify();
      }
    }
  }

  // Invoice in office & finish
  public completeInvoice(stationId: 'station1' | 'station2') {
    const station = this.stations.find(s => s.id === stationId);
    if (!station || !station.assignedCarId) return;

    const car = this.cars.find(c => c.id === station.assignedCarId);
    if (!car) return;

    this.checkStepCompletion(stationId, 'invoice');
  }

  // Direct Point & Click action: triggers the next step on the station without opening menus!
  public performNextStationAction(stationId: 'station1' | 'station2'): boolean {
    const station = this.stations.find(s => s.id === stationId);
    if (!station) return false;

    // If no car assigned to this station, see if a waiting car can drive in
    if (!station.assignedCarId) {
      const waitingCar = this.cars.find(c => c.state === 'parking');
      if (waitingCar) {
        this.startCarDriveIn(waitingCar, stationId);
        return true;
      } else {
        this.toggleLift(stationId);
        return true;
      }
    }

    const car = this.cars.find(c => c.id === station.assignedCarId);
    if (!car) return false;

    // If car is still driving into bay, let it reach the lift
    if (car.state === 'driving_in') {
      this.addParticle(car.pos.x, car.pos.y, 'Auto właśnie wjeżdża...', '#38bdf8');
      return false;
    }

    // Check current step
    const currentStep = car.order.steps[car.order.currentStepIndex];
    if (!currentStep) return false;

    // Check if stolen tool is blocking wheel removal or installation
    if (!station.toolCartOk && (currentStep.id === 'remove_wheels' || currentStep.id === 'install_wheels')) {
      this.addParticle(car.pos.x, car.pos.y, 'Władek zabrał klucz udarowy!', '#ef4444');
      soundManager.playWladekQuip();
      return false;
    }

    // If step is already in progress, give direct feedback
    if (currentStep.inProgress) {
      const activeWorker = this.workers.find(w => w.currentTaskId === currentStep.id && w.currentStationId === stationId);
      const name = activeWorker ? activeWorker.name : 'Pracownik';
      this.addParticle(car.pos.x, car.pos.y, `${name}: ${currentStep.label} (${Math.round((activeWorker?.workProgress || 0) * 100)}%)`, '#f59e0b');
      return true;
    }

    // Direct lift operation
    if (currentStep.id === 'raise_lift') {
      if (station.liftY < 1 && station.liftMoving === 'none') {
        this.toggleLift(stationId);
        currentStep.inProgress = true;
        this.addParticle(car.pos.x, car.pos.y, 'Podnosimy auto na podnośniku!', '#3b82f6');
        return true;
      }
    } else if (currentStep.id === 'lower_lift') {
      if (station.liftY > 0 && station.liftMoving === 'none') {
        this.toggleLift(stationId);
        currentStep.inProgress = true;
        this.addParticle(car.pos.x, car.pos.y, 'Opuszczamy auto z podnośnika!', '#3b82f6');
        return true;
      }
    }

    // Find the dedicated 2 workers assigned to this station
    const stationWorkers = this.workers.filter(w => w.assignedStation === stationId);
    // Prefer idle worker, otherwise pick the first
    let chosenWorker = stationWorkers.find(w => w.state === 'idle');
    if (!chosenWorker) {
      chosenWorker = stationWorkers[0];
    }

    if (chosenWorker) {
      this.assignWorkerToStep(chosenWorker.id, stationId, currentStep.id);
      this.addParticle(car.pos.x, car.pos.y, `${chosenWorker.name}: ${currentStep.label}!`, '#22c55e');
      return true;
    }

    return false;
  }

  // Handle direct click on a car (no modal popup!)
  public handleCarClick(carId: string): boolean {
    const car = this.cars.find(c => c.id === carId);
    if (!car) return false;

    if (car.state === 'parking') {
      // Find free station
      const freeStation = this.stations.find(s => !s.assignedCarId && !this.cars.some(c => c.assignedStationId === s.id && c.state === 'driving_in'));
      if (freeStation) {
        this.startCarDriveIn(car, freeStation.id as 'station1' | 'station2');
        return true;
      } else {
        this.addParticle(car.pos.x, car.pos.y, 'Oba stanowiska są zajęte!', '#f59e0b');
        return false;
      }
    }

    if (car.assignedStationId) {
      return this.performNextStationAction(car.assignedStationId as 'station1' | 'station2');
    }

    return false;
  }

  // Trigger a mischievous mini-event initiated by Władek! (50 diverse events)
  public triggerWladekMiniEvent() {
    // Check upgrades that mitigate or prevent events
    if (this.hasUpgrade('diploma_honorary_assistant') && Math.random() < 0.5) return;
    if (this.hasUpgrade('tea_corner_wladek') && Math.random() < 0.65) return;

    // Pick from the 50 authentic Władek events
    const def = getRandomWladekEvent();

    // Check specific gear protections
    if (def.impactEffect === 'compressor' && this.hasUpgrade('compressor_lockout_cover') && Math.random() < 0.8) return;
    if (def.impactEffect === 'weights' && this.hasUpgrade('locked_weight_dispenser')) return;
    if (def.impactEffect === 'office' && this.hasUpgrade('fuse_stabilizer')) {
      this.addParticle(def.pos.x, def.pos.y, '⚡ Bezpiecznik auto-zresetowany!', '#38bdf8');
      return;
    }

    const id = 'evt_' + Math.random().toString(36).substring(2, 7);

    // Apply specific machine/zone impact
    if (def.impactEffect === 'compressor') {
      this.stats.compressorDisabled = true;
    } else if (def.impactEffect === 'montazownica') {
      const stId = def.stationId || (Math.random() < 0.5 ? 'station1' : 'station2');
      const station = this.stations.find(s => s.id === stId);
      if (station) station.montazownicaBlocked = true;
    } else if (def.impactEffect === 'wywazarka') {
      const stId = def.stationId || (Math.random() < 0.5 ? 'station1' : 'station2');
      const station = this.stations.find(s => s.id === stId);
      if (station) station.wywazarkaBlocked = true;
    } else if (def.impactEffect === 'office') {
      this.stats.officeFusesBlown = true;
    } else if (def.impactEffect === 'patience') {
      for (const car of this.cars) {
        car.order.patience = Math.max(10, car.order.patience - 15);
      }
    }

    const event: WladekMiniEvent = {
      id,
      type: def.type,
      title: def.title,
      description: def.description,
      pos: { ...def.pos },
      stationId: def.stationId,
      active: true,
      resolvedMessage: def.resolvedMessage,
      penaltyText: def.penaltyText,
    };

    this.activeMiniEvents.push(event);
    this.stats.wladekIncidents++;
    soundManager.playWladekQuip();
    this.addParticle(event.pos.x, event.pos.y, `⚠️ ${event.title}`, '#ef4444');

    if (def.wladekSpeech) {
      this.wladek.speechText = def.wladekSpeech;
      this.wladek.speechTimer = 180;
    }

    // Move Władek near the event scene!
    this.wladek.targetPos = { ...def.pos };
    this.wladek.path = findPath(
      { x: Math.round(this.wladek.pos.x), y: Math.round(this.wladek.pos.y) },
      def.pos,
      isWalkable
    );

    this.notify();
  }

  // Resolve an active mini-event when player clicks on the machine/area!
  public resolveMiniEvent(eventIdOrType: string): boolean {
    const idx = this.activeMiniEvents.findIndex(e => e.id === eventIdOrType || e.type === eventIdOrType);
    if (idx === -1) return false;

    const event = this.activeMiniEvents[idx];
    this.activeMiniEvents.splice(idx, 1);

    // Reset potential machine blocks
    if (event.type.includes('compressor') || event.type === 'hose_disconnect' || event.type === 'hose_disconnect_s2' || event.type === 'pressure_regulator_tampered' || event.type === 'chewing_gum_in_quickcoupler' || event.type === 'safety_valve_pull') {
      this.stats.compressorDisabled = false;
      soundManager.playAirHiss();
    }
    
    if (event.stationId) {
      const station = this.stations.find(s => s.id === event.stationId);
      if (station) {
        station.montazownicaBlocked = false;
        station.wywazarkaBlocked = false;
      }
    } else {
      for (const st of this.stations) {
        st.montazownicaBlocked = false;
        st.wywazarkaBlocked = false;
      }
    }

    if (event.type.includes('fuse') || event.type.includes('office') || event.type === 'printer_paper_jam' || event.type === 'stamp_ink_spill') {
      this.stats.officeFusesBlown = false;
      soundManager.playCashSound();
    } else {
      soundManager.playSuccessBeep();
    }

    // Reward player with +35 zł for quick maintenance
    this.stats.money += 35;
    this.addParticle(event.pos.x, event.pos.y, `✅ ${event.resolvedMessage} (+35 zł)`, '#22c55e');
    this.wladek.speechText = 'O, i znowu działa! Widzicie? Władek zdiagnozował!';
    this.wladek.speechTimer = 120;
    this.notify();
    return true;
  }

  private finishOrder(car: Car, station: Station) {
    car.order.status = 'paid';
    station.assignedCarId = null;

    // Calculate tip based on patience and VIP Lounge TV upgrade
    const tipBonus = this.hasUpgrade('vip_lounge_tv') ? 1.3 : 1.0;
    const baseTip = Math.round((car.order.patience / 100) * 45);
    const tip = Math.round(baseTip * tipBonus);
    car.order.tipEarned = tip;

    // Upgrades extra revenue
    let extraBonus = 0;
    if (this.hasUpgrade('wheel_washer')) extraBonus += 25;
    if (this.hasUpgrade('nitrogen_station')) extraBonus += 35;
    if (this.hasUpgrade('vending_machine')) extraBonus += 20;
    if (this.hasUpgrade('tpms_diagnostic_kit')) extraBonus += 45;

    const totalEarned = car.order.pricePLN + tip + extraBonus;

    this.stats.money += totalEarned;
    this.stats.carsServiced++;
    this.stats.reputation = Math.min(5.0, Number((this.stats.reputation + 0.05).toFixed(2)));

    soundManager.playCashSound();
    soundManager.playSuccessBeep();

    const bonusText = extraBonus > 0 ? ` (+${extraBonus} zł ulepszenia)` : '';
    this.addParticle(22, 16, `+${totalEarned} zł (Napiwek: ${tip} zł${bonusText})`, '#22c55e');
    this.addParticle(car.pos.x, car.pos.y, 'Klient zadowolony!', '#f59e0b');

    // Car drives out
    car.state = 'driving_out';
    car.path = [
      { x: car.pos.x, y: 8 },
      { x: 7, y: 8 },
      { x: 0, y: 8 }
    ];

    setTimeout(() => {
      // Remove car from active cars list
      this.cars = this.cars.filter(c => c.id !== car.id);
      this.notify();
    }, 2500);

    this.saveGame();
    this.notify();
  }

  // Update Władek (The comic Ukrainian helper that gets in everyone's way)
  private updateWladek(simSpeed: number) {
    const wladek = this.wladek;
    const calmerBonus = this.hasUpgrade('wladek_radio_disco') ? 0.4 : 1.0;

    // Speech bubble timer
    if (wladek.speechTimer > 0) {
      wladek.speechTimer--;
      if (wladek.speechTimer <= 0) wladek.speechText = null;
    }

    // Walking
    if (wladek.path.length > 0) {
      wladek.state = 'wandering';
      wladek.walkCycle += 0.2 * simSpeed;

      const nextTarget = wladek.path[0];
      const dist = getDist(wladek.pos, nextTarget);
      const speed = 0.045 * simSpeed;

      if (dist <= speed) {
        wladek.pos = { ...nextTarget };
        wladek.path.shift();
        if (wladek.path.length === 0) {
          wladek.state = 'idle';
          wladek.stateTimer = Math.floor((120 + Math.random() * 180) / simSpeed);
        }
      } else {
        const angle = Math.atan2(nextTarget.y - wladek.pos.y, nextTarget.x - wladek.pos.x);
        wladek.pos.x += Math.cos(angle) * speed;
        wladek.pos.y += Math.sin(angle) * speed;
      }
      return;
    }

    // State timer countdown when standing
    if (wladek.stateTimer > 0) {
      wladek.stateTimer -= simSpeed;
      return;
    }

    // Pick new autonomous mischief / wandering action
    const actions = ['wander_to_station', 'drink_coffee', 'check_office', 'steal_tool', 'wander_parking'];
    const chosen = actions[Math.floor(Math.random() * actions.length)];

    // Expanded humorous Polish-Ukrainian quotes library for Władek (35+ quotes)
    const quotes = [
      'Szefie, ja tolko smatriu!',
      'Klucz 17 gdzieś tu był, no i poszedł...',
      'O, jaka ładna felga, nie porysowana jeszcze!',
      'Kawki komuś zrobić? Sam już wypiłem cztery!',
      'Panie Majster, a w traktorze to młotkiem wbijaliśmy!',
      'Szefie, a premia to w złotówkach czy euro?',
      'Ja tylko paczę, nic nie dotykam!',
      'Kto panu tak dokręcił? Pneumatem na chama!',
      'Spokojnie, to jeszcze ze dwa sezony pojeździ!',
      'Bieżnik jak stół bilardowy – idealnie gładki, mniejsze opory toczenia!',
      'Szefie, jak powietrza brakuje, to ja w płucach przyniosę!',
      'Ooo, RunFlat! Twarde jak moje postanowienie rzucenia palenia!',
      'A po co wyważać? Jak trzęsie kierownicą, to kierowca nie zaśnie!',
      'Mirek, nie denerwuj się, złość piękności szkodzi!',
      'Janusz, ty znowu herbatkę sączysz? Podzieliłbyś się z bratem!',
      'Seba, weź te cztery koła na plecy, na siłownię nie musisz chodzić!',
      'Darek, ty taki silny, podnieś tego Passata rękami, prąd zaoszczędzimy!',
      'Szefie, a ten wentylek to w lewo czy w prawo się wkręca?',
      'Śruby dociągnięte na dwa i pół metra rury! Żaden złodziej nie odkręci!',
      'Ja w biurze cukierki znalazłem... Sprawdziłem, nie były przeterminowane!',
      'Panie Zdzisławie, ta rysa na zderzaku dodaje autu charakteru!',
      'Władek nie psuje, Władek wprowadza autorskie innowacje!',
      'Gdzie ten klucz 19 poszedł? Sam miał nóżki i uciekł, słowo honoru!',
      'O, klient wjechał! Powiem mu, że silnik do wymiany, nie tylko opony!',
      'Pastą montażową to ja sobie kiedyś chleb posmarowałem, smaczna była!',
      'Panie, a na tych oponach to jeszcze mój dziadek z frontu wracał!',
      'Uże idu, uże idu! Tylko zobaczę, co w poczekalni w telewizorze leci!',
      'Majster kazał mi pilnować, żeby podnośnik nie uciekł, to stoję i pilnuję!',
      'Szefie, a ten kompresor to tak ma głośno sapać, czy zaraz wybuchnie?',
      'Zrobiłem kawę dla klienta, ale chyba z mleczkiem do opon pomyliłem...',
      'Ciężarki wyważające to ja na gumę do żucia przykleję, taniej wyjdzie!'
    ];

    if (chosen === 'steal_tool' && Math.random() < (0.28 * calmerBonus) && !wladek.stolenTool) {
      // Władek picks up a tool and hides it!
      const station = this.stations[Math.floor(Math.random() * this.stations.length)];
      if (station.toolCartOk) {
        station.toolCartOk = false;
        wladek.stolenTool = 'pneumatic_wrench';
        wladek.stolenToolName = 'Klucz udarowy 1/2"';
        // Random hiding spot: waiting room couch, office desk, or tire rack
        const hideSpots = [
          { x: 14, y: 18 }, // sofa
          { x: 21, y: 16 }, // office desk
          { x: 19, y: 3 },  // tire racks
          { x: 16, y: 8 },  // compressor
        ];
        const hideSpot = hideSpots[Math.floor(Math.random() * hideSpots.length)];
        wladek.stolenToolLocation = hideSpot;

        wladek.speechText = 'O, jaki fajny kluczyk! Wezmę, żeby nie zginął!';
        wladek.speechTimer = 220;
        this.stats.wladekIncidents++;

        soundManager.playWladekQuip();
        this.addParticle(wladek.pos.x, wladek.pos.y, 'Władek zabrał klucz!', '#ef4444');

        // Path to hide spot
        wladek.path = findPath(
          { x: Math.round(wladek.pos.x), y: Math.round(wladek.pos.y) },
          hideSpot,
          isWalkable
        );
        this.notify();
        return;
      }
    }

    // Default wander
    const targets = [
      { x: 11, y: 8 },  // Between bay 1 and bay 2
      { x: 14, y: 18 }, // Coffee couch
      { x: 20, y: 16 }, // Office desk
      { x: 16, y: 8 },  // Compressor
      { x: 19, y: 4 },  // Tire storage
      { x: 6, y: 8 },   // Workshop entrance
    ];

    const target = targets[Math.floor(Math.random() * targets.length)];
    wladek.speechText = quotes[Math.floor(Math.random() * quotes.length)];
    wladek.speechTimer = 180;
    wladek.stateTimer = 180;

    wladek.path = findPath(
      { x: Math.round(wladek.pos.x), y: Math.round(wladek.pos.y) },
      target,
      isWalkable
    );
  }

  // Player interacts with Władek (clicks on him to scold / ask)
  public interactWithWladek() {
    const quotes = [
      'Ja nic nie robię, szefie! Opony układam w myślach!',
      'Zaraz pomogę, tylko kawkę dopiję!',
      'Majster kazał mi pilnować, żeby śruby nie uciekały!',
      'Władek do usług! Felgi wyważone na oko!',
      'Nie krzyczcie szefie, ja tu od czarnej roboty jestem!',
      'Szefie, ja ten klucz tylko pożyczyłem, żeby sprawdzić czy nie zardzewiał!',
      'Już idę do magazynu, tylko sprawdzę czy opony nie uciekły!',
      'Władek wie wszystko o kołach – okrągłe są i się kręcą!'
    ];

    this.wladek.speechText = quotes[Math.floor(Math.random() * quotes.length)];
    this.wladek.speechTimer = 200;
    soundManager.playWladekQuip();

    // If he is currently holding stolen tool, he drops it back!
    if (this.wladek.stolenTool) {
      this.recoverStolenTool();
    } else {
      // Send Władek to wander to tire racks out of the way
      this.wladek.path = findPath(
        { x: Math.round(this.wladek.pos.x), y: Math.round(this.wladek.pos.y) },
        { x: 21, y: 4 },
        isWalkable
      );
    }
    this.notify();
  }

  // Recover tool stolen by Władek
  public recoverStolenTool() {
    this.wladek.stolenTool = null;
    this.wladek.stolenToolLocation = null;
    this.wladek.stolenToolName = null;

    // Restore all tool carts
    for (const station of this.stations) {
      station.toolCartOk = true;
    }

    soundManager.playSuccessBeep();
    this.addParticle(this.wladek.pos.x, this.wladek.pos.y, 'Odzyskano klucz udarowy!', '#22c55e');
    this.notify();
  }

  // Purchase workshop upgrade
  public buyUpgrade(upgradeId: string): boolean {
    const upgrade = this.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased) return false;

    if (this.stats.money >= upgrade.cost) {
      this.stats.money -= upgrade.cost;
      upgrade.purchased = true;
      soundManager.playCashSound();
      this.addParticle(20, 16, `Zakupiono: ${upgrade.name}!`, '#22c55e');
      this.saveGame();
      this.notify();
      return true;
    }
    return false;
  }

  public hasUpgrade(upgradeId: string): boolean {
    return this.upgrades.some(u => u.id === upgradeId && u.purchased);
  }

  // Spawn cars in parking lot
  private checkAndSpawnCars() {
    const parkingCars = this.cars.filter(c => c.state === 'parking');
    if (parkingCars.length < 3) {
      const types: ('full_tire_swap' | 'puncture_repair' | 'balancing' | 'valve_replacement')[] = [
        'full_tire_swap', 'puncture_repair', 'balancing', 'valve_replacement'
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      const order = createOrder(type);

      // Find free parking spot (x: 2 or 4, y: 3, 7, 11)
      const slots = [
        { x: 3, y: 3 },
        { x: 3, y: 7 },
        { x: 3, y: 11 },
      ];
      const freeSlot = slots.find(s => !parkingCars.some(c => Math.abs(c.pos.x - s.x) < 2 && Math.abs(c.pos.y - s.y) < 2)) || slots[0];

      const newCar: Car = {
        id: 'car_' + Math.random().toString(36).substring(2, 7),
        order,
        color: order.carColor,
        model: order.carModel,
        licensePlate: order.licensePlate,
        bodyType: order.bodyType,
        pos: { ...freeSlot },
        targetPos: null,
        assignedStationId: null,
        wheelsOff: false,
        state: 'parking',
      };

      this.cars.push(newCar);
      soundManager.playCarHorn();
      this.notify();
    }
  }

  // Particle helper
  public addParticle(gx: number, gy: number, text: string, color: string = '#22c55e') {
    // Iso position for particle
    const isoX = (gx - gy) * 32;
    const isoY = (gx + gy) * 16 - 30;

    this.particles.push({
      x: isoX,
      y: isoY,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.8,
      color,
      size: 4,
      alpha: 1,
      life: 0,
      maxLife: 90,
      text,
    });
  }

  private addSparks(gx: number, gy: number) {
    const isoX = (gx - gy) * 32;
    const isoY = (gx + gy) * 16;

    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: isoX + (Math.random() - 0.5) * 12,
        y: isoY - 10 + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.8) * 2,
        color: '#facc15',
        size: 2,
        alpha: 1,
        life: 0,
        maxLife: 20,
      });
    }
  }

  // LocalStorage save and load
  public saveGame() {
    try {
      const data = {
        money: this.stats.money,
        reputation: this.stats.reputation,
        carsServiced: this.stats.carsServiced,
        day: this.stats.day,
        upgrades: this.upgrades.map(u => ({ id: u.id, purchased: u.purchased })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors in sandboxed iframes
    }
  }

  public loadGame() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.money !== undefined) this.stats.money = data.money;
      if (data.reputation !== undefined) this.stats.reputation = data.reputation;
      if (data.carsServiced !== undefined) this.stats.carsServiced = data.carsServiced;
      if (data.day !== undefined) this.stats.day = data.day;
      if (data.upgrades) {
        for (const u of data.upgrades) {
          const up = this.upgrades.find(item => item.id === u.id);
          if (up) up.purchased = u.purchased;
        }
      }
    } catch {
      // Ignore
    }
  }
}

export const gameEngine = new GameEngine();
