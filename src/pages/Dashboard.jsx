import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionTitle from '../components/ui/SectionTitle';
import DashboardLogin from '../components/dashboard/DashboardLogin';
import MembersList from '../components/dashboard/MembersList';
import StatsOverview from '../components/dashboard/StatsOverview';
import AnnoncesFeed from '../components/dashboard/AnnoncesFeed';
import CreateAnnonceForm from '../components/dashboard/CreateAnnonceForm';
import StampBadge from '../components/ui/StampBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('dfi_auth') === 'true');
  const queryClient = useQueryClient();

  const { data: membres, isLoading: loadingMembres } = useQuery({
    queryKey: ['membres'],
    queryFn: () => base44.entities.Membre.list('-created_date'),
    enabled: authed,
    initialData: [],
  });

  const { data: annonces, isLoading: loadingAnnonces } = useQuery({
    queryKey: ['annonces'],
    queryFn: () => base44.entities.Annonce.list('-created_date', 20),
    enabled: authed,
    initialData: [],
  });

  const { data: configs } = useQuery({
    queryKey: ['config_recrutement'],
    queryFn: () => base44.entities.ConfigRecrutement.list(),
    enabled: authed,
    initialData: [],
  });

  const createAnnonceMutation = useMutation({
    mutationFn: (data) => base44.entities.Annonce.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['annonces'] }),
  });

  const updateRecrutementMutation = useMutation({
    mutationFn: async (statut) => {
      if (configs?.[0]?.id) {
        return base44.entities.ConfigRecrutement.update(configs[0].id, { statut });
      }
      return base44.entities.ConfigRecrutement.create({ statut });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['config_recrutement'] }),
  });

  const handleLogout = () => {
    sessionStorage.removeItem('dfi_auth');
    setAuthed(false);
  };

  if (!authed) {
    return <DashboardLogin onAuth={() => setAuthed(true)} />;
  }

  const currentStatut = configs?.[0]?.statut || 'ouvert';

  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-3 h-3 mr-2" />
            Déconnexion
          </Button>
        </div>

        <SectionTitle subtitle="Panneau de contrôle du Haut Commandement — Niveau d'accès 4">
          TABLEAU DE BORD
        </SectionTitle>

        <div className="text-center mb-8">
          <StampBadge variant="gold">ZONE CLASSIFIÉE — ÉTAT-MAJOR UNIQUEMENT</StampBadge>
        </div>

        {/* Recrutement control */}
        <div className="gold-border bg-card p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
          <span className="font-heading text-xs tracking-wider uppercase text-muted-foreground">
            Statut du recrutement
          </span>
          <Select
            value={currentStatut}
            onValueChange={(v) => updateRecrutementMutation.mutate(v)}
          >
            <SelectTrigger className="w-48 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ouvert">🟢 Ouvert</SelectItem>
              <SelectItem value="suspendu">🟠 Suspendu</SelectItem>
              <SelectItem value="ferme">🔴 Fermé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="overview" className="font-heading text-[10px] tracking-wider uppercase">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="members" className="font-heading text-[10px] tracking-wider uppercase">
              Membres
            </TabsTrigger>
            <TabsTrigger value="annonces" className="font-heading text-[10px] tracking-wider uppercase">
              Annonces
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StatsOverview members={membres} />
          </TabsContent>

          <TabsContent value="members">
            <div className="gold-border bg-card p-4">
              <MembersList members={membres} />
            </div>
          </TabsContent>

          <TabsContent value="annonces" className="space-y-6">
            <div className="gold-border bg-card p-6">
              <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-accent mb-4">
                Nouvelle Annonce
              </h3>
              <CreateAnnonceForm
                onSubmit={(data) => createAnnonceMutation.mutate(data)}
                isPending={createAnnonceMutation.isPending}
              />
            </div>
            <div className="gold-border bg-card p-6">
              <h3 className="font-heading text-xs tracking-[0.15em] uppercase text-accent mb-4">
                Fil d'Activité
              </h3>
              <AnnoncesFeed annonces={annonces} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}