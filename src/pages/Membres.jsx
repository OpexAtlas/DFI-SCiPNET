import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import StampBadge from '../components/ui/StampBadge';
import MembreCard from '../components/membres/MembreCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserCheck, Activity } from 'lucide-react';

const STATUT_LABELS = {
  actif: { text: 'Actif', class: 'text-green-400' },
  en_mission: { text: 'En mission', class: 'text-blue-400' },
  inactif: { text: 'Inactif', class: 'text-muted-foreground' },
  suspendu: { text: 'Suspendu', class: 'text-red-400' },
};

export default function Membres() {
  const [filterDivision, setFilterDivision] = useState('tous');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterGrade, setFilterGrade] = useState('tous');

  const { data: operateurs, isLoading } = useQuery({
    queryKey: ['operateurs'],
    queryFn: () => base44.entities.Operateur.list('-created_date'),
    initialData: [],
  });

  const filtered = operateurs.filter(op => {
    if (filterDivision !== 'tous' && op.division !== filterDivision) return false;
    if (filterStatut !== 'tous' && op.statut !== filterStatut) return false;
    if (filterGrade !== 'tous' && op.corps !== filterGrade) return false;
    return true;
  });

  const total = operateurs.length;
  const actifs = operateurs.filter(o => o.statut === 'actif').length;
  const enMission = operateurs.filter(o => o.statut === 'en_mission').length;

  const divCounts = {
    FIMU: operateurs.filter(o => o.division === 'FIMU').length,
    'Nu-7': operateurs.filter(o => o.division === 'Nu-7').length,
    'Epsilon-11': operateurs.filter(o => o.division === 'Epsilon-11').length,
    'Beta-7': operateurs.filter(o => o.division === 'Beta-7').length,
    BSF: operateurs.filter(o => o.division === 'BSF').length,
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionTitle subtitle="Registre complet des opérateurs actifs du Département des Forces d'Intervention.">
          REGISTRE DES OPÉRATEURS
        </SectionTitle>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="gold-border bg-card p-4 text-center">
            <Users className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="font-heading text-2xl text-foreground">{total}</p>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Effectif Total</p>
          </div>
          <div className="gold-border bg-card p-4 text-center">
            <UserCheck className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="font-heading text-2xl text-foreground">{actifs}</p>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Actifs</p>
          </div>
          <div className="gold-border bg-card p-4 text-center">
            <Activity className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="font-heading text-2xl text-foreground">{enMission}</p>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">En Mission</p>
          </div>
          <div className="gold-border bg-card p-4">
            <p className="text-[9px] text-muted-foreground tracking-wider uppercase mb-1.5">Par Division</p>
            <div className="space-y-0.5">
              {Object.entries(divCounts).map(([d, c]) => (
                <div key={d} className="flex justify-between text-[10px]">
                  <span className="text-accent font-heading">{d}</span>
                  <span className="text-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 gold-border bg-card">
          <Select value={filterDivision} onValueChange={setFilterDivision}>
            <SelectTrigger className="w-44 bg-secondary border-border text-xs">
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes les divisions</SelectItem>
              <SelectItem value="FIMU">FIMU</SelectItem>
              <SelectItem value="Nu-7">Nu-7</SelectItem>
              <SelectItem value="Epsilon-11">Epsilon-11</SelectItem>
              <SelectItem value="Beta-7">Bêta-7</SelectItem>
              <SelectItem value="BSF">BSF</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-44 bg-secondary border-border text-xs">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="en_mission">En mission</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
              <SelectItem value="suspendu">Suspendu</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterGrade} onValueChange={setFilterGrade}>
            <SelectTrigger className="w-44 bg-secondary border-border text-xs">
              <SelectValue placeholder="Corps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les corps</SelectItem>
              <SelectItem value="etat_major">État-Major</SelectItem>
              <SelectItem value="officiers">Officiers</SelectItem>
              <SelectItem value="sous_officiers">Sous-Officiers</SelectItem>
              <SelectItem value="hommes_du_rang">Hommes du Rang</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center">
            <span className="text-xs text-muted-foreground font-mono">
              {filtered.length} opérateur{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Chargement du registre...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <StampBadge variant="muted">AUCUN OPÉRATEUR TROUVÉ</StampBadge>
            <p className="text-sm text-muted-foreground mt-4">Aucun opérateur ne correspond aux filtres sélectionnés.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((op, i) => (
              <MembreCard key={op.id} operateur={op} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}