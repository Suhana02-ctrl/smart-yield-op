export interface Protocol {
  id: string;
  name: string;
  icon: string;
  chain: string;
  apy: number;
  apr: number;
  tvl: string;
  risk: "low" | "medium" | "high";
  category: string;
  color: string;
}

export interface Investment {
  protocolId: string;
  amount: number;
  asset: string;
  depositedAt: Date;
  rewards: number;
}

export interface SwitchEvent {
  id: string;
  fromProtocol: string;
  toProtocol: string;
  amount: number;
  rewardsClaimed: number;
  reason: string;
  timestamp: Date;
  fromApy: number;
  toApy: number;
}

export const PROTOCOLS: Protocol[] = [
  {
    id: "aave-v3",
    name: "Aave V3",
    icon: "🔷",
    chain: "Ethereum",
    apy: 5.82,
    apr: 5.65,
    tvl: "$12.4B",
    risk: "low",
    category: "Lending",
    color: "hsl(186, 100%, 50%)",
  },
  {
    id: "compound-v3",
    name: "Compound V3",
    icon: "🟢",
    chain: "Ethereum",
    apy: 4.91,
    apr: 4.80,
    tvl: "$3.2B",
    risk: "low",
    category: "Lending",
    color: "hsl(160, 84%, 45%)",
  },
  {
    id: "lido",
    name: "Lido",
    icon: "🔵",
    chain: "Ethereum",
    apy: 3.95,
    apr: 3.88,
    tvl: "$33.1B",
    risk: "low",
    category: "Staking",
    color: "hsl(210, 100%, 60%)",
  },
  {
    id: "curve-3pool",
    name: "Curve 3Pool",
    icon: "🔴",
    chain: "Ethereum",
    apy: 6.23,
    apr: 6.05,
    tvl: "$1.8B",
    risk: "medium",
    category: "DEX LP",
    color: "hsl(0, 72%, 51%)",
  },
  {
    id: "yearn-v3",
    name: "Yearn V3",
    icon: "💎",
    chain: "Ethereum",
    apy: 7.15,
    apr: 6.90,
    tvl: "$450M",
    risk: "medium",
    category: "Yield Aggregator",
    color: "hsl(260, 80%, 60%)",
  },
];

export const ASSETS = ["USDC", "USDT", "DAI", "ETH", "WBTC"];

export function getBestProtocol(protocols: Protocol[], currentId?: string): Protocol {
  return protocols
    .filter((p) => p.id !== currentId)
    .sort((a, b) => b.apy - a.apy)[0];
}

export function simulateApyFluctuation(protocols: Protocol[]): Protocol[] {
  return protocols.map((p) => {
    const change = (Math.random() - 0.5) * 1.5;
    const newApy = Math.max(0.5, p.apy + change);
    const newApr = newApy * 0.97;
    return { ...p, apy: parseFloat(newApy.toFixed(2)), apr: parseFloat(newApr.toFixed(2)) };
  });
}
