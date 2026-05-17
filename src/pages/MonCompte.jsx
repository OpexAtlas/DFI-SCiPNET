import React from 'react';
import { useDFIAuth } from '@/lib/DFIAuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, Shield, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import StampBadge from '../components/ui/StampBadge';

const NIVEAU_LABELS = {
  5: { label: 'Super Administrateur', badge: 'gold', desc: 'Accès total sans restriction' },
  4: { label: 'Modérateur', badge: 'gold', desc: 'État-Major — accès étendu' },
  3: { label: 'Sous-Modérateur', badge: 'muted', desc: 'Chef d\'escouade — accès opérationnel' },
  2: { label: 'Externe — Accès personnalisé', badge: 'muted', desc: 'Accès limité aux sections autorisées' },
  1: { label: 'Externe — Appel uniquement', badge: 'muted', desc: 'Peut lancer un appel FIM' },
};

const SECTION_LABELS = {
  annonces: 'Ordres du Jour',
  effectifs: 'Registre des Membres',
  appel_fim: 'Appel FIM',
  historique_alertes: 'Historique des Alertes',
};

const STATUT_CONFIG = {
  actif: { text: 'Actif', class: 'bg-green-900/40 text-green-400 border-green-500/30' },
  en_mission: { text: 'En mission', class: 'bg-blue-900/40 text-blue-400 border-blue-500/30' },
  inactif: { text: 'Inactif', class: 'bg-muted text-muted-foreground border-border' },
  suspendu: { text: 'Suspendu', class: 'bg-red-900/40 text-red-400 border-red-500/30' },
};

export default function MonCompte() {
  const { compte, logout } = useDFIAuth();
  const navigate = useNavigate();

  if (!compte) {
    navigate('/connexion');
    return null;
  }

  const niveauInfo = NIVEAU_LABELS[compte.niveau_permission] || NIVEAU_LABELS[1];
  const statut = STATUT_CONFIG[compte.statut] || STATUT_CONFIG.actif;

  return (
    <div className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gold-border bg-card p-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-5">
              {compte.photo_url ? (
                <img src={compte.photo_url} alt={compte.pseudo} className="w-20 h-20 rounded-full object-cover border-2 border-accent/40" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              <div>
                <h1 className="font-heading text-xl tracking-[0.15em] uppercase text-foreground">
                  {compte.pseudo}
                </h1>
                {compte.type_compte === 'operateur_dfi' ? (
                  <p className="text-sm text-muted-foreground mt-1">{compte.grade}</p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{compte.role_personnalise || 'Externe'}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { logout(); navigate('/connexion'); }}
              className="text-muted-foreground hover:text-foreground text-xs font-heading tracking-wider uppercase"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {compte.type_compte === 'operateur_dfi' && compte.division && (
              <div className="bg-secondary p-3">
                <p className="text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Division</p>
                <p className="font-heading text-accent text-sm">{compte.division}</p>
              </div>
            )}
            <div className="bg-secondary p-3">
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Type</p>
              <p className="font-heading text-sm text-foreground">
                {compte.type_compte === 'operateur_dfi' ? 'Opérateur DFI' : 'Externe'}
              </p>
            </div>
            <div className="bg-secondary p-3">
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Statut</p>
              <span className={`text-[11px] px-2 py-0.5 rounded border ${statut.class}`}>{statut.text}</span>
            </div>
          </div>

          {/* Permission level */}
          <div className="border border-border p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground">
                Niveau d'accréditation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-heading text-2xl text-accent">{compte.niveau_permission}</span>
              <div>
                <p className="font-heading text-xs tracking-wider uppercase text-foreground">{niveauInfo.label}</p>
                <p className="text-[11px] text-muted-foreground">{niveauInfo.desc}</p>
              </div>
            </div>
          </div>

          {/* Sections autorisées (niveau 2) */}
          {compte.niveau_permission === 2 && compte.permissions_sections?.length > 0 && (
            <div className="border border-border p-4">
              <p className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground mb-3">
                Sections autorisées
              </p>
              <div className="flex flex-wrap gap-2">
                {compte.permissions_sections.map(s => (
                  <span key={s} className="text-[10px] px-2 py-1 bg-secondary border border-border font-heading tracking-wider text-foreground">
                    {SECTION_LABELS[s] || s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}