import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import StampBadge from '../components/ui/StampBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NIVEAU_CONFIG = {
  bas: { label: '🟢 Bas', class: 'bg-green-900/40 text-green-400 border-green-500/30' },
  modere: { label: '🟡 Modéré', class: 'bg-yellow-900/40 text-yellow-400 border-yellow-500/30' },
  eleve: { label: '🟠 Élevé', class: 'bg-orange-900/40 text-orange-400 border-orange-500/30' },
  critique: { label: '🔴 Critique', class: 'bg-red-900/40 text-red-400 border-red-500/30' },
};

const STATUT_CONFIG = {
  en_cours: { label: 'En cours', icon: Clock, class: 'text-orange-400' },
  resolue: { label: 'Résolue', icon: CheckCircle, class: 'text-green-400' },
  annulee: { label: 'Annulée', icon: XCircle, class: 'text-muted-foreground' },
};

export default function HistoriqueAlertes() {
  const [authed] = useState(sessionStorage.getItem('dfi_auth') === 'true');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterNiveau, setFilterNiveau] = useState('tous');
  const queryClient = useQueryClient();

  const { data: alertes, isLoading } = useQuery({
    queryKey: ['alertes'],
    queryFn: () => base44.entities.Alerte.list('-created_date', 100),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, statut }) => base44.entities.Alerte.update(id, { statut }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertes'] });
      queryClient.invalidateQueries({ queryKey: ['alertes_actives'] });
    },
  });

  const filtered = alertes.filter(a => {
    if (filterStatut !== 'tous' && a.statut !== filterStatut) return false;
    if (filterNiveau !== 'tous' && a.niveau_menace !== filterNiveau) return false;
    return true;
  });

  // Sort: critiques en cours en tête
  const sorted = [...filtered].sort((a, b) => {
    const aCritique = a.niveau_menace === 'critique' && a.statut === 'en_cours';
    const bCritique = b.niveau_menace === 'critique' && b.statut === 'en_cours';
    if (aCritique && !bCritique) return -1;
    if (!aCritique && bCritique) return 1;
    return new Date(b.created_date) - new Date(a.created_date);
  });

  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle="Registre de toutes les alertes FIM déclenchées, avec suivi du statut opérationnel.">
          HISTORIQUE DES ALERTES
        </SectionTitle>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 gold-border bg-card">
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-40 bg-secondary border-border text-xs">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="resolue">Résolue</SelectItem>
              <SelectItem value="annulee">Annulée</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterNiveau} onValueChange={setFilterNiveau}>
            <SelectTrigger className="w-40 bg-secondary border-border text-xs">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous niveaux</SelectItem>
              <SelectItem value="bas">🟢 Bas</SelectItem>
              <SelectItem value="modere">🟡 Modéré</SelectItem>
              <SelectItem value="eleve">🟠 Élevé</SelectItem>
              <SelectItem value="critique">🔴 Critique</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center">
            <span className="text-xs text-muted-foreground font-mono">{filtered.length} alerte{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Chargement...</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <StampBadge variant="muted">AUCUNE ALERTE</StampBadge>
            <p className="text-sm text-muted-foreground mt-4">Aucune alerte enregistrée.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((alerte, i) => {
              const niv = NIVEAU_CONFIG[alerte.niveau_menace] || NIVEAU_CONFIG.bas;
              const stat = STATUT_CONFIG[alerte.statut] || STATUT_CONFIG.en_cours;
              const StatIcon = stat.icon;
              const isCritique = alerte.niveau_menace === 'critique' && alerte.statut === 'en_cours';

              return (
                <motion.div
                  key={alerte.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`p-4 border transition-colors ${
                    isCritique
                      ? 'border-red-500/50 bg-red-900/10'
                      : 'border-border bg-card hover:bg-secondary/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {isCritique && (
                          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          </motion.div>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-heading tracking-wider ${niv.class}`}>
                          {niv.label}
                        </span>
                        <span className="font-heading text-xs tracking-wider text-foreground">{alerte.nature}</span>
                        <span className="text-xs text-muted-foreground">—</span>
                        <span className="text-xs text-accent font-mono">{alerte.localisation}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-muted-foreground mb-2">
                        <span>Division : <span className="text-foreground">{alerte.division_ciblee}</span></span>
                        <span>Demandeur : <span className="text-foreground">{alerte.demandeur_nom}</span>
                          {alerte.demandeur_grade && ` (${alerte.demandeur_grade})`}
                        </span>
                        <span className="text-[10px] font-mono">
                          {alerte.created_date && new Date(alerte.created_date).toLocaleString('fr-FR')}
                        </span>
                      </div>

                      {alerte.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{alerte.description}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className={`flex items-center gap-1 text-[11px] ${stat.class}`}>
                        <StatIcon className="w-3 h-3" />
                        {stat.label}
                      </div>

                      {authed && alerte.statut === 'en_cours' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMutation.mutate({ id: alerte.id, statut: 'resolue' })}
                            className="text-[10px] font-heading tracking-wider uppercase border-green-500/30 text-green-400 hover:bg-green-900/20 h-7 px-2"
                          >
                            Résolue
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMutation.mutate({ id: alerte.id, statut: 'annulee' })}
                            className="text-[10px] font-heading tracking-wider uppercase border-muted text-muted-foreground h-7 px-2"
                          >
                            Annuler
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}