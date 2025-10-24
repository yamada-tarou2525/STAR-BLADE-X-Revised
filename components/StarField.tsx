
import React, { useState, useEffect, useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

const createStar = (): Star => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  size: Math.random() * 2 + 1,
  speed: Math.random() * 0.5 + 0.1,
});

export const StarField: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const initialStars = Array.from({ length: 200 }, createStar);
    setStars(initialStars);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateStars = () => {
      setStars(prevStars =>
        prevStars.map(star => {
          let newY = star.y + star.speed;
          if (newY > window.innerHeight) {
            return { ...createStar(), y: -star.size };
          }
          return { ...star, y: newY };
        })
      );
      animationFrameId = requestAnimationFrame(updateStars);
    };

    animationFrameId = requestAnimationFrame(updateStars);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  
  const starElements = useMemo(() => {
    return stars.map((star, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full"
        style={{
          left: `${star.x}px`,
          top: `${star.y}px`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: (star.size / 3) * 0.8,
        }}
      />
    ));
  }, [stars]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {starElements}
    </div>
  );
};
