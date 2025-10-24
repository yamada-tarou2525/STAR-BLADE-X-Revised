import { BulletType } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const PLAYER_WIDTH = 50;
export const PLAYER_HEIGHT = 30;
export const PLAYER_SPEED = 8;
export const PLAYER_Y_POSITION = GAME_HEIGHT - PLAYER_HEIGHT - 20;

export const BULLET_WIDTH = 5;
export const BULLET_HEIGHT = 15;
export const BULLET_SPEED = 10;
export const SHOOT_COOLDOWN = 250; // ms
export const RAPID_FIRE_COOLDOWN = 80; // ms

export const ENEMY_WIDTH = 40;
export const ENEMY_HEIGHT = 40;
export const INITIAL_ENEMY_SPEED = 1.5;
export const INITIAL_ENEMY_SPAWN_RATE = 1000; // ms
export const ENEMY_SHOOT_PROBABILITY = 0.008;

export const ENEMY_BULLET_WIDTH = 5;
export const ENEMY_BULLET_HEIGHT = 10;
export const ENEMY_BULLET_SPEED = 5;


export const POWERUP_SIZE = 30;
export const POWERUP_SPEED = 2;
export const POWERUP_DROP_CHANCE = 0.1; // 10%
export const POWERUP_DURATION = 5000; // ms

export const PARTICLE_COUNT = 20;
export const PARTICLE_LIFE = 60; // frames

export const BULLET_TYPE_MAP: { [key: string]: BulletType } = {
  A: BulletType.A, B: BulletType.B, C: BulletType.C, D: BulletType.D, E: BulletType.E,
  F: BulletType.F, G: BulletType.G, H: BulletType.H, I: BulletType.I, J: BulletType.J,
  K: BulletType.K, L: BulletType.L, M: BulletType.M, N: BulletType.N, O: BulletType.O,
  P: BulletType.P, Q: BulletType.Q, R: BulletType.R, S: BulletType.S, T: BulletType.T,
  U: BulletType.U, V: BulletType.V, W: BulletType.W, X: BulletType.X, Y: BulletType.Y, Z: BulletType.Z,
};

const BASE_BULLET = { damage: 1, life: -1 };

// FIX: Define a type for bullet properties to make the `special` property optional, resolving TypeScript errors in Game.tsx.
type BulletProperty = {
  name: string;
  width: number;
  height: number;
  speed: number;
  color: string;
  cooldown: number;
  damage: number;
  life: number;
  special?: 'DOUBLE' | 'EXPLOSIVE' | 'PIERCE' | 'HOMING' | 'LASER' | 'MULTI' | 'SPREAD' | 'V-SHOT' | 'WAVE' | 'ZIGZAG';
};

