import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import SectionTitle from '../components/ui/SectionTitle';
import StampBadge from '../components/ui/StampBadge';
import { Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DIVISIONS = [
  { value: 'FIMU', label: 'Forces d\'Intervention Mobile Universel (FIMU)' },
  { value: 'Nu-7', label: 'FIM Armée Nu-7 « Coup de Marteau »' },
  { value: 'Epsilon-11', label: 'FIM Epsilon-11 « Renard à Neuf Queues »' },
  { value: 'Beta-7', label: 'FIM Bêta-7' },
  { value: 'BSF', label: 'Bureau de Sécurité des Forces (BSF)' },
];

const STATUS_CONFIG = {
  ouvert: { text: 'RECRUTEMENT OUVERT', class: 'bg-green-900/40 border-green-500/50 text-green-400' },
  suspendu: { text: 'RECRUTEMENT SUSPENDU', class: 'bg-orange-900/40 border-orange-500/50 text-orange-400' },
  ferme: { text: 'RECRUTEMENT FERMÉ', class: 'bg-red-900/40 border-red-500/50 text-red-400' },
};

export default function Recrutement() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    pseudo_roblox: '',
    division: '',
    grade_actuel: '',
    experience: '',
    motivation: '',
    disponibilite: '',
  });

  const queryClient = useQueryClient();

  const { data: configs } = useQuery({
    queryKey: ['config_recrutement'],
    queryFn: () => base44.entities.ConfigRecrutement.list(),
    initialData: [],
  });

  const statut = configs?.[0]?.statut || 'ouvert';
  const statusCfg = STATUS_CONFIG[statut];

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Candidature.create(data),
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['candidatures'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ ...form, statut: 'en_attente' });
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <SectionTitle subtitle="Soumettez votre dossier de candidature pour rejoindre les rangs du Département des Forces d'Intervention.">
          PORTAIL DE RECRUTEMENT
        </SectionTitle>

        {/* Status banner */}
        <div className={`text-center py-3 px-4 border rounded mb-10 font-heading text-xs tracking-[0.2em] uppercase ${statusCfg.class}`}>
          {statusCfg.text}
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gold-border bg-card p-8 text-center"
            >
              <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-heading text-lg tracking-[0.15em] uppercase text-accent mb-3">
                Dossier Transmis
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Votre candidature a été transmise au Haut Commandement — en attente de traitement.
              </p>
              <StampBadge variant="gold">EN COURS DE TRAITEMENT</StampBadge>
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ pseudo_roblox: '', division: '', grade_actuel: '', experience: '', motivation: '', disponibilite: '' });
                  }}
                  className="text-xs font-heading tracking-wider uppercase"
                >
                  Nouvelle candidature
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="gold-border bg-card p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <StampBadge variant="red">CONFIDENTIEL</StampBadge>
                <span className="text-[10px] text-muted-foreground font-mono">FORM-DFI-REC-001</span>
              </div>

              <div className="space-y-2">
                <Label className="font-heading text-xs tracking-wider uppercase text-foreground/80">
                  Pseudo Roblox *
                </Label>
                <Input
                  required
                  value={form.pseudo_roblox}
                  onChange={(e) => updateField('pseudo_roblox', e.target.value)}
                  placeholder="Votre pseudo Roblox"
                  className="bg-secondary border-border"
                  disabled={statut === 'ferme'}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-heading text-xs tracking-wider uppercase text-foreground/80">
                  Division visée *
                </Label>
                <Select
                  value={form.division}
                  onValueChange={(v) => updateField('division', v)}
                  disabled={statut === 'ferme'}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Sélectionner une division" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVISIONS.map(d => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-heading text-xs tracking-wider uppercase text-foreground/80">
                  Grade actuel dans le jeu
                </Label>
                <Input
                  value={form.grade_actuel}
                  onChange={(e) => updateField('grade_actuel', e.target.value)}
                  placeholder="Ex: Agent de terrain"
                  className="bg-secondary border-border"
                  disabled={statut === 'ferme'}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-heading text-xs tracking-wider uppercase text-foreground/80">
                  Expérience SCP
                </Label>
                <Textarea
                  value={form.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                  placeholder="Décrivez votre expérience dans l'univers SCP..."
                  className="bg-secondary border-border min-h-[80px]"
                  disabled={statut === 'ferme'}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-heading text-xs tracking-wider uppercase text-foreground/80">
                  Motivation *
                </Label>
                <Textarea
                  required
                  value={form.motivation}
                  onChange={(e) => updateField('motivation', e.target.value)}
                  placeholder="Pourquoi souhaitez-vous rejoindre le DFI ?"
                  className="bg-secondary border-border min-h-[100px]"
                  disabled={statut === 'ferme'}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-heading text-xs tracking-wider uppercase text-foreground/80">
                  Disponibilité hebdomadaire
                </Label>
                <Input
                  value={form.disponibilite}
                  onChange={(e) => updateField('disponibilite', e.target.value)}
                  placeholder="Ex: Weekends + 2 soirs/semaine"
                  className="bg-secondary border-border"
                  disabled={statut === 'ferme'}
                />
              </div>

              <Button
                type="submit"
                disabled={statut === 'ferme' || createMutation.isPending || !form.pseudo_roblox || !form.division || !form.motivation}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-heading tracking-[0.15em] uppercase text-xs py-5"
              >
                <Send className="w-4 h-4 mr-2" />
                {createMutation.isPending ? 'Transmission en cours...' : 'Soumettre le dossier'}
              </Button>

              {statut === 'ferme' && (
                <p className="text-center text-xs text-destructive">
                  Le recrutement est actuellement fermé. Veuillez réessayer ultérieurement.
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}