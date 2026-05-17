import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import StampBadge from '../components/ui/StampBadge';
import { Plus, Trash2, Edit2, X, Check, User, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ETAT_MAJOR_PWD = 'DFI-COMMAND-2024';

const GRADES = [
  "Général(e) des Forces d'Intervention",
  "Colonel des Forces d'Intervention",
  "Secrétaire Général(e) à la Défense",
  "Sous-Secrétaire Général(e) à la Défense",
  "Lieutenant(e)-Colonel",
  "Commandant(e)",
  "Capitaine",
  "Lieutenant(e)",
  "Major",
  "Adjudant-Chef/fe",
  "Adjudant(e)",
  "Brigadier-Chef/fe",
  "Brigadier",
  "1ère Classe",
];

const CORPS_MAP = {
  "Général(e) des Forces d'Intervention": 'etat_major',
  "Colonel des Forces d'Intervention": 'etat_major',
  "Secrétaire Général(e) à la Défense": 'etat_major',
  "Sous-Secrétaire Général(e) à la Défense": 'etat_major',
  "Lieutenant(e)-Colonel": 'etat_major',
  "Commandant(e)": 'etat_major',
  "Capitaine": 'etat_major',
  "Lieutenant(e)": 'officiers',
  "Major": 'sous_officiers',
  "Adjudant-Chef/fe": 'sous_officiers',
  "Adjudant(e)": 'sous_officiers',
  "Brigadier-Chef/fe": 'hommes_du_rang',
  "Brigadier": 'hommes_du_rang',
  "1ère Classe": 'hommes_du_rang',
};

const STATUT_CONFIG = {
  actif: { text: 'Actif', class: 'bg-green-900/40 text-green-400 border-green-500/30' },
  en_mission: { text: 'En mission', class: 'bg-blue-900/40 text-blue-400 border-blue-500/30' },
  inactif: { text: 'Inactif', class: 'bg-muted text-muted-foreground border-border' },
  suspendu: { text: 'Suspendu', class: 'bg-red-900/40 text-red-400 border-red-500/30' },
};

const EMPTY_FORM = {
  pseudo_roblox: '',
  grade: '',
  division: '',
  statut: 'actif',
  date_entree: '',
  photo_url: '',
  notes_internes: '',
  role_dfi: 'operateur',
  user_email: '',
};

export default function GestionOperateurs() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('dfi_auth') === 'true');
  const [password, setPassword] = useState('');
  const [pwdError, setPwdError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [expandedId, setExpandedId] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: operateurs, isLoading } = useQuery({
    queryKey: ['operateurs'],
    queryFn: () => base44.entities.Operateur.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Operateur.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operateurs'] });
      setShowForm(false);
      setForm(EMPTY_FORM);
      toast({ description: 'Opérateur créé avec succès.' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Operateur.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operateurs'] });
      setEditingId(null);
      setForm(EMPTY_FORM);
      toast({ description: 'Opérateur mis à jour.' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Operateur.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operateurs'] });
      toast({ description: 'Opérateur supprimé.' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, corps: CORPS_MAP[form.grade] || 'hommes_du_rang' };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const startEdit = (op) => {
    setEditingId(op.id);
    setForm({
      pseudo_roblox: op.pseudo_roblox || '',
      grade: op.grade || '',
      division: op.division || '',
      statut: op.statut || 'actif',
      date_entree: op.date_entree || '',
      photo_url: op.photo_url || '',
      notes_internes: op.notes_internes || '',
      role_dfi: op.role_dfi || 'operateur',
      user_email: op.user_email || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!authed) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-sm mx-auto">
          <SectionTitle>GESTION DES OPÉRATEURS</SectionTitle>
          <div className="gold-border bg-card p-8 text-center">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-xs text-muted-foreground mb-4 font-heading tracking-wider uppercase">
              Accès réservé à l'État-Major
            </p>
            <form onSubmit={handleLogin} className="space-y-3">
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Code d'accès"
                className="bg-secondary border-border"
              />
              {pwdError && <p className="text-[11px] text-destructive">Code invalide.</p>}
              <Button type="submit" className="w-full bg-primary font-heading text-xs tracking-wider uppercase">
                Accéder
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle="Création, modification et suppression des comptes opérateurs du DFI.">
          GESTION DES OPÉRATEURS
        </SectionTitle>

        <div className="text-center mb-6">
          <StampBadge variant="gold">MODE ÉTAT-MAJOR — ACCÈS ADMINISTRATEUR</StampBadge>
        </div>

        {/* Add/Edit form */}
        <div className="gold-border bg-card p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-accent">
              {editingId ? 'Modifier l\'opérateur' : 'Nouvel opérateur'}
            </h3>
            {!showForm ? (
              <Button
                onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
                size="sm"
                className="bg-primary hover:bg-primary/80 font-heading text-[10px] tracking-wider uppercase"
              >
                <Plus className="w-3 h-3 mr-1" /> Ajouter un opérateur
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
                className="text-muted-foreground"
              >
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
                className="space-y-4 border-t border-border pt-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Pseudo Roblox *</Label>
                    <Input required value={form.pseudo_roblox} onChange={e => setForm(p => ({ ...p, pseudo_roblox: e.target.value }))} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Grade *</Label>
                    <Select value={form.grade} onValueChange={v => setForm(p => ({ ...p, grade: v }))}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent className="max-h-60">
                        {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Division *</Label>
                    <Select value={form.division} onValueChange={v => setForm(p => ({ ...p, division: v }))}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIMU">FIMU</SelectItem>
                        <SelectItem value="Nu-7">Nu-7</SelectItem>
                        <SelectItem value="Epsilon-11">Epsilon-11</SelectItem>
                        <SelectItem value="Beta-7">Bêta-7</SelectItem>
                        <SelectItem value="BSF">BSF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Statut</Label>
                    <Select value={form.statut} onValueChange={v => setForm(p => ({ ...p, statut: v }))}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actif">Actif</SelectItem>
                        <SelectItem value="en_mission">En mission</SelectItem>
                        <SelectItem value="inactif">Inactif</SelectItem>
                        <SelectItem value="suspendu">Suspendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Date d'entrée</Label>
                    <Input type="date" value={form.date_entree} onChange={e => setForm(p => ({ ...p, date_entree: e.target.value }))} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Rôle DFI</Label>
                    <Select value={form.role_dfi} onValueChange={v => setForm(p => ({ ...p, role_dfi: v }))}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operateur">Opérateur</SelectItem>
                        <SelectItem value="etat_major">État-Major</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">URL Photo de profil</Label>
                    <Input value={form.photo_url} onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))} className="bg-secondary border-border" placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-heading text-[10px] tracking-wider uppercase">Email du compte lié</Label>
                    <Input type="email" value={form.user_email} onChange={e => setForm(p => ({ ...p, user_email: e.target.value }))} className="bg-secondary border-border" placeholder="operateur@exemple.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-heading text-[10px] tracking-wider uppercase">Notes internes (État-Major uniquement)</Label>
                  <Textarea value={form.notes_internes} onChange={e => setForm(p => ({ ...p, notes_internes: e.target.value }))} className="bg-secondary border-border" placeholder="Observations confidentielles..." />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || !form.pseudo_roblox || !form.grade || !form.division} className="bg-primary hover:bg-primary/80 font-heading text-xs tracking-wider uppercase">
                    <Check className="w-4 h-4 mr-2" />
                    {editingId ? 'Mettre à jour' : 'Créer l\'opérateur'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Chargement...</div>
        ) : operateurs.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucun opérateur enregistré.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {operateurs.map((op, i) => {
              const statut = STATUT_CONFIG[op.statut] || STATUT_CONFIG.actif;
              const isExpanded = expandedId === op.id;
              return (
                <motion.div
                  key={op.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border border-border bg-card hover:bg-secondary/30 transition-colors"
                >
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : op.id)}
                  >
                    {op.photo_url ? (
                      <img src={op.photo_url} alt="" className="w-8 h-8 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-heading text-sm text-foreground">{op.pseudo_roblox}</span>
                      <span className="text-[11px] text-muted-foreground ml-2">{op.grade}</span>
                    </div>
                    <span className="text-[10px] text-accent font-heading hidden sm:block">{op.division}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${statut.class} hidden sm:block`}>{statut.text}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={e => { e.stopPropagation(); startEdit(op); }}
                        className="text-accent/60 hover:text-accent transition-colors p-1"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); deleteMutation.mutate(op.id); }}
                        className="text-destructive/40 hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-border px-4 pb-4 pt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs"
                    >
                      <div><span className="text-muted-foreground">Division : </span><span className="text-accent">{op.division}</span></div>
                      <div><span className="text-muted-foreground">Corps : </span><span>{op.corps?.replace('_', ' ')}</span></div>
                      <div><span className="text-muted-foreground">Entrée : </span><span>{op.date_entree ? new Date(op.date_entree).toLocaleDateString('fr-FR') : '—'}</span></div>
                      <div><span className="text-muted-foreground">Rôle : </span><span>{op.role_dfi === 'etat_major' ? '⭐ État-Major' : 'Opérateur'}</span></div>
                      {op.user_email && <div className="col-span-2"><span className="text-muted-foreground">Email : </span><span className="font-mono">{op.user_email}</span></div>}
                      {op.notes_internes && (
                        <div className="col-span-full border border-accent/20 bg-accent/5 p-2">
                          <span className="text-accent text-[10px] font-heading tracking-wider uppercase">Notes internes : </span>
                          <span className="text-muted-foreground">{op.notes_internes}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}