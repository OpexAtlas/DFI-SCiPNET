import React from 'react';

const VARIANTS = {
  red: 'text-primary border-primary/60',
  gold: 'text-accent border-accent/60',
  muted: 'text-muted-foreground border-muted-foreground/40',
};

export default function StampBadge({ children, variant = 'red', className = '' }) {
  return (
    <span className={`stamp text-[10px] ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
}