export const BULLET_PROPERTIES: Record<BulletType, BulletProperty> = {
  [BulletType.A]: { ...BASE_BULLET, name: 'Standard', width: 5, height: 15, speed: 12, color: 'bg-yellow-300', cooldown: 200 },
  [BulletType.B]: { ...BASE_BULLET, name: 'Big', width: 20, height: 20, speed: 6, color: 'bg-red-500', cooldown: 500, damage: 3 },
  [BulletType.C]: { ...BASE_BULLET, name: 'Critic', width: 7, height: 7, speed: 15, color: 'bg-teal-300', cooldown: 250, damage: 2 },
  [BulletType.D]: { ...BASE_BULLET, name: 'Double', width: 5, height: 15, speed: 12, color: 'bg-cyan-300', cooldown: 350, special: 'DOUBLE' },
  [BulletType.E]: { ...BASE_BULLET, name: 'Explosive', width: 12, height: 12, speed: 8, color: 'bg-rose-600', cooldown: 800, special: 'EXPLOSIVE', damage: 2 },
  [BulletType.F]: { ...BASE_BULLET, name: 'Fast', width: 3, height: 20, speed: 25, color: 'bg-white', cooldown: 100 },
  [BulletType.G]: { ...BASE_BULLET, name: 'Gauss', width: 8, height: 25, speed: 18, color: 'bg-indigo-400', cooldown: 400, damage: 2, special: 'PIERCE' },
  [BulletType.H]: { ...BASE_BULLET, name: 'Homing', width: 8, height: 8, speed: 8, color: 'bg-green-400', cooldown: 600, special: 'HOMING' },
  [BulletType.I]: { ...BASE_BULLET, name: 'Impact', width: 15, height: 15, speed: 9, color: 'bg-gray-400', cooldown: 300, damage: 2 },
  [BulletType.J]: { ...BASE_BULLET, name: 'Jolt', width: 6, height: 12, speed: 11, color: 'bg-amber-400', cooldown: 200 },
  [BulletType.K]: { ...BASE_BULLET, name: 'Kinetic', width: 7, height: 17, speed: 14, color: 'bg-sky-400', cooldown: 220, damage: 1 },
  [BulletType.L]: { ...BASE_BULLET, name: 'Laser', width: 4, height: GAME_HEIGHT, speed: 0, color: 'bg-pink-500', cooldown: 1200, special: 'LASER', damage: 0.2, life: 15 },
  [BulletType.M]: { ...BASE_BULLET, name: 'Multi', width: 8, height: 8, speed: 9, color: 'bg-orange-400', cooldown: 600, special: 'MULTI' },
  [BulletType.N]: { ...BASE_BULLET, name: 'Nova', width: 10, height: 10, speed: 10, color: 'bg-fuchsia-400', cooldown: 250 },
  [BulletType.O]: { ...BASE_BULLET, name: 'Orbit', width: 9, height: 9, speed: 11, color: 'bg-stone-300', cooldown: 180 },
  [BulletType.P]: { ...BASE_BULLET, name: 'Pulse', width: 18, height: 5, speed: 13, color: 'bg-violet-500', cooldown: 300 },
  [BulletType.Q]: { ...BASE_BULLET, name: 'Quick', width: 4, height: 10, speed: 18, color: 'bg-slate-300', cooldown: 150 },
  [BulletType.R]: { ...BASE_BULLET, name: 'Rocket', width: 10, height: 20, speed: 7, color: 'bg-orange-600', cooldown: 700, special: 'EXPLOSIVE', damage: 3 },
  [BulletType.S]: { ...BASE_BULLET, name: 'Spread', width: 6, height: 6, speed: 10, color: 'bg-purple-400', cooldown: 800, special: 'SPREAD' },
  [BulletType.T]: { ...BASE_BULLET, name: 'Twin', width: 5, height: 12, speed: 13, color: 'bg-emerald-400', cooldown: 400, special: 'DOUBLE' },
  [BulletType.U]: { ...BASE_BULLET, name: 'Ultra', width: 6, height: 16, speed: 16, color: 'bg-cyan-500', cooldown: 180 },
  [BulletType.V]: { ...BASE_BULLET, name: 'V-Shot', width: 7, height: 7, speed: 10, color: 'bg-lime-300', cooldown: 450, special: 'V-SHOT' },
  [BulletType.W]: { ...BASE_BULLET, name: 'Wave', width: 10, height: 10, speed: 8, color: 'bg-blue-300', cooldown: 300, special: 'WAVE' },
  [BulletType.X]: { ...BASE_BULLET, name: 'X-Factor', width: 12, height: 12, speed: 9, color: 'bg-red-700', cooldown: 500, damage: 2, special: 'PIERCE' },
  [BulletType.Y]: { ...BASE_BULLET, name: 'Yank', width: 5, height: 10, speed: 11, color: 'bg-yellow-500', cooldown: 200 },
  [BulletType.Z]: { ...BASE_BULLET, name: 'Zigzag', width: 8, height: 8, speed: 10, color: 'bg-lime-400', cooldown: 250, special: 'ZIGZAG' },
};