import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import StampBadge from '../ui/StampBadge';
import { Megaphone, Star, ArrowUp, Radio } from 'lucide-react';

const TYPE_ICONS = {
  ordre_du_jour: Star,
  promotion: ArrowUp,
  operation: Radio,
  annonce_generale: Megaphone,
};

const TYPE_LABELS = {
  ordre_du_jour: 'Ordre du jour',
  promotion: 'Promotion',
  operation: 'Opération',
  annonce_generale: 'Annonce',
};

export default function AnnoncesFeed({ annonces }) {
  if (!annonces?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Aucune annonce récente.
      </div>
    );
  }

  // Sort: priority first, then by date
  const sorted = [...annonces].sort((a, b) => {
    if (a.priorite && !b.priorite) return -1;
    if (!a.priorite && b.priorite) return 1;
    return new Date(b.created_date) - new Date(a.created_date);
  });

  return (
    <div className="space-y-3">
      {sorted.map((a) => {
        const Icon = TYPE_ICONS[a.type] || Megaphone;
        return (
          <div
            key={a.id}
            className={`p-4 border transition-colors ${
              a.priorite
                ? 'gold-border bg-accent/5'
                : 'border-border bg-card hover:bg-secondary/30'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${a.priorite ? 'text-accent' : 'text-muted-foreground'}`} />
                <h4 className={`font-heading text-xs tracking-wider uppercase ${a.priorite ? 'text-accent' : 'text-foreground'}`}>
                  {a.titre}
                </h4>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {a.priorite && <StampBadge variant="gold">PRIORITAIRE</StampBadge>}
                <span className="text-[10px] text-muted-foreground font-mono">
                  {TYPE_LABELS[a.type]}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{a.contenu}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-muted-foreground/60">
                {a.auteur && `Par ${a.auteur} — `}
                {a.created_date && format(new Date(a.created_date), 'dd MMM yyyy à HH:mm', { locale: fr })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}