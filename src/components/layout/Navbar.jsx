import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useDFIAuth } from '@/lib/DFIAuthContext';

const LOGO_URL = "https://media.base44.com/images/public/user_6a07b1585351552d3ee8aeb7/9989b916f_LgoDFI.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { compte, logout, hasPermission } = useDFIAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
    setMobileDropdown(false);
  }, [location.pathname]);

  const commandementLinks = [
    { path: '/membres', label: 'Registre des Membres', minLevel: 1 },
    { path: '/ordres-du-jour', label: 'Ordres du Jour', minLevel: 1 },
    { path: '/historique-alertes', label: 'Historique des Alertes', minLevel: 1 },
    { path: '/gestion-comptes', label: '⭐ Gestion des Comptes', minLevel: 5 },
  ].filter(l => !compte || hasPermission(l.minLevel));

  const commandementPaths = ['/membres', '/ordres-du-jour', '/historique-alertes', '/gestion-comptes', '/gestion-operateurs'];
  const isCommandementActive = commandementPaths.includes(location.pathname);

  const NAV_LEFT = [
    { path: '/', label: 'ACCUEIL' },
    { path: '/presentation', label: 'PRÉSENTATION' },
    { path: '/hierarchie', label: 'HIÉRARCHIE' },
    { path: '/recrutement', label: 'RECRUTEMENT' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={LOGO_URL} alt="DFI Logo" className="h-10 w-10 rounded-full" />
            <div className="hidden sm:block">
              <p className="font-heading text-accent text-sm tracking-[0.2em] uppercase leading-none">Forces d'Intervention</p>
              <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">Fondation SCP</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LEFT.map(item => (
              <Link key={item.path} to={item.path}
                className={`px-3 py-2 text-xs font-heading tracking-[0.15em] uppercase transition-colors ${
                  location.pathname === item.path
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}>
                {item.label}
              </Link>
            ))}

            {/* Commandement dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 text-xs font-heading tracking-[0.15em] uppercase transition-colors ${
                  isCommandementActive ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground hover:text-foreground'
                }`}>
                COMMANDEMENT
                <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-0.5 bg-card border border-border shadow-xl min-w-[210px] z-50">
                  {commandementLinks.map(sub => (
                    <Link key={sub.path} to={sub.path}
                      className={`block px-4 py-2.5 text-xs font-heading tracking-wider transition-colors border-b border-border/50 last:border-0 ${
                        location.pathname === sub.path
                          ? 'text-accent bg-secondary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Appel FIM */}
            <Link to="/appel-fim"
              className={`px-3 py-2 text-xs font-heading tracking-[0.15em] uppercase transition-colors border border-primary/40 mx-1 ${
                location.pathname === '/appel-fim' ? 'text-primary bg-primary/10' : 'text-primary hover:bg-primary/10'
              }`}>
              🚨 APPEL FIM
            </Link>

            {/* Auth */}
            {compte ? (
              <div className="flex items-center gap-2 ml-2 border-l border-border pl-3">
                {compte.photo_url ? (
                  <img src={compte.photo_url} alt="" className="w-7 h-7 rounded-full object-cover border border-accent/40" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
                <Link to="/mon-compte"
                  className="text-xs font-heading tracking-wider text-accent hover:text-accent/80 truncate max-w-[80px]">
                  {compte.pseudo}
                </Link>
                <button onClick={() => { logout(); navigate('/connexion'); }}
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link to="/connexion"
                className="ml-2 px-3 py-1.5 text-xs font-heading tracking-[0.15em] uppercase border border-accent/40 text-accent hover:bg-accent/10 transition-colors">
                CONNEXION
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground p-2">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-background border-b border-border max-h-[80vh] overflow-y-auto">
          {NAV_LEFT.map(item => (
            <Link key={item.path} to={item.path}
              className={`block px-6 py-3 text-xs font-heading tracking-[0.15em] uppercase border-b border-border/50 ${
                location.pathname === item.path ? 'text-accent bg-secondary' : 'text-muted-foreground'
              }`}>
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => setMobileDropdown(!mobileDropdown)}
            className={`w-full flex items-center justify-between px-6 py-3 text-xs font-heading tracking-[0.15em] uppercase border-b border-border/50 ${
              isCommandementActive ? 'text-accent bg-secondary' : 'text-muted-foreground'
            }`}>
            COMMANDEMENT
            <ChevronDown className={`w-3 h-3 transition-transform ${mobileDropdown ? 'rotate-180' : ''}`} />
          </button>
          {mobileDropdown && commandementLinks.map(sub => (
            <Link key={sub.path} to={sub.path}
              className={`block pl-10 pr-6 py-2.5 text-xs font-heading tracking-wider border-b border-border/30 ${
                location.pathname === sub.path ? 'text-accent bg-secondary/50' : 'text-muted-foreground'
              }`}>
              {sub.label}
            </Link>
          ))}

          <Link to="/appel-fim"
            className={`block px-6 py-3 text-xs font-heading tracking-[0.15em] uppercase border-b border-border/50 text-primary bg-primary/5`}>
            🚨 APPEL FIM
          </Link>

          {compte ? (
            <>
              <Link to="/mon-compte"
                className="block px-6 py-3 text-xs font-heading tracking-wider uppercase border-b border-border/50 text-accent">
                <User className="w-3 h-3 inline mr-2" />{compte.pseudo} — Mon Compte
              </Link>
              <button
                onClick={() => { logout(); navigate('/connexion'); setOpen(false); }}
                className="w-full text-left px-6 py-3 text-xs font-heading tracking-wider uppercase border-b border-border/50 text-muted-foreground">
                <LogOut className="w-3 h-3 inline mr-2" />Déconnexion
              </button>
            </>
          ) : (
            <Link to="/connexion"
              className="block px-6 py-3 text-xs font-heading tracking-[0.15em] uppercase border-b border-border/50 text-accent">
              CONNEXION
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}