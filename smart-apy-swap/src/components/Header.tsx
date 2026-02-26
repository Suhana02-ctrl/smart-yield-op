import { Link2 } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-primary glow-text">CRE</span>{" "}
              <span className="text-foreground">Yield Optimizer</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Powered by Chainlink Runtime Environment
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-muted-foreground font-mono">Simulation Mode</span>
        </div>
      </div>
    </header>
  );
}
