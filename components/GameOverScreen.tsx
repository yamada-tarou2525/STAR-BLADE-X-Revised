
import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart, onMenu }) => {
  return (
    <div className="text-center text-white bg-black bg-opacity-50 p-10 rounded-lg backdrop-blur-sm border border-red-500/50">
      <h2 className="text-6xl md:text-8xl font-black text-red-500" style={{ textShadow: '0 0 10px #ef4444, 0 0 20px #ef4444' }}>GAME OVER</h2>
      <p className="mt-4 text-2xl">YOUR SCORE: {score}</p>
      <p className="mt-2 text-xl text-cyan-400">HIGH SCORE: {highScore}</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-cyan-500 text-black font-bold text-2xl rounded-md border-2 border-cyan-300 hover:bg-cyan-400 hover:shadow-[0_0_20px_theme(colors.cyan.400)] transition-all duration-300 transform hover:scale-105"
        >
          RESTART
        </button>
        <button
          onClick={onMenu}
          className="px-8 py-4 bg-gray-600 text-white font-bold text-2xl rounded-md border-2 border-gray-400 hover:bg-gray-500 transition-all duration-300"
        >
          MENU
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
