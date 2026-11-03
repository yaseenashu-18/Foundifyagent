import React, { useEffect, useState } from 'react';

interface AudioWaveformProps {
  isActive?: boolean;
  colorScheme?: 'sapphire' | 'emerald' | 'amber';
  barCount?: number;
  height?: number; // max bar height in px
  className?: string;
  intensity?: number; // 0 to 1
  isMuted?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive = false,
  colorScheme = 'emerald',
  barCount = 36,
  height = 36,
  className = '',
  intensity = 1,
  isMuted = false,
}) => {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 0.15)
  );

  useEffect(() => {
    if (!isActive || isMuted) {
      // Resting waveform state
      setBars(Array.from({ length: barCount }, (_, i) => {
        const center = barCount / 2;
        const dist = Math.abs(i - center) / center;
        return Math.max(0.08, 0.22 - dist * 0.12);
      }));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev =>
        prev.map((_, i) => {
          const center = barCount / 2;
          const distFactor = 1 - Math.abs(i - center) / center * 0.5;
          const randomFactor = Math.random() * 0.7 + 0.3;
          const timeFactor = Math.sin(Date.now() / 150 + i * 0.4) * 0.35 + 0.45;
          const target = Math.min(1, Math.max(0.12, (randomFactor * 0.6 + timeFactor * 0.4) * distFactor * intensity));
          return target;
        })
      );
    }, 60);

    return () => clearInterval(interval);
  }, [isActive, barCount, intensity, isMuted]);

  const getBarColor = (val: number) => {
    if (!isActive || isMuted) return '#CBD5E1';
    if (colorScheme === 'emerald') {
      return val > 0.6 ? '#10B981' : '#059669';
    }
    if (colorScheme === 'sapphire') {
      return val > 0.6 ? '#2563EB' : '#3B82F6';
    }
    return '#F59E0B';
  };

  return (
    <div
      className={`relative flex items-center justify-center gap-[2px] h-[${height}px] select-none ${className}`}
      style={{
        height: `${height}px`,
        boxShadow: isActive && !isMuted ? '0 0 16px -2px rgba(16, 185, 129, 0.25)' : 'none',
      }}
    >
      {bars.map((bar, index) => {
        const barHeight = Math.max(4, Math.round(bar * height));
        return (
          <div
            key={index}
            className="w-[3px] rounded-full transition-all duration-75 ease-out"
            style={{
              height: `${barHeight}px`,
              backgroundColor: getBarColor(bar),
            }}
          />
        );
      })}
    </div>
  );
};
