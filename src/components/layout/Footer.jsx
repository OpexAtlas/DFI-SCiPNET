import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-heading text-accent text-xs tracking-[0.3em] uppercase mb-2">
          Département des Forces d'Intervention
        </p>
        <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase mb-4">
          Sécurisé. Contenir. Protégé.
        </p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-12 bg-border" />
          <span className="stamp text-[9px] text-primary border-primary/50 px-2 py-0.5">
            CONFIDENTIEL
          </span>
          <div className="h-px w-12 bg-border" />
        </div>
        <p className="text-[10px] text-muted-foreground/60">
          © {new Date().getFullYear()} Fondation SCP — Tous droits réservés — Accès restreint Niveau 4+
        </p>
      </div>
    </footer>
  );
}