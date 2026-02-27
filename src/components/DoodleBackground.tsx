/**
 * @module DoodleBackground
 * @description Decorative SVG background component rendered behind page content.
 * Uses subtle hand-drawn doodle patterns (hearts, leaves, circles, stars) in
 * muted green tones for visual texture without distracting from main content.
 */
import React from 'react';

export const DoodleBackground: React.FC = () => {
  // Fixed positions and animations to prevent re-renders messing up the animation state
  const floatingElements = [
    {
      top: '10%',
      left: '5%',
      emoji: '🍎',
      size: 'text-4xl',
      anim: 'animate-float-slow',
      delay: '0s',
    },
    {
      top: '25%',
      left: '85%',
      emoji: '🥕',
      size: 'text-5xl',
      anim: 'animate-float-medium',
      delay: '2s',
    },
    {
      top: '40%',
      left: '15%',
      emoji: '🥖',
      size: 'text-3xl',
      anim: 'animate-float-fast',
      delay: '1s',
    },
    {
      top: '60%',
      left: '80%',
      emoji: '🥦',
      size: 'text-4xl',
      anim: 'animate-float-slow',
      delay: '3s',
    },
    {
      top: '80%',
      left: '10%',
      emoji: '🍌',
      size: 'text-5xl',
      anim: 'animate-float-medium',
      delay: '0.5s',
    },
    {
      top: '15%',
      left: '45%',
      emoji: '🍇',
      size: 'text-3xl',
      anim: 'animate-float-fast',
      delay: '4s',
    },
    {
      top: '75%',
      left: '45%',
      emoji: '🥪',
      size: 'text-4xl',
      anim: 'animate-float-slow',
      delay: '2s',
    },
    {
      top: '35%',
      left: '30%',
      emoji: '🍓',
      size: 'text-5xl',
      anim: 'animate-float-medium',
      delay: '1.5s',
    },
    {
      top: '50%',
      left: '60%',
      emoji: '🥑',
      size: 'text-4xl',
      anim: 'animate-float-fast',
      delay: '3.5s',
    },
    {
      top: '85%',
      left: '75%',
      emoji: '🍕',
      size: 'text-3xl',
      anim: 'animate-float-slow',
      delay: '1s',
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.10]">
      {floatingElements.map((el, i) => (
        <div
          key={i}
          className={`absolute ${el.size} ${el.anim}`}
          style={{ top: el.top, left: el.left, animationDelay: el.delay }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  );
};
