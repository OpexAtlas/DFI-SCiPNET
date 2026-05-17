import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';

export default function CreateAnnonceForm({ onSubmit, isPending }) {
  const [form, setForm] = useState({
    titre: '',
    contenu: '',
    type: 'annonce_generale',
    auteur: '',
    priorite: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ titre: '', contenu: '', type: 'annonce_generale', auteur: '', priorite: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-heading text-[10px] tracking-wider uppercase">Titre</Label>
          <Input
            required
            value={form.titre}
            onChange={(e) => setForm(p => ({ ...p, titre: e.target.value }))}
            className="bg-secondary border-border"
            placeholder="Titre de l'annonce"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-heading text-[10px] tracking-wider uppercase">Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm(p => ({ ...p, type: v }))}>
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
        <Label className="font-heading text-[10px] tracking-wider uppercase">Contenu</Label>
        <Textarea
          required
          value={form.contenu}
          onChange={(e) => setForm(p => ({ ...p, contenu: e.target.value }))}
          className="bg-secondary border-border min-h-[80px]"
          placeholder="Contenu de l'annonce..."
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Label className="font-heading text-[10px] tracking-wider uppercase">Auteur</Label>
          <Input
            value={form.auteur}
            onChange={(e) => setForm(p => ({ ...p, auteur: e.target.value }))}
            className="bg-secondary border-border w-48"
            placeholder="Nom / Grade"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="font-heading text-[10px] tracking-wider uppercase">Prioritaire</Label>
          <Switch
            checked={form.priorite}
            onCheckedChange={(v) => setForm(p => ({ ...p, priorite: v }))}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending || !form.titre || !form.contenu}
        className="bg-primary hover:bg-primary/80 font-heading text-xs tracking-wider uppercase"
      >
        <Plus className="w-4 h-4 mr-2" />
        Publier l'annonce
      </Button>
    </form>
  );
}