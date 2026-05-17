import React from 'react';
import { motion } from 'framer-motion';

const CORPS_STYLES = {
  etat_major: { border: 'border-accent/50', badge: 'bg-accent/20 text-accent', icon: '🔺' },
  officiers: { border: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-400', icon: '🔹' },
  sous_officiers: { border: 'border-orange-500/40', badge: 'bg-orange-500/20 text-orange-400', icon: '🔸' },
  hommes_du_rang: { border: 'border-foreground/20', badge: 'bg-foreground/10 text-foreground/70', icon: '⬜' },
};

export default function GradeCard({ name, description, corps, index = 0 }) {
  const style = CORPS_STYLES[corps] || CORPS_STYLES.hommes_du_rang;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-start gap-4 p-4 border-l-2 ${style.border} bg-card hover:bg-secondary/30 transition-colors`}
    >
      <div className={`flex-shrink-0 px-2 py-1 rounded text-[10px] font-heading tracking-wider uppercase ${style.badge}`}>
        {style.icon}
      </div>
      <div>
        <h4 className="font-heading text-sm tracking-[0.1em] uppercase text-foreground mb-1">
          {name}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}