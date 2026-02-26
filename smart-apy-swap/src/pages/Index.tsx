import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import ProtocolCard from "@/components/ProtocolCard";
import DepositPanel from "@/components/DepositPanel";
import SimulationMonitor from "@/components/SimulationMonitor";
import ActivityLog from "@/components/ActivityLog";
import WalletConnect from "@/components/WalletConnect";
import SimulationRunner from "@/components/SimulationRunner";
import {
  PROTOCOLS,
  Protocol,
  Investment,
  SwitchEvent,
  getBestProtocol,
  simulateApyFluctuation,
} from "@/lib/protocols";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [protocols, setProtocols] = useState<Protocol[]>(PROTOCOLS);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [switchEvents, setSwitchEvents] = useState<SwitchEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalRewards, setTotalRewards] = useState(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentAutoProtocol, setCurrentAutoProtocol] = useState<string>("Aave");
  const [autoRewards, setAutoRewards] = useState(0);
  const [isAutoOptimizing, setIsAutoOptimizing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recommended = getBestProtocol(protocols);

  const handleDeposit = (amount: number, asset: string) => {
    if (!selectedProtocol) return;
    setInvestment({
      protocolId: selectedProtocol.id,
      amount,
      asset,
      depositedAt: new Date(),
      rewards: 0,
    });
    setIsSimulating(true);
  };

  const handleToggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    console.log("🔗 Wallet connected:", address);
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    console.log("🔗 Wallet disconnected");
  };

  const handleSimulationComplete = (result: any) => {
    // Update UI with simulation results from backend
    console.log("✓ Backend simulation completed:", result);
    
    // Update auto-optimization state
    setCurrentAutoProtocol(result.protocol);
    setAutoRewards((prev) => prev + result.rewards);
    
    // Add event to activity log
    setSwitchEvents((events) => [
      ...events,
      {
        id: `simulation-${Date.now()}`,
        fromProtocol: result.previousProtocol,
        toProtocol: result.protocol,
        amount: investment?.amount || 10000, // Default $10k for auto-opt
        rewardsClaimed: result.rewards,
        reason: "Automated yield optimization",
        timestamp: new Date(),
        fromApy: 0,
        toApy: 0,
      },
    ]);
    
    setTotalRewards((prev) => prev + result.rewards);
  };

  // CRE Simulation loop
  const runSimulationTick = useCallback(() => {
    setProtocols((prev) => {
      const updated = simulateApyFluctuation(prev);

      setInvestment((inv) => {
        if (!inv) return inv;

        const currentProtocol = updated.find((p) => p.id === inv.protocolId);
        const best = getBestProtocol(updated);

        // Accrue rewards
        const rewardRate = (currentProtocol?.apy || 0) / 100 / (365 * 24 * 720); // per 5s
        const newRewards = inv.rewards + inv.amount * rewardRate;

        // Check if switch is beneficial (>0.5% APY improvement)
        if (best && currentProtocol && best.apy > currentProtocol.apy + 0.5 && best.id !== inv.protocolId) {
          const claimedRewards = newRewards;

          setSwitchEvents((events) => [
            ...events,
            {
              id: `switch-${Date.now()}`,
              fromProtocol: currentProtocol.name,
              toProtocol: best.name,
              amount: inv.amount,
              rewardsClaimed: claimedRewards,
              reason: `${best.name} APY (${best.apy}%) is ${(best.apy - currentProtocol.apy).toFixed(2)}% higher than ${currentProtocol.name} (${currentProtocol.apy}%)`,
              timestamp: new Date(),
              fromApy: currentProtocol.apy,
              toApy: best.apy,
            },
          ]);

          setTotalRewards((prev) => prev + claimedRewards);

          return {
            ...inv,
            protocolId: best.id,
            rewards: 0,
            depositedAt: new Date(),
          };
        }

        return { ...inv, rewards: newRewards };
      });

      return updated;
    });
  }, []);

  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(runSimulationTick, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSimulating, runSimulationTick]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary font-medium">Auto Yield Optimization</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">
            Maximize your DeFi returns with{" "}
            <span className="text-primary glow-text">CRE</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Deposit your assets and let Chainlink CRE automatically monitor and switch between the top 5 DeFi protocols to maximize your yield. Rewards are claimed and held in your wallet on every switch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Protocols */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Top 5 Protocols</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {protocols.map((protocol) => (
                  <ProtocolCard
                    key={protocol.id}
                    protocol={protocol}
                    isActive={investment?.protocolId === protocol.id}
                    isRecommended={recommended.id === protocol.id && !investment}
                    onSelect={setSelectedProtocol}
                  />
                ))}
              </div>
            </div>

            <ActivityLog events={switchEvents} />
          </div>

          {/* Right: Actions & Monitor */}
          <div className="space-y-6">
            <WalletConnect 
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
            />
            <DepositPanel
              selectedProtocol={selectedProtocol}
              onDeposit={handleDeposit}
              isSimulating={isSimulating}
            />
            <SimulationRunner
              walletAddress={walletAddress}
              onSimulationComplete={handleSimulationComplete}
              onAutoOptimizationStart={() => setIsAutoOptimizing(true)}
              onAutoOptimizationStop={() => setIsAutoOptimizing(false)}
            />
            <SimulationMonitor
              investment={isAutoOptimizing ? {
                protocolId: currentAutoProtocol.toLowerCase(),
                amount: 10000, // Virtual amount for auto-optimization
                asset: "USD",
                depositedAt: new Date(),
                rewards: autoRewards,
              } : investment}
              protocols={protocols}
              switchEvents={switchEvents}
              isSimulating={isAutoOptimizing || isSimulating}
              onToggleSimulation={handleToggleSimulation}
              totalRewards={isAutoOptimizing ? autoRewards : totalRewards}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
