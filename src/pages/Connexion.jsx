import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDFIAuth } from '@/lib/DFIAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const LOGO_URL = "https://media.base44.com/images/public/user_6a07b1585351552d3ee8aeb7/9989b916f_LgoDFI.png";

export default function Connexion() {
  const { login } = useDFIAuth();
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const compte = await login(pseudo, password);
      // Redirect based on permission
      if (compte.niveau_permission >= 3) {
        navigate('/membres');
      } else {
        navigate('/mon-compte');
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="DFI" className="w-20 h-20 mx-auto mb-4 rounded-full" />
          <h1 className="font-heading text-xl tracking-[0.2em] uppercase text-accent mb-1">
            Portail DFI
          </h1>
          <p className="text-[11px] text-muted-foreground tracking-[0.15em] uppercase">
            Accès réservé aux personnels accrédités
          </p>
        </div>

        <div className="gold-border bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-heading text-[10px] tracking-wider uppercase">Pseudo Roblox</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  required
                  value={pseudo}
                  onChange={e => setPseudo(e.target.value)}
                  placeholder="Votre pseudo"
                  className="pl-10 bg-secondary border-border"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-heading text-[10px] tracking-wider uppercase">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-secondary border-border"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/80 font-heading text-xs tracking-[0.15em] uppercase py-5"
            >
              {loading ? 'Vérification...' : 'Accéder au portail'}
            </Button>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-4">
          Les comptes sont créés par l'État-Major uniquement.
        </p>
      </motion.div>
    </div>
  );
}