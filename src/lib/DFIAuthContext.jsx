import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const DFIAuthContext = createContext(null);

// Simple hash for password (not cryptographic, but sufficient for this use case)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function DFIAuthProvider({ children }) {
  const [compte, setCompte] = useState(() => {
    try {
      const stored = sessionStorage.getItem('dfi_compte');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = useCallback(async (pseudo, motDePasse) => {
    // Fetch account by pseudo only, then compare password client-side
    const comptes = await base44.entities.ComptePortail.filter({ pseudo, statut: 'actif' });
    if (!comptes || comptes.length === 0) {
      throw new Error('Identifiants incorrects ou compte suspendu.');
    }
    const c = comptes[0];
    const hashed = simpleHash(motDePasse);
    // Accept both plain text and hashed password
    if (c.mot_de_passe !== motDePasse && c.mot_de_passe !== hashed) {
      throw new Error('Identifiants incorrects ou compte suspendu.');
    }
    sessionStorage.setItem('dfi_compte', JSON.stringify(c));
    setCompte(c);
    return c;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('dfi_compte');
    setCompte(null);
  }, []);

  // Refresh compte from DB (e.g. after updates)
  const refreshCompte = useCallback(async () => {
    if (!compte?.id) return;
    try {
      const comptes = await base44.entities.ComptePortail.filter({ id: compte.id });
      if (comptes?.[0]) {
        const updated = comptes[0];
        sessionStorage.setItem('dfi_compte', JSON.stringify(updated));
        setCompte(updated);
      }
    } catch {}
  }, [compte?.id]);

  const hasPermission = useCallback((level) => {
    if (!compte) return false;
    return (compte.niveau_permission || 0) >= level;
  }, [compte]);

  const hasSection = useCallback((section) => {
    if (!compte) return false;
    if (compte.niveau_permission >= 3) return true;
    if (compte.niveau_permission === 2) {
      return (compte.permissions_sections || []).includes(section);
    }
    if (compte.niveau_permission === 1) {
      return section === 'appel_fim';
    }
    return false;
  }, [compte]);

  return (
    <DFIAuthContext.Provider value={{ compte, login, logout, refreshCompte, hasPermission, hasSection, simpleHash }}>
      {children}
    </DFIAuthContext.Provider>
  );
}

export function useDFIAuth() {
  const ctx = useContext(DFIAuthContext);
  if (!ctx) throw new Error('useDFIAuth must be used inside DFIAuthProvider');
  return ctx;
}

export { simpleHash };