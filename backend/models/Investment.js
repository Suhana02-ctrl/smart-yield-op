import mongoose from 'mongoose';

// Investment Schema
const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      description: 'User wallet address or ID',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      description: 'Investment amount in tokens',
    },
    asset: {
      type: String,
      required: true,
      enum: ['USDC', 'USDT', 'DAI', 'ETH', 'WETH'],
      description: 'Type of asset being invested',
    },
    selectedProtocol: {
      type: String,
      required: true,
      enum: ['Aave', 'Compound', 'Yearn', 'Beefy'],
      description: 'DeFi protocol chosen for investment',
    },
    apy: {
      type: Number,
      required: true,
      description: 'APY percentage at time of investment',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'withdrawn'],
      default: 'active',
      description: 'Current status of the investment',
    },
    investedAt: {
      type: Date,
      default: Date.now,
      description: 'Timestamp when investment was made',
    },
    lastMonitoredAt: {
      type: Date,
      default: Date.now,
      description: 'Last time APY was checked',
    },
    beaterProtocol: {
      type: String,
      description: 'Protocol with better APY (if any)',
    },
    notes: {
      type: String,
      description: 'Any additional notes',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default mongoose.model('Investment', investmentSchema);
