import React from 'react';
import { Shield, Crosshair, Bug, Eye, Swords } from 'lucide-react';
import { motion } from 'framer-motion';

const ICONS = {
  FIMU: Swords,
  'Nu-7': Crosshair,
  'Epsilon-11': Shield,
  'Beta-7': Bug,
  BSF: Eye,
};

export default function DivisionCard({ id, name, subtitle, description, index = 0 }) {
  const Icon = ICONS[id] || Shield;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="gold-border bg-card p-6 hover:bg-secondary/50 transition-colors group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-accent/40 bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-sm tracking-[0.15em] uppercase text-accent mb-1">
            {name}
          </h3>
          {subtitle && (
            <p className="text-xs text-primary/80 font-heading tracking-wider mb-2">
              {subtitle}
            </p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}