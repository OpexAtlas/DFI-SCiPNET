import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: '> INITIALISATION SYSTÈME FONDATION SCP...', delay: 0 },
  { text: '> CONNEXION RÉSEAU SÉCURISÉ — PROTOCOLE KETER', delay: 400 },
  { text: '> VÉRIFICATION ACCRÉDITATION NIVEAU 4...', delay: 800 },
  { text: '> ACCÈS AUTORISÉ — BIENVENUE, OPÉRATEUR', delay: 1200 },
  { text: '> CHARGEMENT MODULE : DÉPARTEMENT DES FORCES D\'INTERVENTION', delay: 1700 },
  { text: '> STATUT : OPÉRATIONNEL', delay: 2200 },
  { text: '> "GLOIRE ET HONNEUR"', delay: 2700 },
];

export default function TerminalBoot({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Check if already seen in this session
    if (sessionStorage.getItem('dfi_boot_seen')) {
      setDone(true);
      onComplete?.();
      return;
    }

    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line.text]);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => {
            sessionStorage.setItem('dfi_boot_seen', 'true');
            setDone(true);
            onComplete?.();
          }, 1200);
        }
      }, line.delay);
    });
  }, []);

  if (done) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-2xl">
        <div className="border border-border p-6 bg-card">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-accent/60" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
            <span className="ml-3 text-[10px] text-muted-foreground font-mono tracking-wider">
              SCP_FOUNDATION://DFI/TERMINAL
            </span>
          </div>
          <div className="space-y-2 font-mono text-xs md:text-sm">
            {visibleLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${
                  line.includes('GLOIRE') ? 'text-accent font-bold' :
                  line.includes('OPÉRATIONNEL') ? 'text-green-500' :
                  'text-foreground/80'
                }`}
              >
                {line}
              </motion.p>
            ))}
            {visibleLines.length < BOOT_LINES.length && (
              <span className="terminal-cursor text-accent">▌</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}