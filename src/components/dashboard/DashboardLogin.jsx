import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import StampBadge from '../ui/StampBadge';

const LOGO_URL = "https://media.base44.com/images/public/user_6a07b1585351552d3ee8aeb7/9989b916f_LgoDFI.png";

export default function DashboardLogin({ onAuth }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple password check — stored in sessionStorage
    if (password === 'DFI-COMMAND-2024') {
      sessionStorage.setItem('dfi_auth', 'true');
      onAuth();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="gold-border bg-card p-8 max-w-sm w-full text-center">
        <img src={LOGO_URL} alt="DFI" className="w-16 h-16 mx-auto mb-4 rounded-full" />
        <h2 className="font-heading text-lg tracking-[0.2em] uppercase text-accent mb-2">
          Accès Commandement
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Zone réservée à l'État-Major du DFI
        </p>
        <StampBadge variant="red" className="mb-6">ACCÈS RESTREINT</StampBadge>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="pl-10 bg-secondary border-border"
            />
          </div>
          {error && (
            <p className="text-xs text-destructive">Accréditation invalide.</p>
          )}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 font-heading text-xs tracking-wider uppercase"
          >
            Authentification
          </Button>
        </form>
      </div>
    </div>
  );
}