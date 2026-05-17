import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const STATUT_CONFIG = {
  actif: { text: 'Actif', class: 'bg-green-900/40 text-green-400 border-green-500/30' },
  en_mission: { text: 'En mission', class: 'bg-blue-900/40 text-blue-400 border-blue-500/30' },
  inactif: { text: 'Inactif', class: 'bg-muted text-muted-foreground border-border' },
  suspendu: { text: 'Suspendu', class: 'bg-red-900/40 text-red-400 border-red-500/30' },
};

const DIVISION_COLORS = {
  FIMU: 'text-amber-400',
  'Nu-7': 'text-blue-400',
  'Epsilon-11': 'text-green-400',
  'Beta-7': 'text-orange-400',
  BSF: 'text-purple-400',
};

export default function MembreCard({ operateur, index = 0 }) {
  const statut = STATUT_CONFIG[operateur.statut] || STATUT_CONFIG.actif;
  const divColor = DIVISION_COLORS[operateur.division] || 'text-accent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="gold-border bg-card p-5 hover:bg-secondary/40 transition-colors flex flex-col items-center text-center gap-3"
    >
      {/* Avatar */}
      <div className="relative">
        {operateur.photo_url ? (
          <img
            src={operateur.photo_url}
            alt={operateur.pseudo_roblox}
            className="w-20 h-20 rounded-full object-cover border-2 border-border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-border bg-secondary flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
          operateur.statut === 'actif' ? 'bg-green-500' :
          operateur.statut === 'en_mission' ? 'bg-blue-500' :
          operateur.statut === 'suspendu' ? 'bg-red-500' :
          'bg-muted-foreground'
        }`} />
      </div>

      {/* Info */}
      <div className="w-full">
        <p className="font-heading text-sm tracking-wider text-foreground">{operateur.pseudo_roblox}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{operateur.grade}</p>
      </div>

      <div className="flex items-center justify-between w-full">
        <span className={`text-[10px] font-heading tracking-wider ${divColor}`}>
          {operateur.division}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded border ${statut.class}`}>
          {statut.text}
        </span>
      </div>

      {operateur.date_entree && (
        <p className="text-[9px] text-muted-foreground/60 w-full">
          Entrée : {new Date(operateur.date_entree).toLocaleDateString('fr-FR')}
        </p>
      )}
    </motion.div>
  );
}