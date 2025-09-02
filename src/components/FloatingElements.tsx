import React from 'react';
import { motion } from 'motion/react';

export function FloatingElements() {
  const elements = [
    { emoji: '🌸', x: '10%', y: '20%', delay: 0 },
    { emoji: '🌙', x: '80%', y: '15%', delay: 1 },
    { emoji: '🦋', x: '15%', y: '60%', delay: 2 },
    { emoji: '✨', x: '85%', y: '70%', delay: 0.5 },
    { emoji: '🌺', x: '5%', y: '80%', delay: 1.5 },
    { emoji: '💫', x: '90%', y: '30%', delay: 2.5 },
    { emoji: '🌈', x: '20%', y: '85%', delay: 1.8 },
    { emoji: '🔮', x: '75%', y: '50%', delay: 0.8 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl opacity-20"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
      
      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: ['#FFB6C1', '#DDA0DD', '#87CEEB', '#98FB98'][i % 4],
            opacity: 0.4,
          }}
          animate={{
            y: [-20, -40, -20],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}