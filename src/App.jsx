import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { DFIAuthProvider } from '@/lib/DFIAuthContext';

import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Presentation from './pages/Presentation';
import Hierarchie from './pages/Hierarchie';
import Recrutement from './pages/Recrutement';
import Dashboard from './pages/Dashboard';
import Membres from './pages/Membres';
import AppelFIM from './pages/AppelFIM';
import OrdresJour from './pages/OrdresJour';
import HistoriqueAlertes from './pages/HistoriqueAlertes';
import GestionOperateurs from './pages/GestionOperateurs';
import GestionComptes from './pages/GestionComptes';
import Connexion from './pages/Connexion';
import MonCompte from './pages/MonCompte';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-xs text-muted-foreground tracking-wider">INITIALISATION...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    else if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate replace to="/accueil" />} />
        <Route path="/accueil" element={<Home />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/hierarchie" element={<Hierarchie />} />
        <Route path="/recrutement" element={<Recrutement />} />
        <Route path="/tableau-de-bord" element={<Dashboard />} />
        <Route path="/membres" element={<Membres />} />
        <Route path="/appel-fim" element={<AppelFIM />} />
        <Route path="/ordres-du-jour" element={<OrdresJour />} />
        <Route path="/historique-alertes" element={<HistoriqueAlertes />} />
        <Route path="/gestion-operateurs" element={<GestionOperateurs />} />
        <Route path="/gestion-comptes" element={<GestionComptes />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/mon-compte" element={<MonCompte />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <DFIAuthProvider>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </DFIAuthProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App