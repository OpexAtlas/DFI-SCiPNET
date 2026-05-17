import React from 'react';

export default function SectionTitle({ children, subtitle, className = '' }) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="font-heading text-2xl md:text-3xl tracking-[0.2em] uppercase text-accent mb-3">
        {children}
      </h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/40" />
        <div className="w-1.5 h-1.5 bg-accent/60 rotate-45" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/40" />
      </div>
    </div>
  );
}