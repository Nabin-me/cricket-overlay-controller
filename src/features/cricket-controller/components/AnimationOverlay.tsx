import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useMatchState } from '../useMatchState';

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  shape: 'circle' | 'square';
}

export function AnimationOverlay() {
  const { state } = useMatchState();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'four' | 'six' | 'wicket' | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (state.lastEvent) {
      setAnimationType(state.lastEvent);
      setShowAnimation(true);

      // Generate particles
      const particleCount = state.lastEvent === 'six' ? 28 : state.lastEvent === 'wicket' ? 28 : 20;
      const minDistance = state.lastEvent === 'six' ? 200 : state.lastEvent === 'wicket' ? 150 : 150;
      const maxDistance = state.lastEvent === 'six' ? 400 : state.lastEvent === 'wicket' ? 320 : 320;

      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        angle: Math.random() * 360,
        distance: minDistance + Math.random() * (maxDistance - minDistance),
        size: 4 + Math.random() * 8,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
      }));

      setParticles(newParticles);

      // Trigger shake for wickets
      if (state.lastEvent === 'wicket') {
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }

      // Hide animation after duration
      const hideDelay = state.lastEvent === 'wicket' ? 1100 : 900;
      setTimeout(() => {
        setShowAnimation(false);
        setParticles([]);
        setAnimationType(null);
      }, hideDelay + 400);
    }
  }, [state.lastEvent, state.score]);

  const getAnimationConfig = () => {
    switch (animationType) {
      case 'four':
        return {
          text: 'FOUR!',
          color: '#22c55e',
          scale: 1,
          flashColor: 'rgba(34, 197, 94, 0.15)',
        };
      case 'six':
        return {
          text: 'SIX!',
          color: '#3b82f6',
          scale: 1.15,
          flashColor: 'rgba(59, 130, 246, 0.2)',
        };
      case 'wicket':
        return {
          text: 'OUT!',
          color: '#ef4444',
          scale: 1,
          flashColor: 'rgba(239, 68, 68, 0.25)',
        };
      default:
        return null;
    }
  };

  const config = getAnimationConfig();

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background flash */}
      <AnimatePresence>
        {showAnimation && config && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: config.flashColor }}
            className="absolute inset-0"
          />
        )}
      </AnimatePresence>

      {/* Particles */}
      <AnimatePresence>
        {showAnimation && particles.map((particle) => {
          const radian = (particle.angle * Math.PI) / 180;
          const x = Math.cos(radian) * particle.distance;
          const y = Math.sin(radian) * particle.distance;

          const color = animationType === 'four' ? '#22c55e' : animationType === 'six' ? '#3b82f6' : '#ef4444';

          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
              animate={{ opacity: 0, x, y, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: color,
                borderRadius: particle.shape === 'circle' ? '50%' : '4px',
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Main text animation */}
      <AnimatePresence>
        {showAnimation && config && (
          <motion.div
            key="text"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: config.scale }}
            exit={{ opacity: 0, scale: config.scale * 1.2 }}
            transition={{
              entry: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
              exit: { duration: 0.4, ease: 'easeIn' },
            }}
            className="relative z-10"
            style={{ color: config.color }}
          >
            <span
              className="font-black"
              style={{
                fontFamily: 'Alumni Sans, sans-serif',
                fontSize: '180px',
                letterSpacing: '-2px',
                textShadow: `0 4px 30px ${config.color}40, 0 8px 60px ${config.color}30`,
              }}
            >
              {config.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shake effect for wickets */}
      <motion.div
        animate={
          shake
            ? {
                x: [0, 8, -8, 8, -8, 8, -8, 8, -8, 0],
              }
            : { x: 0 }
        }
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      />
    </div>
  );
}
