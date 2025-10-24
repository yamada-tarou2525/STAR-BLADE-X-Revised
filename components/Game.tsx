import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Bullet, Enemy, PowerUp, Particle, PowerUpType, PowerUpState, BulletType } from '../types';
import { useGameLoop } from '../utils/useGameLoop';
import { checkCollision } from '../utils/collision';
import * as C from '../constants';
import GameUI from './GameUI';

interface GameProps {
  onGameOver: (score: number) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  highScore: number;
}

const Game: React.FC<GameProps> = ({ onGameOver, setScore, score, highScore }) => {
  const [player, setPlayer] = useState<Player>({
    id: 0,
    x: C.GAME_WIDTH / 2 - C.PLAYER_WIDTH / 2,
    y: C.PLAYER_Y_POSITION,
    width: C.PLAYER_WIDTH,
    height: C.PLAYER_HEIGHT,
  });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<PowerUpState[]>([]);
  const [isShielded, setIsShielded] = useState(false);

  const keysPressed = useRef<Record<string, boolean>>({});
  const lastShotTimes = useRef<Record<string, number>>({});
  const lastEnemySpawnTime = useRef(0);
  const gameTime = useRef(0);

  const createExplosion = useCallback((x: number, y: number, color?: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < C.PARTICLE_COUNT; i++) {
      newParticles.push({
        id: Math.random(),
        x,
        y,
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        color: color || ['#ffcc00', '#ff6600', '#ff0000', '#ffffff'][Math.floor(Math.random() * 4)],
        life: C.PARTICLE_LIFE,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);
  
  const spawnPowerUp = useCallback((x: number, y: number) => {
      if (Math.random() < C.POWERUP_DROP_CHANCE) {
          const typeValues = Object.values(PowerUpType).filter(v => typeof v === 'number') as number[];
          const randomType = typeValues[Math.floor(Math.random() * typeValues.length)];

          const newPowerUp: PowerUp = {
              id: Date.now(),
              x,
              y,
              width: C.POWERUP_SIZE,
              height: C.POWERUP_SIZE,
              type: randomType,
          };
          setPowerUps(prev => [...prev, newPowerUp]);
      }
  }, []);
  
  const createBullet = useCallback((bulletType: BulletType) => {
      const props = C.BULLET_PROPERTIES[bulletType];
      const newBullets: Bullet[] = [];
      const baseBullet = {
          id: Math.random(),
          y: player.y,
          width: props.width,
          height: props.height,
          isPlayerBullet: true,
          type: bulletType,
          initialX: player.x + C.PLAYER_WIDTH / 2,
      };

      switch (props.special) {
          case 'DOUBLE':
          case 'V-SHOT':
              const offset = props.special === 'V-SHOT' ? 15 : 5;
              newBullets.push({ ...baseBullet, id: Math.random(), x: player.x + C.PLAYER_WIDTH / 2 - props.width / 2 - offset, vx: props.special === 'V-SHOT' ? -2 : 0 });
              newBullets.push({ ...baseBullet, id: Math.random(), x: player.x + C.PLAYER_WIDTH / 2 - props.width / 2 + offset, vx: props.special === 'V-SHOT' ? 2 : 0 });
              break;
          case 'MULTI':
              newBullets.push({ ...baseBullet, id: Math.random(), x: player.x + C.PLAYER_WIDTH / 2 - props.width / 2, vx: -2, vy: -props.speed });
              newBullets.push({ ...baseBullet, id: Math.random(), x: player.x + C.PLAYER_WIDTH / 2 - props.width / 2, vx: 0, vy: -props.speed });
              newBullets.push({ ...baseBullet, id: Math.random(), x: player.x + C.PLAYER_WIDTH / 2 - props.width / 2, vx: 2, vy: -props.speed });
              break;
          case 'SPREAD':
              for (let i = 0; i < 5; i++) {
                  newBullets.push({ ...baseBullet, id: Math.random(), x: player.x + C.PLAYER_WIDTH / 2 - props.width / 2, angle: -Math.PI / 4 + (i * Math.PI / 8) });
              }
              break;
          case 'LASER':
             newBullets.push({ ...baseBullet, x: player.x + C.PLAYER_WIDTH / 2 - props.width / 2, y: 0, life: props.life });
             break;
          default:
              newBullets.push({ ...baseBullet, x: player.x + C.PLAYER_WIDTH / 2 - props.width / 2, vx: 0 });
              break;
      }
      setBullets(prev => [...prev, ...newBullets]);
  }, [player]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      const key = e.key.toUpperCase();
      if (C.BULLET_TYPE_MAP[key] !== undefined) {
          const now = Date.now();
          const bulletType = C.BULLET_TYPE_MAP[key];
          const props = C.BULLET_PROPERTIES[bulletType];
          if (now - (lastShotTimes.current[key] || 0) > props.cooldown) {
              lastShotTimes.current[key] = now;
              createBullet(bulletType);
          }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [createBullet]);

  useEffect(() => {
      setIsShielded(activePowerUps.some(p => p.type === PowerUpType.Shield));
  }, [activePowerUps]);

  const gameLoop = useCallback((deltaTime: number) => {
    gameTime.current += deltaTime;

    // --- MOVEMENT ---
    setPlayer(prev => {
        let newX = prev.x;
        if (keysPressed.current['ArrowLeft']) newX -= C.PLAYER_SPEED;
        if (keysPressed.current['ArrowRight']) newX += C.PLAYER_SPEED;
        return { ...prev, x: Math.max(0, Math.min(C.GAME_WIDTH - C.PLAYER_WIDTH, newX)) };
    });

    setBullets(prev => prev.map(b => {
        if (!b.isPlayerBullet) {
            return { ...b, y: b.y + C.ENEMY_BULLET_SPEED };
        }
        if (b.type === undefined) return b; // Should not happen for player bullets

        const props = C.BULLET_PROPERTIES[b.type];
        let newX = b.x;
        let newY = b.y;
        let newVx = b.vx || 0;
        let newVy = b.vy || -props.speed;
        let newLife = b.life;

        switch (props.special) {
            case 'WAVE':
                newX = b.initialX + Math.sin(b.y / 30) * 30 - b.width/2;
                newY += newVy;
                break;
            case 'ZIGZAG':
                if (b.vy === undefined) b.vy = 0;
                b.vy++;
                if (b.vy % 30 === 0) newVx = -newVx || 3;
                newX += newVx;
                newY += newVy;
                break;
            case 'HOMING':
                 if (!b.targetId || !enemies.find(e => e.id === b.targetId)) {
                    let closestDist = Infinity;
                    let closestEnemy = null;
                    enemies.forEach(enemy => {
                        const dist = Math.hypot(enemy.x - b.x, enemy.y - b.y);
                        if (dist < closestDist) {
                            closestDist = dist;
                            closestEnemy = enemy;
                        }
                    });
                    b.targetId = closestEnemy?.id;
                }
                const target = enemies.find(e => e.id === b.targetId);
                if (target) {
                    const angle = Math.atan2(target.y - b.y, target.x - b.x);
                    newVx = Math.cos(angle) * props.speed;
                    newVy = Math.sin(angle) * props.speed;
                }
                newX += newVx;
                newY += newVy;
                break;
            case 'SPREAD':
                if (b.angle !== undefined) {
                    newX += Math.cos(b.angle - Math.PI / 2) * props.speed;
                    newY += Math.sin(b.angle - Math.PI / 2) * props.speed;
                }
                break;
             case 'V-SHOT':
                newX += b.vx || 0;
                newY += newVy;
                break;
            case 'LASER':
                newLife = (b.life || 0) - 1;
                break;
            default:
                newX += newVx;
                newY += newVy;
                break;
        }
        return { ...b, x: newX, y: newY, vx: newVx, vy: newVy, life: newLife };
    }).filter(b => b.y + b.height > 0 && b.y < C.GAME_HEIGHT && b.life !== 0));


    const difficultyFactor = 1 + Math.floor(score / 1000) * 0.2;
    const enemySpeed = C.INITIAL_ENEMY_SPEED * difficultyFactor;
    const enemySpawnRate = Math.max(200, C.INITIAL_ENEMY_SPAWN_RATE / difficultyFactor);
    
    if (Date.now() - lastEnemySpawnTime.current > enemySpawnRate) {
        setEnemies(prev => [...prev, {
            id: Date.now() + Math.random(),
            x: Math.random() * (C.GAME_WIDTH - C.ENEMY_WIDTH),
            y: -C.ENEMY_HEIGHT,
            width: C.ENEMY_WIDTH,
            height: C.ENEMY_HEIGHT,
            health: 1, type: 1,
        }]);
        lastEnemySpawnTime.current = Date.now();
    }
    setEnemies(prev => prev.map(e => ({ ...e, y: e.y + enemySpeed })).filter(e => e.y < C.GAME_HEIGHT));
    
    // Enemy shooting
    const newEnemyBullets: Bullet[] = [];
    enemies.forEach(enemy => {
        if (Math.random() < C.ENEMY_SHOOT_PROBABILITY * (difficultyFactor * 0.5 + 0.5)) {
            newEnemyBullets.push({
                id: Math.random(),
                x: enemy.x + C.ENEMY_WIDTH / 2 - C.ENEMY_BULLET_WIDTH / 2,
                y: enemy.y + C.ENEMY_HEIGHT,
                width: C.ENEMY_BULLET_WIDTH,
                height: C.ENEMY_BULLET_HEIGHT,
                isPlayerBullet: false,
            });
        }
    });
    if (newEnemyBullets.length > 0) {
        setBullets(prev => [...prev, ...newEnemyBullets]);
    }

    setPowerUps(prev => prev.map(p => ({...p, y: p.y + C.POWERUP_SPEED})).filter(p => p.y < C.GAME_HEIGHT));
    setActivePowerUps(prev => prev.map(p => ({ ...p, duration: p.duration - deltaTime })).filter(p => p.duration > 0));
    setParticles(prev => prev.map(p => ({...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 1 })).filter(p => p.life > 0));

    // --- COLLISION DETECTION ---
    const bulletsToRemove = new Set<number>();
    const enemiesToRemove = new Set<number>();
    const powerUpsToRemove = new Set<number>();
    let gameOverTriggered = false;

    // 1. Player bullets vs Enemies
    bullets.forEach(bullet => {
        if (bullet.isPlayerBullet && bullet.type !== undefined) {
            const props = C.BULLET_PROPERTIES[bullet.type];
            enemies.forEach(enemy => {
                if (!bulletsToRemove.has(bullet.id) && !enemiesToRemove.has(enemy.id) && checkCollision(bullet, enemy)) {
                    if (props.special !== 'PIERCE' && props.special !== 'LASER') {
                        bulletsToRemove.add(bullet.id);
                    }
                    if (props.special === 'EXPLOSIVE') {
                        createExplosion(bullet.x, bullet.y);
                        enemies.forEach(expEnemy => {
                            if (Math.hypot(expEnemy.x - bullet.x, expEnemy.y - bullet.y) < 80) {
                                if (!enemiesToRemove.has(expEnemy.id)) {
                                    enemiesToRemove.add(expEnemy.id);
                                    setScore(s => s + 100);
                                    spawnPowerUp(expEnemy.x, expEnemy.y);
                                }
                            }
                        });
                    } else {
                        enemiesToRemove.add(enemy.id);
                        setScore(s => s + 100);
                        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                        spawnPowerUp(enemy.x, enemy.y);
                    }
                }
            });
        }
    });
    
    // 2. Enemy bullets vs Player
    bullets.forEach(bullet => {
        if (!gameOverTriggered && !bullet.isPlayerBullet && checkCollision(player, bullet)) {
            bulletsToRemove.add(bullet.id);
            if (isShielded) {
                setActivePowerUps(prev => prev.filter(p => p.type !== PowerUpType.Shield));
                createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#00ffff');
            } else {
                gameOverTriggered = true;
            }
        }
    });

    // 3. Enemies vs Player
    enemies.forEach(enemy => {
        if (!gameOverTriggered && !enemiesToRemove.has(enemy.id) && checkCollision(player, enemy)) {
            enemiesToRemove.add(enemy.id);
            if (isShielded) {
                setActivePowerUps(prev => prev.filter(p => p.type !== PowerUpType.Shield));
                createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#00ffff');
            } else {
                gameOverTriggered = true;
            }
        }
    });

    // 4. Player vs PowerUps
    powerUps.forEach(powerUp => {
        if (checkCollision(player, powerUp)) {
            powerUpsToRemove.add(powerUp.id);
            if (powerUp.type === PowerUpType.Bomb) {
                setEnemies(prev => {
                    prev.forEach(e => createExplosion(e.x + e.width / 2, e.y + e.height / 2));
                    setScore(s => s + prev.length * 100);
                    return [];
                });
            } else {
                setActivePowerUps(prev => [...prev.filter(p => p.type !== powerUp.type), { type: powerUp.type, duration: C.POWERUP_DURATION }]);
            }
        }
    });

    // --- STATE UPDATES from collisions ---
    if (bulletsToRemove.size > 0) setBullets(prev => prev.filter(b => !bulletsToRemove.has(b.id)));
    if (enemiesToRemove.size > 0) setEnemies(prev => prev.filter(e => !enemiesToRemove.has(e.id)));
    if (powerUpsToRemove.size > 0) setPowerUps(prev => prev.filter(p => !powerUpsToRemove.has(p.id)));

    if (gameOverTriggered) {
        onGameOver(score);
    }
  }, [ onGameOver, score, setScore, createExplosion, spawnPowerUp, powerUps, isShielded, enemies]);
  
  useGameLoop(gameLoop);

  return (
    <div className="relative overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_theme(colors.cyan.400)]" style={{ width: C.GAME_WIDTH, height: C.GAME_HEIGHT }}>
        <GameUI score={score} highScore={highScore} activePowerUps={activePowerUps} />
      <div className="absolute bg-cyan-400" style={{ left: player.x, top: player.y, width: player.width, height: player.height, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} >
        <div className="absolute w-2 h-4 bg-white" style={{ left: 'calc(50% - 4px)', top: '10px' }}></div>
      </div>
      { isShielded && <div className="absolute rounded-full border-2 border-cyan-200 opacity-50 animate-pulse" style={{left: player.x-10, top: player.y-10, width: C.PLAYER_WIDTH+20, height: C.PLAYER_HEIGHT+20}} /> }

      {bullets.map(b => {
          if (b.isPlayerBullet && b.type !== undefined) {
              const props = C.BULLET_PROPERTIES[b.type];
              const opacity = props.special === 'LASER' ? (b.life || 0) / props.life : 1;
              return <div key={b.id} className={`absolute ${props.color} rounded-sm`} style={{ left: b.x, top: b.y, width: b.width, height: b.height, opacity }} />;
          } else {
              return <div key={b.id} className="absolute bg-red-500" style={{ left: b.x, top: b.y, width: C.ENEMY_BULLET_WIDTH, height: C.ENEMY_BULLET_HEIGHT }} />;
          }
      })}

      {enemies.map(e => (
        <div key={e.id} className="absolute bg-fuchsia-500" style={{ left: e.x, top: e.y, width: e.width, height: e.height, clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}/>
      ))}

      {powerUps.map(p => {
          let color = 'bg-green-500'; let text = '?';
          if (p.type === PowerUpType.RapidFire) { color = 'bg-yellow-500'; text = 'R';}
          if (p.type === PowerUpType.Shield) { color = 'bg-blue-500'; text = 'S';}
          if (p.type === PowerUpType.Bomb) { color = 'bg-red-500'; text = 'B';}
          return (<div key={p.id} className={`absolute ${color} rounded-full flex items-center justify-center font-bold text-xl text-white animate-bounce`} style={{ left: p.x, top: p.y, width: p.width, height: p.height }}>{text}</div>);
      })}

      {particles.map(p => (
        <div key={p.id} className="absolute" style={{ left: p.x, top: p.y, width: p.width, height: p.height, background: p.color, opacity: p.life / C.PARTICLE_LIFE, borderRadius: '50%' }} />
      ))}
    </div>
  );
};

export default Game;