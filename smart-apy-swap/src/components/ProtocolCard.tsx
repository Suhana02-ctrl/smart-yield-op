import { Protocol } from "@/lib/protocols";
import { ArrowUpRight, Shield, AlertTriangle, Zap } from "lucide-react";

interface ProtocolCardProps {
  protocol: Protocol;
  isActive?: boolean;
  isRecommended?: boolean;
  onSelect?: (protocol: Protocol) => void;
}

const riskIcons = {
  low: <Shield className="w-3.5 h-3.5" />,
  medium: <AlertTriangle className="w-3.5 h-3.5" />,
  high: <Zap className="w-3.5 h-3.5" />,
};

const riskColors = {
  low: "text-accent",
  medium: "text-warning",
  high: "text-destructive",
};

export default function ProtocolCard({ protocol, isActive, isRecommended, onSelect }: ProtocolCardProps) {
  return (
    <button
      onClick={() => onSelect?.(protocol)}
      className={`glass-card-hover w-full text-left p-5 relative overflow-hidden group ${
        isActive ? "border-primary/50 shadow-[0_0_30px_-5px_hsl(var(--glow-primary)/0.2)]" : ""
      } ${isRecommended ? "border-accent/50 shadow-[0_0_30px_-5px_hsl(var(--glow-accent)/0.2)]" : ""}`}
    >
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
          Best APY
        </div>
      )}
      {isActive && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
          Active
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{protocol.icon}</span>
          <div>
            <h3 className="font-semibold text-foreground">{protocol.name}</h3>
            <p className="text-xs text-muted-foreground">{protocol.chain} · {protocol.category}</p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">APY</p>
          <p className={`text-lg font-bold font-mono ${isRecommended ? "text-accent glow-accent-text" : "text-primary glow-text"}`}>
            {protocol.apy}%
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">APR</p>
          <p className="text-lg font-bold font-mono text-foreground">{protocol.apr}%</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">TVL</p>
          <p className="text-sm font-mono text-foreground">{protocol.tvl}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
        <span className={riskColors[protocol.risk]}>{riskIcons[protocol.risk]}</span>
        <span className={`text-xs capitalize ${riskColors[protocol.risk]}`}>{protocol.risk} risk</span>
      </div>
    </button>
  );
}
