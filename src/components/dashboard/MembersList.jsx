import React from 'react';
import { Badge } from '@/components/ui/badge';

const STATUS_LABELS = {
  actif: { text: 'Actif', class: 'bg-green-900/40 text-green-400 border-green-500/30' },
  en_mission: { text: 'En mission', class: 'bg-blue-900/40 text-blue-400 border-blue-500/30' },
  inactif: { text: 'Inactif', class: 'bg-muted text-muted-foreground border-border' },
  suspendu: { text: 'Suspendu', class: 'bg-red-900/40 text-red-400 border-red-500/30' },
};

const DIVISION_LABELS = {
  FIMU: 'FIMU',
  'Nu-7': 'Nu-7',
  'Epsilon-11': 'Ε-11',
  'Beta-7': 'Β-7',
  BSF: 'BSF',
};

export default function MembersList({ members }) {
  if (!members?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Aucun membre enregistré.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-3 font-heading text-[10px] tracking-wider uppercase text-muted-foreground">Pseudo</th>
            <th className="text-left py-3 px-3 font-heading text-[10px] tracking-wider uppercase text-muted-foreground">Grade</th>
            <th className="text-left py-3 px-3 font-heading text-[10px] tracking-wider uppercase text-muted-foreground">Division</th>
            <th className="text-left py-3 px-3 font-heading text-[10px] tracking-wider uppercase text-muted-foreground">Statut</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const status = STATUS_LABELS[m.statut] || STATUS_LABELS.actif;
            return (
              <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-3 font-medium text-foreground">{m.pseudo_roblox}</td>
                <td className="py-3 px-3 text-muted-foreground">{m.grade}</td>
                <td className="py-3 px-3">
                  <span className="text-xs font-heading tracking-wider text-accent">
                    {DIVISION_LABELS[m.division] || m.division}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <Badge variant="outline" className={`text-[10px] ${status.class}`}>
                    {status.text}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}