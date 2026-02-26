/**
 * SimulationRunner Component
 * Handles running the DeFi yield optimization simulation in AUTO mode
 * Automatically switches to higher APY protocols and shows history
 */

import React, { useState, useRef, useEffect } from 'react';
import { runSimulation } from '../lib/api';

interface SimulationResult {
  protocol: string;
  apy: number;
  rewards: number;
  previousProtocol: string;
  walletAddress?: string;
}

interface SwitchHistory {
  id: string;
  timestamp: Date;
  fromProtocol: string;
  toProtocol: string;
  rewards: number;
}

interface SimulationRunnerProps {
  walletAddress: string | null;
  onSimulationComplete: (result: SimulationResult) => void;
  onAutoOptimizationStart?: () => void;
  onAutoOptimizationStop?: () => void;
}

export default function SimulationRunner({
  walletAddress,
  onSimulationComplete,
  onAutoOptimizationStart,
  onAutoOptimizationStop,
}: SimulationRunnerProps) {
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [switchHistory, setSwitchHistory] = useState<SwitchHistory[]>([]);
  const [switchCount, setSwitchCount] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastProtocol, setLastProtocol] = useState<string | null>(null);

  // Run simulation once when in auto mode
  const runAutoSimulation = async () => {
    if (!walletAddress) {
      setError('Wallet disconnected. Stopping auto-optimization.');
      setIsAutoRunning(false);
      return;
    }

    try {
      setError(null);
      console.log('⏱️ Auto-simulation running...');
      const simulationResult = await runSimulation(walletAddress);

      // Check if protocol changed
      if (lastProtocol && lastProtocol !== simulationResult.protocol) {
        // Protocol switched!
        const switchEvent: SwitchHistory = {
          id: `switch-${Date.now()}`,
          timestamp: new Date(),
          fromProtocol: simulationResult.previousProtocol,
          toProtocol: simulationResult.protocol,
          rewards: simulationResult.rewards,
        };

        setSwitchHistory((prev) => [switchEvent, ...prev]);
        setSwitchCount((prev) => prev + 1);
        setTotalRewards((prev) => prev + simulationResult.rewards);

        console.log(`✓ AUTO-SWITCHED: ${simulationResult.previousProtocol} → ${simulationResult.protocol}`);
        onSimulationComplete(simulationResult);
      }

      // Update last protocol
      setLastProtocol(simulationResult.protocol);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Simulation failed';
      console.error('Auto-simulation error:', errorMessage);
      // Don't stop on error, keep trying
    }
  };

  // Start auto-optimization
  const handleStartAutoOptimization = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setError(null);
    setSwitchHistory([]);
    setSwitchCount(0);
    setTotalRewards(0);
    setLastProtocol(null);

    // Run first simulation immediately
    await runAutoSimulation();

    // Then run every 15 seconds
    setIsAutoRunning(true);
    onAutoOptimizationStart?.();
    autoIntervalRef.current = setInterval(() => {
      runAutoSimulation();
    }, 15000); // 15 seconds

    console.log('🚀 Auto-Optimization Started!');
  };

  // Stop auto-optimization
  const handleStopAutoOptimization = () => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
    setIsAutoRunning(false);
    onAutoOptimizationStop?.();
    console.log('⏹️ Auto-Optimization Stopped');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, []);

  const resetHistory = () => {
    setSwitchHistory([]);
    setSwitchCount(0);
    setTotalRewards(0);
    setLastProtocol(null);
    setError(null);
  };

  return (
    <div className="simulation-runner">
      {!isAutoRunning ? (
        <div className="simulation-start">
          <h3>Auto Yield Optimization</h3>
          <p>Automatically switch to better APY protocols</p>

          <button
            onClick={handleStartAutoOptimization}
            disabled={!walletAddress}
            className="btn-start-auto"
          >
            {walletAddress ? 'Start Auto-Optimization' : 'Connect Wallet First'}
          </button>

          {error && <div className="simulation-error">{error}</div>}

          {!walletAddress && (
            <div className="simulation-warning">
              ⚠ Please connect your wallet first
            </div>
          )}
        </div>
      ) : (
        <div className="simulation-running">
          <div className="running-header">
            <span className="pulse-dot"></span>
            <h3>Auto-Optimization Running</h3>
            <button onClick={handleStopAutoOptimization} className="btn-stop">
              Stop
            </button>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Automatic Switches</span>
              <span className="stat-value">{switchCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Rewards Earned</span>
              <span className="stat-value">${totalRewards.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className="stat-value checking">Checking every 15s...</span>
            </div>
          </div>

          {error && <div className="simulation-error">{error}</div>}

          {/* Switch History */}
          {switchHistory.length > 0 && (
            <div className="switch-history">
              <h4>📋 Switch History</h4>
              <div className="history-list">
                {switchHistory.map((switchEvent) => (
                  <div key={switchEvent.id} className="history-item">
                    <div className="history-time">
                      {switchEvent.timestamp.toLocaleTimeString()}
                    </div>
                    <div className="history-switch">
                      <span className="from-protocol">{switchEvent.fromProtocol}</span>
                      <span className="arrow">→</span>
                      <span className="to-protocol">{switchEvent.toProtocol}</span>
                    </div>
                    <div className="history-rewards">
                      +${switchEvent.rewards.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleStopAutoOptimization} className="btn-stop-bottom">
            Stop Auto-Optimization
          </button>
        </div>
      )}

      <style jsx>{`
        .simulation-runner {
          padding: 24px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
          margin-top: 20px;
        }

        .simulation-start {
          text-align: center;
        }

        .simulation-start h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #1f2937;
        }

        .simulation-start p {
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 20px 0;
        }

        .btn-start-auto {
          padding: 12px 32px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 16px;
        }

        .btn-start-auto:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .btn-start-auto:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Auto Running State */
        .simulation-running {
          background: linear-gradient(135deg, #f0fdf4 0%, #f7fcf5 100%);
          padding: 20px;
          border-radius: 8px;
          border: 2px solid #86efac;
        }

        .running-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        .running-header h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
          color: #059669;
          flex: 1;
        }

        .btn-stop {
          padding: 8px 16px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-stop:hover {
          background: #dc2626;
        }

        /* Stats Grid */
        .stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-item {
          background: white;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #10b981;
        }

        .stat-value.checking {
          font-size: 13px;
          color: #f59e0b;
        }

        /* Switch History */
        .switch-history {
          background: white;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          border: 1px solid #e5e7eb;
        }

        .switch-history h4 {
          font-size: 14px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #1f2937;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 300px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f9fafb;
          border-radius: 6px;
          border-left: 4px solid #10b981;
        }

        .history-time {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          min-width: 60px;
          font-family: 'Courier New', monospace;
        }

        .history-switch {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .from-protocol {
          background: #fee2e2;
          color: #dc2626;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .arrow {
          color: #10b981;
          font-size: 18px;
        }

        .to-protocol {
          background: #dcfce7;
          color: #059669;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .history-rewards {
          font-size: 14px;
          font-weight: 700;
          color: #10b981;
          min-width: 70px;
          text-align: right;
        }

        .btn-stop-bottom {
          width: 100%;
          padding: 12px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-stop-bottom:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .simulation-error {
          color: #dc2626;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          margin-top: 12px;
        }

        .simulation-warning {
          color: #92400e;
          background: #fef3c7;
          border: 1px solid #fcd34d;
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
          margin-top: 12px;
        }

        @media (max-width: 640px) {
          .stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
