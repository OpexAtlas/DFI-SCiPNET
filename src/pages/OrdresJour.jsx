import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import StampBadge from '../components/ui/StampBadge';
import AnnoncesFeed from '../components/dashboard/AnnoncesFeed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Lock, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Simple state-major password check
const ETAT_MAJOR_PWD = 'DFI-COMMAND-2024';

export default function OrdresJour() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('dfi_auth') === 'true');
  const [password, setPassword] = useState('');
  const [pwdError, setPwdError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titre: '', contenu: '', type: 'ordre_du_jour', auteur: '', priorite: false });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: annonces, isLoading } = useQuery({
    queryKey: ['annonces'],
    queryFn: () => base44.entities.Annonce.list('-created_date', 50),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Annonce.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annonces'] });
      setForm({ titre: '', contenu: '', type: 'ordre_du_jour', auteur: '', priorite: false });
      setShowForm(false);
      toast({ description: 'Annonce publiée avec succès.' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Annonce.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annonces'] });
      toast({ description: 'Annonce supprimée.' });
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ETAT_MAJOR_PWD) {
      sessionStorage.setItem('dfi_auth', 'true');
      setAuthed(true);
    } else {
      setPwdError(true);
      setTimeout(() => setPwdError(false), 2000);
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionTitle subtitle="Communications officielles, ordres du jour et annonces de l'État-Major du DFI.">
          ORDRES DU JOUR
        </SectionTitle>

        {/* Publish section — état-major only */}
        <div className="gold-border bg-card p-5 mb-8">
          {!authed ? (
            <div>
              <p className="text-xs text-muted-foreground text-center mb-3 font-heading tracking-wider uppercase">
                <Lock className="w-3 h-3 inline mr-1" /> Publication réservée à l'État-Major
              </p>
              <form onSubmit={handleLogin} className="flex items-center gap-3 max-w-sm mx-auto">
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Code d'accès État-Major"
                  className="bg-secondary border-border text-xs"
                />
                <Button type="submit" size="sm" className="bg-primary font-heading text-xs tracking-wider uppercase">
                  Accéder
                </Button>
              </form>
              {pwdError && <p className="text-[11px] text-destructive text-center mt-2">Code invalide.</p>}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading text-[10px] tracking-wider uppercase text-accent">
                  Mode État-Major — Publication activée
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(!showForm)}
                  className="text-xs font-heading tracking-wider uppercase"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {showForm ? 'Annuler' : 'Nouvelle Annonce'}
                </Button>
              </div>

              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 border-t border-border pt-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-heading text-[10px] tracking-wider uppercase">Titre *</Label>
                      <Input
                        required
                        value={form.titre}
                        onChange={e => setForm(p => ({ ...p, titre: e.target.value }))}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-heading text-[10px] tracking-wider uppercase">Type</Label>
                      <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ordre_du_jour">Ordre du jour</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="operation">Opération</SelectItem>
                          <SelectItem value="annonce_generale">Annonce générale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Contenu *</Label>
                    <Textarea
                      required
                      value={form.contenu}
                      onChange={e => setForm(p => ({ ...p, contenu: e.target.value }))}
                      className="bg-secondary border-border min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                      <Label className="font-heading text-[10px] tracking-wider uppercase">Auteur (Pseudo + Grade)</Label>
                      <Input
                        value={form.auteur}
                        onChange={e => setForm(p => ({ ...p, auteur: e.target.value }))}
                        className="bg-secondary border-border w-52"
                        placeholder="Ex: Général Valkyr"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="font-heading text-[10px] tracking-wider uppercase">Prioritaire</Label>
                      <Switch checked={form.priorite} onCheckedChange={v => setForm(p => ({ ...p, priorite: v }))} />
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      if (!form.titre || !form.contenu) return;
                      createMutation.mutate(form);
                    }}
                    disabled={createMutation.isPending}
                    className="bg-primary hover:bg-primary/80 font-heading text-xs tracking-wider uppercase"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Publier l'annonce
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Chargement...</div>
        ) : annonces.length === 0 ? (
          <div className="text-center py-12">
            <StampBadge variant="muted">AUCUNE ANNONCE</StampBadge>
            <p className="text-sm text-muted-foreground mt-4">Aucune annonce publiée pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...annonces]
              .sort((a, b) => {
                if (a.priorite && !b.priorite) return -1;
                if (!a.priorite && b.priorite) return 1;
                return new Date(b.created_date) - new Date(a.created_date);
              })
              .map(annonce => (
                <AnnonceWithDelete
                  key={annonce.id}
                  annonce={annonce}
                  authed={authed}
                  onDelete={() => deleteMutation.mutate(annonce.id)}
                />
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

function AnnonceWithDelete({ annonce, authed, onDelete }) {
  const TYPE_LABELS = {
    ordre_du_jour: 'Ordre du jour',
    promotion: 'Promotion',
    operation: 'Opération',
    annonce_generale: 'Annonce',
  };

  return (
    <div className={`p-4 border transition-colors relative group ${
      annonce.priorite ? 'gold-border bg-accent/5' : 'border-border bg-card hover:bg-secondary/30'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <h4 className={`font-heading text-xs tracking-wider uppercase ${annonce.priorite ? 'text-accent' : 'text-foreground'}`}>
            {annonce.titre}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {annonce.priorite && <StampBadge variant="gold">PRIORITAIRE</StampBadge>}
          <span className="text-[10px] text-muted-foreground">{TYPE_LABELS[annonce.type]}</span>
          {authed && (
            <button
              onClick={onDelete}
              className="text-destructive/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{annonce.contenu}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-3">
        {annonce.auteur && `Par ${annonce.auteur} — `}
        {annonce.created_date && new Date(annonce.created_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}