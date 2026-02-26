import { SwitchEvent } from "@/lib/protocols";
import { ArrowRightLeft, Clock } from "lucide-react";

interface ActivityLogProps {
  events: SwitchEvent[];
}

export default function ActivityLog({ events }: ActivityLogProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Switch History</h2>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No switches yet. CRE will auto-switch when a better APY is found.
        </p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {[...events].reverse().map((event) => (
            <div key={event.id} className="bg-secondary/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium">Auto Switch</span>
                <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                  {event.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{event.fromProtocol}</span>
                <span className="text-muted-foreground font-mono text-xs">{event.fromApy}%</span>
                <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium text-accent">{event.toProtocol}</span>
                <span className="text-accent font-mono text-xs">{event.toApy}%</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Moved: <span className="text-foreground font-mono">{event.amount.toLocaleString()}</span></span>
                <span>Rewards claimed: <span className="text-accent font-mono">+{event.rewardsClaimed.toFixed(4)}</span></span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 italic">{event.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
