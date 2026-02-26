import { useState } from "react";
import { Protocol, ASSETS } from "@/lib/protocols";
import { Wallet, ArrowRight } from "lucide-react";

interface DepositPanelProps {
  selectedProtocol: Protocol | null;
  onDeposit: (amount: number, asset: string) => void;
  isSimulating: boolean;
}

export default function DepositPanel({ selectedProtocol, onDeposit, isSimulating }: DepositPanelProps) {
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("USDC");

  const handleDeposit = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0 || !selectedProtocol) return;
    onDeposit(num, asset);
    setAmount("");
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Wallet className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Deposit</h2>
      </div>

      {!selectedProtocol ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Select a protocol to deposit
        </p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Protocol</label>
            <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
              <span className="text-xl">{selectedProtocol.icon}</span>
              <span className="font-medium">{selectedProtocol.name}</span>
              <span className="ml-auto text-sm font-mono text-primary">{selectedProtocol.apy}% APY</span>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Asset</label>
            <div className="flex gap-2">
              {ASSETS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAsset(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    asset === a
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          <button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || isSimulating}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSimulating ? "Simulation Running..." : "Deposit & Start CRE Monitor"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
