import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import StampBadge from '../components/ui/StampBadge';
import DivisionCard from '../components/presentation/DivisionCard';

const DIVISIONS = [
  {
    id: 'FIMU',
    name: 'Forces d\'Intervention Mobile Universel',
    subtitle: 'FIMU — Premier Déploiement',
    description: 'Unité polyvalente constituant la première ligne de déploiement du DFI. Les opérateurs FIMU sont formés pour intervenir sur tout type de situation, de la simple escorte de convoi à la sécurisation d\'un périmètre de confinement. Ils sont le socle sur lequel repose l\'ensemble de la structure opérationnelle.',
  },
  {
    id: 'Nu-7',
    name: 'FIM Armée Nu-7 « Coup de Marteau »',
    subtitle: 'Intervention Lourde',
    description: 'Spécialisée dans la neutralisation de menaces majeures, Nu-7 est déployée lorsque la situation dépasse les capacités des unités standard. Dotée d\'un armement lourd et d\'une formation tactique avancée, cette force d\'intervention est le marteau qui s\'abat sur les ennemis de la Fondation.',
  },
  {
    id: 'Epsilon-11',
    name: 'FIM Epsilon-11 « Renard à Neuf Queues »',
    subtitle: 'Reconfinement d\'Anomalies',
    description: 'Epsilon-11 est spécialisée dans le reconfinement d\'entités SCP lors de brèches massives. Ses opérateurs sont formés pour évoluer dans des environnements hautement dangereux et imprévisibles, où chaque seconde compte pour rétablir le confinement et éviter une catastrophe à grande échelle.',
  },
  {
    id: 'Beta-7',
    name: 'FIM Bêta-7',
    subtitle: 'Menaces Biologiques & Chimiques',
    description: 'Les spécialistes de Bêta-7 sont déployés face aux menaces de nature biologique, chimique ou environnementale. Équipés de combinaisons HAZMAT et d\'outils de détection avancés, ils interviennent dans les zones contaminées pour neutraliser les agents pathogènes anomaux.',
  },
  {
    id: 'BSF',
    name: 'Bureau de Sécurité des Forces',
    subtitle: 'BSF — Police Interne du DFI',
    description: 'Le BSF est l\'organe de contrôle interne du Département. Chargé de maintenir la discipline, d\'enquêter sur les manquements au protocole et de garantir l\'intégrité de chaque opérateur, le Bureau de Sécurité est l\'œil vigilant qui veille sur les Forces d\'Intervention.',
  },
];

export default function Presentation() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <SectionTitle subtitle="Structure, mission et divisions opérationnelles du Département des Forces d'Intervention au sein de la Fondation SCP.">
          PRÉSENTATION DU DFI
        </SectionTitle>

        {/* History / Mission block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gold-border bg-card p-6 md:p-8 mb-12 relative"
        >
          <div className="absolute top-4 right-4">
            <StampBadge variant="red">CONFIDENTIEL</StampBadge>
          </div>
          <h3 className="font-heading text-sm tracking-[0.2em] uppercase text-accent mb-4">
            HISTOIRE & MISSION
          </h3>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Le Département des Forces d'Intervention (DFI) a été fondé pour répondre à un besoin
              critique de la Fondation SCP : disposer d'une force armée professionnelle, disciplinée
              et spécialisée, capable d'intervenir sur n'importe quel type de menace anomale.
            </p>
            <p>
              Organisé en cinq divisions distinctes, le DFI couvre l'ensemble du spectre opérationnel —
              de l'intervention polyvalente au reconfinement d'urgence, en passant par la neutralisation
              de menaces biologiques et le maintien de l'ordre interne. Chaque division possède sa propre
              chaîne de commandement et ses protocoles spécifiques, tout en restant sous l'autorité
              directe du Général des Forces d'Intervention.
            </p>
            <p>
              Notre devise — <span className="text-accent italic">« Gloire et Honneur »</span> — incarne
              l'engagement total de chaque opérateur envers la mission de la Fondation :
              <span className="text-foreground font-medium"> Sécurisé. Contenir. Protégé.</span>
            </p>
          </div>
        </motion.div>

        {/* Divisions */}
        <h3 className="font-heading text-center text-xs tracking-[0.25em] uppercase text-muted-foreground mb-8">
          ━━ DIVISIONS OPÉRATIONNELLES ━━
        </h3>
        <div className="space-y-4">
          {DIVISIONS.map((div, i) => (
            <DivisionCard key={div.id} {...div} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}