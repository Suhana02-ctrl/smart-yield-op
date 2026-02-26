import mongoose from 'mongoose';

// Protocol Schema - Stores APY/APR data for each protocol
const protocolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ['Aave', 'Compound', 'Yearn', 'Beefy'],
      unique: true,
      description: 'Name of the DeFi protocol',
    },
    assets: {
      type: Map,
      of: Number,
      description: 'Asset -> APY mapping (e.g., {USDC: 5.2, DAI: 4.8})',
    },
    description: {
      type: String,
      description: 'Brief description of the protocol',
    },
    url: {
      type: String,
      description: 'Protocol website URL',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      description: 'Last time APY data was fetched',
    },
    dataSource: {
      type: String,
      description: 'API or data source used (e.g., "api.aave.com")',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Protocol', protocolSchema);
