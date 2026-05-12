import React from 'react';
import { cn } from '@/src/lib/utils';

interface GlowEffectProps {
  className?: string;
  color?: string;
  blur?: string;
  opacity?: string;
}

export default function GlowEffect({ 
  className, 
  color = "bg-indigo-500", 
  blur = "blur-[100px]", 
  opacity = "opacity-20" 
}: GlowEffectProps) {
  return (
    <div 
      className={cn(
        "absolute rounded-full -z-10 pointer-events-none",
        color,
        blur,
        opacity,
        className
      )}
    />
  );
}
