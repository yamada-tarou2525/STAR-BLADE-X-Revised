
import React, { useState, useCallback, useEffect } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import { GameState } from './types';
import { StarField } from './components/StarField';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('starBladeXHighScore') || '0', 10);
  });

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('starBladeXHighScore', score.toString());
    }
  }, [score, highScore]);

  const startGame = useCallback(() => {
    setScore(0);
    setGameState(GameState.Playing);
  }, []);

  const gameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    setGameState(GameState.GameOver);
  }, []);

  const backToMenu = useCallback(() => {
    setGameState(GameState.Start);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return <Game onGameOver={gameOver} setScore={setScore} score={score} highScore={highScore} />;
      case GameState.GameOver:
        return <GameOverScreen score={score} highScore={highScore} onRestart={startGame} onMenu={backToMenu} />;
      case GameState.Start:
      default:
        return <StartScreen onStart={startGame} highScore={highScore} />;
    }
  };

  return (
    <main className="relative w-screen h-screen bg-black text-white overflow-hidden select-none">
      <StarField />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
