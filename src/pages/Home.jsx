import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Shield, Users, Award, FileText } from 'lucide-react';
import TerminalBoot from '../components/home/TerminalBoot';
import StampBadge from '../components/ui/StampBadge';

const LOGO_URL = "https://media.base44.com/images/public/user_6a07b1585351552d3ee8aeb7/9989b916f_LgoDFI.png";

const QUICK_LINKS = [
  { to: '/presentation', label: 'Présentation', icon: Shield, desc: 'Découvrir nos divisions' },
  { to: '/hierarchie', label: 'Hiérarchie', icon: Award, desc: 'Structure de commandement' },
  { to: '/recrutement', label: 'Recrutement', icon: FileText, desc: 'Rejoindre nos rangs' },
  { to: '/tableau-de-bord', label: 'Commandement', icon: Users, desc: 'Accès État-Major' },
];

export default function Home() {
  const [bootDone, setBootDone] = useState(!!sessionStorage.getItem('dfi_boot_seen'));

  return (
    <>
      <AnimatePresence>
        {!bootDone && <TerminalBoot onComplete={() => setBootDone(true)} />}
      </AnimatePresence>

      {bootDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero */}
          <section className="relative py-20 md:py-32 px-4 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <motion.img
                src={LOGO_URL}
                alt="DFI Logo"
                className="w-32 h-32 md:w-44 md:h-44 mx-auto mb-8 drop-shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              />

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="font-heading text-3xl md:text-5xl tracking-[0.25em] uppercase text-foreground mb-4">
                  Forces d'Intervention
                </h1>
                <p className="italic text-accent text-lg md:text-xl font-body mb-2">
                  « Gloire et Honneur »
                </p>
                <p className="font-heading text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-8">
                  Sécurisé. Contenir. Protégé.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-4 mb-10"
              >
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-accent/40" />
                <StampBadge variant="gold">ACCÈS RESTREINT</StampBadge>
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-accent/40" />
              </motion.div>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
              >
                Le Département des Forces d'Intervention est le bras armé de la Fondation SCP.
                Nos opérateurs sont entraînés pour contenir, neutraliser et sécuriser toute anomalie
                menaçant l'intégrité du monde connu. Chaque division est spécialisée,
                chaque membre est un élément clé de la chaîne de commandement.
              </motion.p>

              {/* Quick links */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
              >
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="gold-border bg-card p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors group"
                  >
                    <link.icon className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="text-left flex-1">
                      <p className="font-heading text-xs tracking-[0.15em] uppercase text-foreground">
                        {link.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{link.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </Link>
                ))}
              </motion.div>
            </div>
          </section>
        </motion.div>
      )}
    </>
  );
}