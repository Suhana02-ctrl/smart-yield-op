// ============================================================================
// EXAMPLE: How to Update Components to Use REAL APY Data
// ============================================================================

// Before: Using Hardcoded Mock Data
// ─────────────────────────────────────────────────────────────────────────
// OLD CODE (Don't use this anymore)
/*
import { PROTOCOLS } from '../lib/protocols'; // Hardcoded mock data

export default function OldProtocolCard() {
  return (
    <div>
      {PROTOCOLS.map(protocol => (
        <div key={protocol.id}>
          <h3>{protocol.name}</h3>
          <p>APY: {protocol.apy}%</p> {/* This is hardcoded! */}
        </div>
      ))}
    </div>
  );
}
*/

// ============================================================================
// AFTER: Using REAL APY Data from DefiLlama
// ============================================================================

import { useState, useEffect } from 'react';
import { fetchRealProtocols, fetchProtocolsForAsset } from '../lib/api';

interface Protocol {
  id: string;
  name: string;
  chain: string;
  apy: number;
  tvl: string;
  symbol: string;
}

// ─────────────────────────────────────────────────────────────────────────
// EXAMPLE 1: Simple Protocol List with Real APY
// ─────────────────────────────────────────────────────────────────────────

export function ProtocolListWithRealAPY() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Fetch REAL data from backend/DefiLlama
        const realProtocols = await fetchRealProtocols(10, 'Ethereum');
        setProtocols(realProtocols);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch protocols');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading real APY data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="protocols-grid">
      <h2>Top DeFi Protocols (REAL APY from DefiLlama)</h2>
      {protocols.map(protocol => (
        <div key={protocol.id} className="protocol-card">
          <h3>{protocol.name}</h3>
          <p className="apy">
            <strong>APY: {protocol.apy}%</strong> ✅ REAL DATA
          </p>
          <p>TVL: {protocol.tvl}</p>
          <p>Asset: {protocol.symbol}</p>
          <p>Chain: {protocol.chain}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// EXAMPLE 2: Protocols for Specific Asset (e.g., USDC)
// ─────────────────────────────────────────────────────────────────────────

interface ProtocolsForAssetProps {
  asset: string; // e.g., 'USDC', 'DAI', 'ETH'
}

export function ProtocolsForAsset({ asset }: ProtocolsForAssetProps) {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Fetch protocols that support this specific asset
        const assetProtocols = await fetchProtocolsForAsset(asset);
        setProtocols(assetProtocols);
      } catch (err) {
        console.error(`Failed to fetch protocols for ${asset}:`, err);
      } finally {
        setLoading(false);
      }
    })();
  }, [asset]);

  if (loading) return <div>Loading {asset} protocols...</div>;

  return (
    <div>
      <h3>Best {asset} Yields (REAL DATA)</h3>
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Protocol</th>
              <th>APY</th>
              <th>TVL</th>
              <th>Chain</th>
            </tr>
          </thead>
          <tbody>
            {protocols.map(protocol => (
              <tr key={protocol.id}>
                <td>{protocol.name}</td>
                <td style={{ fontWeight: 'bold', color: '#00ff00' }}>
                  {protocol.apy}% ← REAL
                </td>
                <td>{protocol.tvl}</td>
                <td>{protocol.chain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// EXAMPLE 3: Best Protocol Selector with Real Data
// ─────────────────────────────────────────────────────────────────────────

export function BestProtocolSelector() {
  const [bestProtocol, setBestProtocol] = useState<Protocol | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshBestProtocol = async () => {
    try {
      setRefreshing(true);
      const protocols = await fetchRealProtocols(1, 'Ethereum');
      if (protocols.length > 0) {
        setBestProtocol(protocols[0]);
      }
    } catch (err) {
      console.error('Failed to fetch best protocol:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshBestProtocol();
  }, []);

  if (!bestProtocol) return <div>Loading best protocol...</div>;

  return (
    <div className="best-protocol-card">
      <h2>🏆 Best Yield Right Now</h2>
      <div className="protocol-highlight">
        <h3>{bestProtocol.name}</h3>
        <div className="apy-highlight">
          <span className="label">APY:</span>
          <span className="value">{bestProtocol.apy}%</span>
          <span className="badge">✅ LIVE DATA</span>
        </div>
        <p>TVL: {bestProtocol.tvl}</p>
        <p>Chain: {bestProtocol.chain}</p>
        <button onClick={refreshBestProtocol} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
        <p style={{ fontSize: '0.8em', marginTop: '10px' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// EXAMPLE 4: Protocol Comparison Tool
// ─────────────────────────────────────────────────────────────────────────

export function ProtocolComparison() {
  const [usdcProtocols, setUsdcProtocols] = useState<Protocol[]>([]);
  const [daiProtocols, setDaiProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [usdc, dai] = await Promise.all([
          fetchProtocolsForAsset('USDC'),
          fetchProtocolsForAsset('DAI'),
        ]);
        setUsdcProtocols(usdc);
        setDaiProtocols(dai);
      } catch (err) {
        console.error('Failed to fetch protocols:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading protocols...</div>;

  const bestUsdc = usdcProtocols[0];
  const bestDai = daiProtocols[0];

  return (
    <div className="comparison-grid">
      <div className="card">
        <h3>Best USDC Yield</h3>
        {bestUsdc ? (
          <>
            <p className="protocol-name">{bestUsdc.name}</p>
            <p className="apy">{bestUsdc.apy}% APY</p>
            <p className="tvl">{bestUsdc.tvl} TVL</p>
          </>
        ) : (
          <p>No protocols found</p>
        )}
      </div>

      <div className="card">
        <h3>Best DAI Yield</h3>
        {bestDai ? (
          <>
            <p className="protocol-name">{bestDai.name}</p>
            <p className="apy">{bestDai.apy}% APY</p>
            <p className="tvl">{bestDai.tvl} TVL</p>
          </>
        ) : (
          <p>No protocols found</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// EXAMPLE 5: Auto-Refresh Protocol Data Every 5 Minutes
// ─────────────────────────────────────────────────────────────────────────

export function RealTimeProtocolMonitor() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchProtocols = async () => {
      try {
        const data = await fetchRealProtocols(5, 'Ethereum');
        setProtocols(data);
        setLastUpdated(new Date());
        console.log('✓ Protocols updated at', new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Failed to fetch protocols:', err);
      }
    };

    fetchProtocols();

    // Auto-refresh every 5 minutes if enabled
    if (!autoRefresh) return;

    const interval = setInterval(fetchProtocols, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="monitor">
      <div className="header">
        <h2>Real-Time Protocol Monitor</h2>
        <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
        <label>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={e => setAutoRefresh(e.target.checked)}
          />
          Auto-refresh every 5 minutes
        </label>
      </div>

      <div className="protocols">
        {protocols.map(protocol => (
          <div key={protocol.id} className="protocol-item">
            <span className="name">{protocol.name}</span>
            <span className="apy">{protocol.apy}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SUMMARY: Key Changes
// ─────────────────────────────────────────────────────────────────────────
/*
BEFORE:
  import { PROTOCOLS } from './lib/protocols'
  const apy = PROTOCOLS[0].apy  // Hardcoded: 5.82

AFTER:
  import { fetchRealProtocols } from './lib/api'
  const protocols = await fetchRealProtocols(10)
  const apy = protocols[0].apy  // REAL: 5.82 (from DefiLlama API)

BENEFITS:
  ✅ Real, live APY data
  ✅ Automatic updates
  ✅ No more stale hardcoded values
  ✅ Type-safe with TypeScript
  ✅ Error handling built-in
  ✅ Fast API responses (cached/optimized)
*/
