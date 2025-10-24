
import React from 'react';
import type { PowerUpState } from '../types';
import { PowerUpType, } from '../types';
import * as C from '../constants';

interface GameUIProps {
    score: number;
    highScore: number;
    activePowerUps: PowerUpState[];
}

const PowerUpIndicator: React.FC<{ powerUp: PowerUpState }> = ({ powerUp }) => {
    let text = '';
    let color = '';
    switch (powerUp.type) {
        case PowerUpType.RapidFire:
            text = 'RAPID FIRE';
            color = 'text-yellow-400';
            break;
        case PowerUpType.Shield:
            text = 'SHIELD';
            color = 'text-blue-400';
            break;
        default: return null;
    }

    const widthPercentage = (powerUp.duration / C.POWERUP_DURATION) * 100;

    return (
        <div className={`relative overflow-hidden font-bold px-2 py-1 ${color}`}>
            <span>{text}</span>
            <div className="absolute bottom-0 left-0 h-1 bg-white/50" style={{ width: `${widthPercentage}%`}}></div>
        </div>
    );
};

const GameUI: React.FC<GameUIProps> = ({ score, highScore, activePowerUps }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-2 text-white z-20 flex justify-between items-start text-lg">
      <div>
        <div className="font-bold text-cyan-400">HIGH SCORE: {highScore}</div>
        <div className="font-bold text-2xl">SCORE: {score}</div>
      </div>
      <div className="text-right">
        {activePowerUps.map(p => <PowerUpIndicator key={p.type} powerUp={p} />)}
      </div>
    </div>
  );
};

export default GameUI;
