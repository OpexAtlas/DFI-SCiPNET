import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radio, CheckCircle } from 'lucide-react';

const NIVEAUX = [
  { value: 'bas', label: '🟢 BAS', desc: 'Situation contrôlée', alertClass: 'border-green-500/50 bg-green-900/20 text-green-400' },
  { value: 'modere', label: '🟡 MODÉRÉ', desc: 'Surveillance accrue', alertClass: 'border-yellow-500/50 bg-yellow-900/20 text-yellow-400' },
  { value: 'eleve', label: '🟠 ÉLEVÉ', desc: 'Déploiement recommandé', alertClass: 'border-orange-500/50 bg-orange-900/20 text-orange-400' },
  { value: 'critique', label: '🔴 CRITIQUE', desc: 'Intervention immédiate', alertClass: 'border-red-500/50 bg-red-900/20 text-red-400' },
];

const NATURES = [
  'Brèche de confinement',
  'Menace armée',
  'Évacuation',
  'Inspection',
  'Autre',
];

const DIVISIONS = [
  'FIMU',
  'Nu-7 "Coup de Marteau"',
  'Epsilon-11 "Renard à Neuf Queues"',
  'Bêta-7',
  'BSF',
  'Toutes les divisions',
];

// Map display to enum
const DIV_MAP = {
  'FIMU': 'FIMU',
  'Nu-7 "Coup de Marteau"': 'Nu-7',
  'Epsilon-11 "Renard à Neuf Queues"': 'Epsilon-11',
  'Bêta-7': 'Beta-7',
  'BSF': 'BSF',
  'Toutes les divisions': 'Toutes les divisions',
};

