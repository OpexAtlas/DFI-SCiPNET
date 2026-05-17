import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useDFIAuth, simpleHash } from '@/lib/DFIAuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import StampBadge from '../components/ui/StampBadge';
import { Plus, Trash2, Edit2, X, Check, User, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GRADES = [
  "Général(e) des Forces d'Intervention", "Colonel des Forces d'Intervention",
  "Secrétaire Général(e) à la Défense", "Sous-Secrétaire Général(e) à la Défense",
  "Lieutenant(e)-Colonel", "Commandant(e)", "Capitaine", "Lieutenant(e)",
  "Major", "Adjudant-Chef/fe", "Adjudant(e)", "Brigadier-Chef/fe", "Brigadier", "1ère Classe",
];

const SECTIONS = [
  { value: 'annonces', label: 'Ordres du Jour' },
  { value: 'effectifs', label: 'Registre des Membres' },
  { value: 'appel_fim', label: 'Appel FIM' },
  { value: 'historique_alertes', label: 'Historique des Alertes' },
];

const NIVEAUX = [
  { value: 5, label: 'Niv. 5 — Super Admin' },
  { value: 4, label: 'Niv. 4 — Modérateur (État-Major)' },
  { value: 3, label: 'Niv. 3 — Sous-Modérateur (Chef d\'escouade)' },
  { value: 2, label: 'Niv. 2 — Externe (Accès personnalisé)' },
  { value: 1, label: 'Niv. 1 — Externe (Appel uniquement)' },
];

const STATUT_CONFIG = {
  actif: { text: 'Actif', class: 'bg-green-900/40 text-green-400 border-green-500/30' },
  suspendu: { text: 'Suspendu', class: 'bg-red-900/40 text-red-400 border-red-500/30' },
};

const EMPTY_FORM = {
  pseudo: '', mot_de_passe: '', type_compte: 'operateur_dfi',
  grade: '', division: '', role_personnalise: '',
  niveau_permission: 1, permissions_sections: [],
  photo_url: '', statut: 'actif',
};

export default function GestionComptes() {
  const { compte, hasPermission } = useDFIAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPwd, setShowPwd] = useState(false);
  const [newPwdVisible, setNewPwdVisible] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: comptes, isLoading } = useQuery({
    queryKey: ['comptes_portail'],
    queryFn: () => base44.entities.ComptePortail.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ComptePortail.create({
      ...data,
      mot_de_passe: simpleHash(data.mot_de_passe),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comptes_portail'] });
      setShowForm(false);
      setForm(EMPTY_FORM);
      toast({ description: 'Compte créé avec succès.' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const payload = { ...data };
      if (payload.mot_de_passe) payload.mot_de_passe = simpleHash(payload.mot_de_passe);
      else delete payload.mot_de_passe;
      return base44.entities.ComptePortail.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comptes_portail'] });
      setEditingId(null);
      setShowForm(false);
      setForm(EMPTY_FORM);
      toast({ description: 'Compte mis à jour.' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ComptePortail.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comptes_portail'] });
      toast({ description: 'Compte supprimé.' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const data = { ...form };
      if (!data.mot_de_passe) delete data.mot_de_passe;
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(form);
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({
      pseudo: c.pseudo || '', mot_de_passe: '',
      type_compte: c.type_compte || 'operateur_dfi',
      grade: c.grade || '', division: c.division || '',
      role_personnalise: c.role_personnalise || '',
      niveau_permission: c.niveau_permission || 1,
      permissions_sections: c.permissions_sections || [],
      photo_url: c.photo_url || '', statut: c.statut || 'actif',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Only Super Admin (niveau 5)
  if (!compte || !hasPermission(5)) {
    return (
      <div className="py-16 px-4 text-center">
        <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="font-heading text-lg tracking-wider uppercase text-foreground mb-2">Accès Refusé</h2>
        <p className="text-sm text-muted-foreground">Cette section est réservée au Super Administrateur (Niveau 5).</p>
      </div>
    );
  }

  const toggleSection = (val) => {
    setForm(p => ({
      ...p,
      permissions_sections: p.permissions_sections.includes(val)
        ? p.permissions_sections.filter(s => s !== val)
        : [...p.permissions_sections, val],
    }));
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle="Création et gestion des comptes d'accès au portail DFI — Super Admin uniquement.">
          GESTION DES COMPTES
        </SectionTitle>
        <div className="text-center mb-6">
          <StampBadge variant="gold">NIVEAU 5 — SUPER ADMINISTRATEUR</StampBadge>
        </div>

        {/* Form panel */}
        <div className="gold-border bg-card p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-accent">
              {editingId ? 'Modifier le compte' : 'Nouveau compte'}
            </h3>
            {!showForm ? (
              <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
                size="sm" className="bg-primary hover:bg-primary/80 font-heading text-[10px] tracking-wider uppercase">
                <Plus className="w-3 h-3 mr-1" /> Créer un compte
              </Button>
            ) : (
              <Button variant="ghost" size="sm"
                onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5 border-t border-border pt-4 overflow-hidden"
              >
                {/* Base info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Pseudo Roblox *</Label>
                    <Input required value={form.pseudo}
                      onChange={e => setForm(p => ({ ...p, pseudo: e.target.value }))}
                      className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">
                      Mot de passe {editingId ? '(laisser vide = inchangé)' : '*'}
                    </Label>
                    <div className="relative">
                      <Input
                        required={!editingId}
                        type={showPwd ? 'text' : 'password'}
                        value={form.mot_de_passe}
                        onChange={e => setForm(p => ({ ...p, mot_de_passe: e.target.value }))}
                        className="bg-secondary border-border pr-10"
                        placeholder={editingId ? '••••••• (inchangé)' : ''}
                      />
                      <button type="button" onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {!editingId && form.mot_de_passe && (
                      <p className="text-[10px] text-accent">⚠ Notez ce mot de passe — visible une seule fois.</p>
                    )}
                  </div>
                </div>

                {/* Type + Niveau */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Type de compte</Label>
                    <Select value={form.type_compte} onValueChange={v => setForm(p => ({ ...p, type_compte: v }))}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operateur_dfi">Opérateur DFI</SelectItem>
                        <SelectItem value="externe">Externe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Niveau de permission *</Label>
                    <Select value={String(form.niveau_permission)}
                      onValueChange={v => setForm(p => ({ ...p, niveau_permission: Number(v) }))}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {NIVEAUX.map(n => <SelectItem key={n.value} value={String(n.value)}>{n.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* DFI fields */}
                {form.type_compte === 'operateur_dfi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-heading text-[10px] tracking-wider uppercase">Grade</Label>
                      <Select value={form.grade} onValueChange={v => setForm(p => ({ ...p, grade: v }))}>
                        <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent className="max-h-60">
                          {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-heading text-[10px] tracking-wider uppercase">Division</Label>
                      <Select value={form.division} onValueChange={v => setForm(p => ({ ...p, division: v }))}>
                        <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {['FIMU','Nu-7','Epsilon-11','Beta-7','BSF'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Externe role */}
                {form.type_compte === 'externe' && (
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Rôle personnalisé</Label>
                    <Input value={form.role_personnalise}
                      onChange={e => setForm(p => ({ ...p, role_personnalise: e.target.value }))}
                      className="bg-secondary border-border"
                      placeholder="Ex: Directeur d'Installation Site-19" />
                  </div>
                )}

                {/* Niveau 2 — sections */}
                {form.niveau_permission === 2 && (
                  <div className="space-y-3 border border-accent/20 p-4">
                    <p className="font-heading text-[10px] tracking-wider uppercase text-accent">
                      Sections autorisées (Niveau 2)
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {SECTIONS.map(s => (
                        <div key={s.value} className="flex items-center gap-2">
                          <Checkbox
                            id={s.value}
                            checked={form.permissions_sections.includes(s.value)}
                            onCheckedChange={() => toggleSection(s.value)}
                          />
                          <label htmlFor={s.value} className="text-xs text-foreground cursor-pointer">{s.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo + Statut */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">URL Photo</Label>
                    <Input value={form.photo_url}
                      onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))}
                      className="bg-secondary border-border" placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Statut</Label>
                    <Select value={form.statut} onValueChange={v => setForm(p => ({ ...p, statut: v }))}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actif">Actif</SelectItem>
                        <SelectItem value="suspendu">Suspendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || !form.pseudo}
                  className="bg-primary hover:bg-primary/80 font-heading text-xs tracking-wider uppercase">
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? 'Mettre à jour' : 'Créer le compte'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Chargement...</div>
        ) : comptes.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucun compte créé.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {comptes.map((c, i) => {
              const statut = STATUT_CONFIG[c.statut] || STATUT_CONFIG.actif;
              return (
                <motion.div key={c.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border border-border bg-card hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 p-4">
                    {c.photo_url ? (
                      <img src={c.photo_url} alt="" className="w-8 h-8 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-heading text-sm text-foreground">{c.pseudo}</span>
                      <span className="text-[11px] text-muted-foreground ml-2">
                        {c.type_compte === 'operateur_dfi' ? (c.grade || 'Opérateur') : (c.role_personnalise || 'Externe')}
                      </span>
                    </div>
                    <span className="text-[10px] text-accent font-heading hidden sm:block">
                      Niv. {c.niveau_permission}
                    </span>
                    {c.division && <span className="text-[10px] text-muted-foreground hidden md:block">{c.division}</span>}
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${statut.class} hidden sm:block`}>{statut.text}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <button onClick={() => startEdit(c)}
                        className="text-accent/60 hover:text-accent transition-colors p-1">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(c.id)}
                        className="text-destructive/40 hover:text-destructive transition-colors p-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
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