import React from 'react';
import { Users, Swords, Shield, AlertTriangle } from 'lucide-react';

export default function StatsOverview({ members }) {
  const total = members?.length || 0;

  const byCorp = {
    etat_major: members?.filter(m => m.corps === 'etat_major').length || 0,
    officiers: members?.filter(m => m.corps === 'officiers').length || 0,
    sous_officiers: members?.filter(m => m.corps === 'sous_officiers').length || 0,
    hommes_du_rang: members?.filter(m => m.corps === 'hommes_du_rang').length || 0,
  };

  const byDiv = {
    FIMU: members?.filter(m => m.division === 'FIMU').length || 0,
    'Nu-7': members?.filter(m => m.division === 'Nu-7').length || 0,
    'Epsilon-11': members?.filter(m => m.division === 'Epsilon-11').length || 0,
    'Beta-7': members?.filter(m => m.division === 'Beta-7').length || 0,
    BSF: members?.filter(m => m.division === 'BSF').length || 0,
  };

  const stats = [
    { label: 'Effectif total', value: total, icon: Users },
    { label: 'État-Major', value: byCorp.etat_major, icon: Shield },
    { label: 'Actifs en mission', value: members?.filter(m => m.statut === 'en_mission').length || 0, icon: Swords },
    { label: 'Suspendus', value: members?.filter(m => m.statut === 'suspendu').length || 0, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="gold-border bg-card p-4 text-center">
            <s.icon className="w-4 h-4 text-accent mx-auto mb-2" />
            <p className="font-heading text-xl text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* By division */}
      <div className="gold-border bg-card p-4">
        <h4 className="font-heading text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
          EFFECTIFS PAR DIVISION
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.entries(byDiv).map(([div, count]) => (
            <div key={div} className="text-center py-2 bg-secondary/50 rounded">
              <p className="font-heading text-xs tracking-wider text-accent">{div}</p>
              <p className="text-lg font-heading text-foreground">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}