export default function AppelFIM() {
  const [submitted, setSubmitted] = useState(false);
  const [lastAlerte, setLastAlerte] = useState(null);
  const [form, setForm] = useState({
    demandeur_nom: '',
    demandeur_grade: '',
    division_ciblee: '',
    nature: '',
    localisation: '',
    niveau_menace: '',
    description: '',
  });

  const queryClient = useQueryClient();

  // Fetch active critical alerts for banner
  const { data: alertes } = useQuery({
    queryKey: ['alertes_actives'],
    queryFn: () => base44.entities.Alerte.filter({ statut: 'en_cours' }, '-created_date', 5),
    initialData: [],
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Alerte.create(data),
    onSuccess: (alerte) => {
      setLastAlerte(alerte);
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['alertes_actives'] });
      queryClient.invalidateQueries({ queryKey: ['alertes'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      division_ciblee: DIV_MAP[form.division_ciblee] || form.division_ciblee,
      statut: 'en_cours',
    });
  };

  const critiques = alertes.filter(a => a.niveau_menace === 'critique');
  const selectedNiveau = NIVEAUX.find(n => n.value === form.niveau_menace);

  return (
    <div className="min-h-screen bg-background">
      {/* Active critical banners */}
      <AnimatePresence>
        {critiques.map((a) => (
          <motion.div
            key={a.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-900/80 border-b-2 border-red-500 overflow-hidden"
          >
            <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </motion.div>
              <span className="font-heading text-xs tracking-[0.2em] uppercase text-red-200">
                🔴 ALERTE CRITIQUE — {a.localisation} — {a.nature}
              </span>
              <span className="ml-auto text-[10px] text-red-300 font-mono">
                {a.division_ciblee} / EN COURS
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block mb-4"
            >
              <Radio className="w-12 h-12 text-primary mx-auto" />
            </motion.div>
            <h1 className="font-heading text-2xl md:text-3xl tracking-[0.25em] uppercase text-foreground mb-2">
              APPEL À LA FIM
            </h1>
            <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-4">
              Déclenchement d'alerte opérationnelle — Réservé aux personnels autorisés
            </p>
            <div className="inline-block border-2 border-primary/60 bg-primary/10 px-4 py-1.5">
              <span className="font-heading text-[10px] tracking-[0.25em] uppercase text-primary">
                ⚠ PROTOCOLE D'URGENCE ACTIF
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {submitted && lastAlerte ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-2 border-red-500/50 bg-red-900/20 p-8 text-center"
              >
                <CheckCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="font-heading text-lg tracking-[0.15em] uppercase text-red-300 mb-3">
                  ALERTE DÉCLENCHÉE
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  L'alerte a été transmise aux unités concernées.
                </p>
                <div className="mt-4 p-4 bg-secondary/50 text-left space-y-1 text-xs font-mono">
                  <p className="text-accent">DIVISION : {lastAlerte.division_ciblee}</p>
                  <p className="text-accent">NATURE : {lastAlerte.nature}</p>
                  <p className="text-accent">LOCALISATION : {lastAlerte.localisation}</p>
                  <p className={`font-bold ${
                    lastAlerte.niveau_menace === 'critique' ? 'text-red-400' :
                    lastAlerte.niveau_menace === 'eleve' ? 'text-orange-400' :
                    lastAlerte.niveau_menace === 'modere' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    NIVEAU : {lastAlerte.niveau_menace?.toUpperCase()}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setLastAlerte(null);
                    setForm({ demandeur_nom: '', demandeur_grade: '', division_ciblee: '', nature: '', localisation: '', niveau_menace: '', description: '' });
                  }}
                  variant="outline"
                  className="mt-6 font-heading text-xs tracking-wider uppercase border-red-500/50 text-red-300 hover:bg-red-900/20"
                >
                  Nouvelle alerte
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-5 border border-primary/30 bg-card p-6 md:p-8"
              >
                {/* Niveau de menace — select first for emphasis */}
                <div className="space-y-2">
                  <Label className="font-heading text-[10px] tracking-[0.2em] uppercase text-foreground/80">
                    ⚠ Niveau de menace *
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {NIVEAUX.map(n => (
                      <button
                        key={n.value}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, niveau_menace: n.value }))}
                        className={`p-3 border text-center transition-all ${
                          form.niveau_menace === n.value
                            ? n.alertClass + ' border-current'
                            : 'border-border bg-secondary hover:bg-secondary/80 text-muted-foreground'
                        }`}
                      >
                        <p className="font-heading text-[10px] tracking-wider">{n.label}</p>
                        <p className="text-[9px] mt-0.5 opacity-70">{n.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Demandeur */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Nom du demandeur *</Label>
                    <Input
                      required
                      value={form.demandeur_nom}
                      onChange={e => setForm(p => ({ ...p, demandeur_nom: e.target.value }))}
                      className="bg-secondary border-border"
                      placeholder="Pseudo Roblox"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Grade</Label>
                    <Input
                      value={form.demandeur_grade}
                      onChange={e => setForm(p => ({ ...p, demandeur_grade: e.target.value }))}
                      className="bg-secondary border-border"
                      placeholder="Ex: Lieutenant"
                    />
                  </div>
                </div>

                {/* Division + Nature */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Division sollicitée *</Label>
                    <Select value={form.division_ciblee} onValueChange={v => setForm(p => ({ ...p, division_ciblee: v }))}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIVISIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Nature de l'intervention *</Label>
                    <Select value={form.nature} onValueChange={v => setForm(p => ({ ...p, nature: v }))}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {NATURES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Localisation */}
                <div className="space-y-2">
                  <Label className="font-heading text-[10px] tracking-wider uppercase">Localisation *</Label>
                  <Input
                    required
                    value={form.localisation}
                    onChange={e => setForm(p => ({ ...p, localisation: e.target.value }))}
                    className="bg-secondary border-border"
                    placeholder="Zone / Secteur / Numéro de salle"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="font-heading text-[10px] tracking-wider uppercase">Description de la situation</Label>
                  <Textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="bg-secondary border-border min-h-[100px]"
                    placeholder="Décrivez la situation en détail..."
                  />
                </div>

                {/* Preview badge */}
                {selectedNiveau && (
                  <div className={`p-3 border text-center text-xs font-heading tracking-wider ${selectedNiveau.alertClass}`}>
                    ALERTE NIVEAU {selectedNiveau.label} — {form.localisation || '…'} — {form.nature || '…'}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    !form.demandeur_nom || !form.division_ciblee ||
                    !form.nature || !form.localisation || !form.niveau_menace
                  }
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-heading tracking-[0.2em] uppercase py-6 text-sm border border-primary/50"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {createMutation.isPending ? 'TRANSMISSION EN COURS...' : 'DÉCLENCHER L\'ALERTE'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}