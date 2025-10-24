export enum GameState {
  Start,
  Playing,
  GameOver,
}

export interface GameObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends GameObject {}

export enum BulletType {
  A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z
}

export interface Bullet extends GameObject {
  isPlayerBullet: boolean;
  type?: BulletType;
  // For special movements
  vx?: number;
  vy?: number;
  initialX?: number;
  life?: number;
  targetId?: number | null;
  angle?: number;
}

export interface Enemy extends GameObject {
  health: number;
  type: number;
}

export enum PowerUpType {
  RapidFire,
  Shield,
  Bomb,
}

export interface PowerUp extends GameObject {
  type: PowerUpType;
}

export interface Particle extends GameObject {
  color: string;
  life: number;
  vx: number;
  vy: number;
}

export interface PowerUpState {
  type: PowerUpType;
  duration: number;
}