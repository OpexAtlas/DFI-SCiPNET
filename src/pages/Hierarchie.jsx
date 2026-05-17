import React from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import GradeCard from '../components/hierarchie/GradeCard';
import StampBadge from '../components/ui/StampBadge';

const GRADES = {
  etat_major: {
    label: 'État-Major',
    icon: '🔺',
    grades: [
      { name: 'Général(e) des Forces d\'Intervention', description: 'Commandement suprême du DFI. Autorité absolue sur l\'ensemble des divisions et opérations. Répond directement au Conseil O5.' },
      { name: 'Colonel des Forces d\'Intervention', description: 'Second du Général, supervise les opérations stratégiques et coordonne les différentes divisions.' },
      { name: 'Secrétaire Général(e) à la Défense', description: 'Responsable de l\'administration et de la logistique du Département. Gère les ressources et la planification.' },
      { name: 'Sous-Secrétaire Général(e) à la Défense', description: 'Assiste le Secrétaire Général dans ses fonctions administratives et logistiques.' },
    ],
  },
  officiers: {
    label: 'Corps des Officiers',
    icon: '🔹',
    grades: [
      { name: 'Lieutenant(e)-Colonel', description: 'Commande des opérations majeures et supervise plusieurs unités tactiques simultanément.' },
      { name: 'Commandant(e)', description: 'Dirige une unité opérationnelle complète. Responsable de la planification et de l\'exécution des missions.' },
      { name: 'Capitaine', description: 'Commande une compagnie ou un détachement spécialisé. Interface entre l\'État-Major et les officiers de terrain.' },
      { name: 'Lieutenant(e)', description: 'Premier grade d\'officier. Commande une section et dirige les opérations tactiques sur le terrain.' },
    ],
  },
  sous_officiers: {
    label: 'Corps des Sous-Officiers',
    icon: '🔸',
    grades: [
      { name: 'Major', description: 'Grade le plus élevé des sous-officiers. Conseiller technique du commandement et référent de son unité.' },
      { name: 'Adjudant-Chef/fe', description: 'Sous-officier supérieur responsable de la formation et de l\'encadrement des troupes.' },
      { name: 'Adjudant(e)', description: 'Encadre les opérateurs et veille à l\'application des protocoles opérationnels sur le terrain.' },
    ],
  },
  hommes_du_rang: {
    label: 'Corps des Hommes du Rang',
    icon: '⬜',
    grades: [
      { name: 'Brigadier-Chef/fe', description: 'Opérateur expérimenté pouvant diriger un binôme tactique lors d\'interventions.' },
      { name: 'Brigadier', description: 'Opérateur confirmé ayant prouvé ses capacités sur le terrain lors de multiples missions.' },
      { name: '1ère Classe', description: 'Rang d\'entrée au sein du DFI. Opérateur en formation initiale et intégration aux procédures.' },
    ],
  },
};

export default function Hierarchie() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionTitle subtitle="Structure pyramidale de commandement du Département des Forces d'Intervention, organisée en quatre corps distincts.">
          HIÉRARCHIE & GRADES
        </SectionTitle>

        <div className="text-center mb-10">
          <StampBadge variant="red">DOCUMENT INTERNE — DIFFUSION RESTREINTE</StampBadge>
        </div>

        <div className="space-y-10">
          {Object.entries(GRADES).map(([corpsKey, corps]) => {
            let idx = 0;
            return (
              <div key={corpsKey}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">{corps.icon}</span>
                  <h3 className="font-heading text-sm tracking-[0.2em] uppercase text-accent">
                    {corps.label}
                  </h3>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-2 ml-2">
                  {corps.grades.map((grade) => (
                    <GradeCard
                      key={grade.name}
                      name={grade.name}
                      description={grade.description}
                      corps={corpsKey}
                      index={idx++}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}