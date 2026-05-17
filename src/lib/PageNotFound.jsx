import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="space-y-2 mb-6">
          <h1 className="font-heading text-6xl text-primary/60 tracking-wider">404</h1>
          <div className="h-px w-16 bg-border mx-auto" />
        </div>
        <h2 className="font-heading text-xl tracking-[0.15em] uppercase text-accent mb-3">
          Zone Inaccessible
        </h2>
        <p className="text-sm text-muted-foreground mb-2">
          Le secteur <span className="font-mono text-foreground">"{location.pathname}"</span> n'existe pas ou votre accréditation est insuffisante.
        </p>
        <div className="stamp text-[10px] text-primary border-primary/50 px-3 py-1 mb-8 inline-block">
          ACCÈS REFUSÉ
        </div>
        <div>
          <button
            onClick={() => (window.location.href = '/')}
            className="inline-flex items-center px-5 py-2.5 text-xs font-heading tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            Retour au QG
          </button>
        </div>
      </div>
    </div>
  );
}