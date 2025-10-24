import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="text-center text-white bg-black bg-opacity-50 p-10 rounded-lg backdrop-blur-sm border border-cyan-400/50">
      <h1 className="text-6xl md:text-8xl font-black text-cyan-400" style={{ textShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4' }}>STAR BLADE X</h1>
      <p className="mt-4 text-lg">HIGH SCORE: {highScore}</p>
      <button
        onClick={onStart}
        className="mt-8 px-8 py-4 bg-cyan-500 text-black font-bold text-2xl rounded-md border-2 border-cyan-300 hover:bg-cyan-400 hover:shadow-[0_0_20px_theme(colors.cyan.400)] transition-all duration-300 transform hover:scale-105"
      >
        START GAME
      </button>
      <div className="mt-8 text-cyan-200 text-sm">
        <p><span className="font-bold">[ARROW KEYS]</span> to Move</p>
        <p><span className="font-bold">[A] - [Z] KEYS</span> to Shoot Various Bullets</p>
      </div>
    </div>
  );
};

export default StartScreen;
