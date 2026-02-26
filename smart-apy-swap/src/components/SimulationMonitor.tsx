import { Investment, Protocol, SwitchEvent } from "@/lib/protocols";
import { Activity, ArrowRightLeft, TrendingUp, Coins, Pause, Play } from "lucide-react";

interface SimulationMonitorProps {
  investment: Investment | null;
  protocols: Protocol[];
  switchEvents: SwitchEvent[];
  isSimulating: boolean;
  onToggleSimulation: () => void;
  totalRewards: number;
}

export default function SimulationMonitor({
  investment,
  protocols,
  switchEvents,
  isSimulating,
  onToggleSimulation,
  totalRewards,
}: SimulationMonitorProps) {
  const activeProtocol = investment ? protocols.find((p) => p.id === investment.protocolId) : null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">CRE Simulation Monitor</h2>
        </div>
        {investment && (
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSimulating
                ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                : "bg-accent/20 text-accent hover:bg-accent/30"
            }`}
          >
            {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isSimulating ? "Pause" : "Resume"}
          </button>
        )}
      </div>

      {!investment ? (
        <div className="text-center py-12 text-muted-foreground">
          <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No active investment</p>
          <p className="text-xs mt-1">Deposit to start CRE monitoring</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Active Position */}
          <div className="bg-secondary/30 rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Active Position</p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{activeProtocol?.icon}</span>
              <div>
                <p className="font-semibold">{activeProtocol?.name}</p>
                <p className="text-xs text-muted-foreground">{activeProtocol?.chain}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-bold font-mono text-primary glow-text">{activeProtocol?.apy}% APY</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Invested</p>
                <p className="font-mono font-bold text-foreground">
                  {investment.amount.toLocaleString()} {investment.asset}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Rewards</p>
                <p className="font-mono font-bold text-accent glow-accent-text">
                  +{investment.rewards.toFixed(4)} {investment.asset}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <ArrowRightLeft className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold font-mono">{switchEvents.length}</p>
              <p className="text-[10px] text-muted-foreground">Switches</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <Coins className="w-4 h-4 mx-auto mb-1 text-accent" />
              <p className="text-lg font-bold font-mono text-accent">{totalRewards.toFixed(4)}</p>
              <p className="text-[10px] text-muted-foreground">Total Rewards</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 text-center">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold font-mono">{activeProtocol?.apy}%</p>
              <p className="text-[10px] text-muted-foreground">Current APY</p>
            </div>
          </div>

          {/* Status indicator */}
          {isSimulating && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              CRE monitoring protocols every 5 seconds...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
