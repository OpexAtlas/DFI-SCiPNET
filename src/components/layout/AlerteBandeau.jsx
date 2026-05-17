import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useDFIAuth } from '@/lib/DFIAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, X, CheckCircle, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const NIVEAU_CONFIG = {
  bas: { label: 'BAS', color: 'text-green-400', bg: 'bg-green-900/30' },
  modere: { label: 'MODÉRÉ', color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
  eleve: { label: 'ÉLEVÉ', color: 'text-orange-400', bg: 'bg-orange-900/30' },
  critique: { label: 'CRITIQUE', color: 'text-red-300', bg: 'bg-red-900/40' },
};

function AlerteItem({ alerte, compte, onAction }) {
  const niv = NIVEAU_CONFIG[alerte.niveau_menace] || NIVEAU_CONFIG.bas;
  const elapsed = alerte.created_date
    ? formatDistanceToNow(new Date(alerte.created_date), { locale: fr, addSuffix: false })
    : '';

  const isOwnAlerte = compte && alerte.demandeur_nom === compte.pseudo;
  const canCancel = compte && (isOwnAlerte || (compte.niveau_permission >= 3));
  const canClose = compte && compte.niveau_permission >= 3;

  return (
    <div className={`flex items-center gap-3 px-4 py-2 text-xs flex-wrap ${niv.bg}`}>
      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
        <AlertTriangle className={`w-4 h-4 ${niv.color} flex-shrink-0`} />
      </motion.div>
      <span className={`font-heading tracking-[0.15em] uppercase font-bold ${niv.color}`}>
        🚨 ALERTE FIM — {alerte.division_ciblee}
      </span>
      <span className="text-red-200/80">|</span>
      <span className={`font-heading text-[10px] tracking-wider uppercase ${niv.color}`}>
        {niv.label}
      </span>
      <span className="text-red-200/80">|</span>
      <span className="text-red-100/90">{alerte.localisation}</span>
      <span className="text-red-200/80">|</span>
      <span className="text-red-100/90">{alerte.nature}</span>
      <span className="text-red-200/60 font-mono text-[10px]">+{elapsed}</span>
      <div className="flex items-center gap-2 ml-auto">
        {canCancel && (
          <button
            onClick={() => onAction(alerte.id, 'annulee')}
            className="text-[10px] font-heading tracking-wider uppercase border border-red-400/40 px-2 py-1 text-red-300 hover:bg-red-900/40 transition-colors"
          >
            <X className="w-3 h-3 inline mr-1" />
            Annuler
          </button>
        )}
        {canClose && (
          <button
            onClick={() => onAction(alerte.id, 'resolue')}
            className="text-[10px] font-heading tracking-wider uppercase border border-green-400/40 px-2 py-1 text-green-300 hover:bg-green-900/40 transition-colors"
          >
            <CheckCircle className="w-3 h-3 inline mr-1" />
            Mission accomplie
          </button>
        )}
      </div>
    </div>
  );
}

export default function AlerteBandeau() {
  const { compte } = useDFIAuth();
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { data: alertes } = useQuery({
    queryKey: ['alertes_actives'],
    queryFn: () => base44.entities.Alerte.filter({ statut: 'en_cours' }, '-created_date'),
    initialData: [],
    refetchInterval: 15000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, statut }) => base44.entities.Alerte.update(id, { statut }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertes_actives'] });
      queryClient.invalidateQueries({ queryKey: ['alertes'] });
    },
  });

  if (!alertes?.length) return null;

  // Sort: critiques en tête
  const sorted = [...alertes].sort((a, b) => {
    const order = { critique: 0, eleve: 1, modere: 2, bas: 3 };
    return (order[a.niveau_menace] ?? 4) - (order[b.niveau_menace] ?? 4);
  });

  const handleAction = (id, statut) => updateMutation.mutate({ id, statut });

  if (sorted.length === 1) {
    return (
      <div className="bg-red-950/80 border-b-2 border-red-600/70 z-40">
        <AlerteItem alerte={sorted[0]} compte={compte} onAction={handleAction} />
      </div>
    );
  }

  return (
    <div className="bg-red-950/80 border-b-2 border-red-600/70 z-40">
      {/* Header multi-alertes */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-2 text-xs"
      >
        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
        </motion.div>
        <span className="font-heading tracking-[0.15em] uppercase text-red-300 font-bold">
          🚨 {sorted.length} ALERTES FIM ACTIVES
        </span>
        <span className="ml-auto text-red-300/70">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden divide-y divide-red-600/20"
          >
            {sorted.map(a => (
              <AlerteItem key={a.id} alerte={a} compte={compte} onAction={handleAction} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}