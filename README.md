# DFI SCiPNET

Application React + Vite pour le Département des Forces d'Intervention.

## Objectif

Ce projet est une application web moderne compatible avec Chrome et Edge. Il peut être cloné et relancé normalement depuis un dépôt GitHub.

## Prérequis

- Node.js 18+ ou version LTS récente
- npm (ou pnpm)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/<votre-utilisateur>/DFI-SCiPNET.git
   ```
2. Placez-vous dans le répertoire du projet :
   ```bash
   cd "DFI SCiPNET"
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Copiez le fichier d’exemple d’environnement :
   ```bash
   cp .env.example .env.local
   ```
5. Remplissez les variables d’environnement nécessaires dans `.env.local`.

## Variables d’environnement

Les variables suivantes sont attendues par le projet :

```env
VITE_BASE44_APP_ID=
VITE_BASE44_APP_BASE_URL=
VITE_BASE44_FUNCTIONS_VERSION=
VITE_BASE44_SERVER_URL=https://base44.app
```

`VITE_BASE44_SERVER_URL` est optionnel : si vous ne le définissez pas, le projet utilise `https://base44.app` par défaut.

> Le projet utilise le SDK `@base44/sdk` pour l’authentification et les accès aux entités. Sans ces variables et sans backend Base44 valide, l’application démarre, mais certaines fonctionnalités peuvent ne pas fonctionner correctement.

## Commandes

- `npm run dev` : démarre le serveur de développement
- `npm run build` : génère la version de production
- `npm run preview` : prévisualise le build de production
- `npm run lint` : vérifie le code avec ESLint
- `npm run typecheck` : vérifie les types avec TypeScript via `jsconfig.json`

## Compatibilité navigateurs

Le projet est configuré pour les navigateurs modernes, en particulier Chrome et Edge, avec une cible de build `es2022`.

## Notes GitHub

- `.gitignore` exclut déjà `node_modules`, `dist`, et les fichiers `.env`
- Le build Vite est configuré avec `base: './'` pour fonctionner également sur GitHub Pages ou un sous-dossier de site.
- Un workflow GitHub Actions est ajouté dans `.github/workflows/deploy-docs.yml` pour reconstruire et mettre à jour `docs/` automatiquement à chaque push sur `main`.
- Ajoutez vos secrets dans `.env.local` et ne les commitez pas
