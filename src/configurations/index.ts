import {LogLevel} from 'warp-contracts';
import type {JWKInterface} from 'warp-contracts';
import {readFileSync} from 'fs';

type Environment = 'development' | 'production' | 'test';
type Mode = 'local' | 'kube';

interface Config {
  readonly LOG_LEVEL: LogLevel;
  readonly NODE_ENV: Environment;
  readonly MODE: 'local' | 'kube';
  readonly USE_BUNDLR_NETWORK: boolean;
  readonly ARWEAVE_WALLET?: JWKInterface;
  readonly CONTRACT_TX_ID?: string;
}

export const config: Config = {
  LOG_LEVEL: (process.env.LOG_LEVEL || 'debug') as LogLevel,
  NODE_ENV: (process.env.NODE_ENV || 'development') as Environment,
  USE_BUNDLR_NETWORK: (process.env.USE_BUNDLR_NETWORK || false) as boolean,
  MODE: (process.env.MODE || 'local') as Mode,
  ARWEAVE_WALLET: getWallet(),
  CONTRACT_TX_ID: process.argv[2],
};

function getWallet() {
  const mode = (process.env.MODE || 'local') as Mode;

  if (mode === 'local') {
    return JSON.parse(
      readFileSync('./src/secrets/wallet.json').toString()
    ) as JWKInterface;
  }

  if (mode === 'kube') {
    return JSON.parse(
      readFileSync('/run/secrets/wallet.json').toString()
    ) as JWKInterface;
  }

  throw new Error('Invalid mode.');
}

function getContractTxId() {
  const mode = (process.env.MODE || 'local') as Mode;

  if (mode === 'local') {
    return process.argv[2];
  }

  if (mode === 'kube') {
    return process.env.CONTRACT_TX_ID;
  }

  throw new Error('Invalid mode.');
}
