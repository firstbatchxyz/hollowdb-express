import {LogLevel} from 'warp-contracts';
import type {JWKInterface} from 'warp-contracts';

type Environment = 'development' | 'production' | 'test';

interface Config {
  readonly LOG_LEVEL: LogLevel;
  readonly NODE_ENV: Environment;
  // readonly USE_BUNDLR_NETWORK: boolean;
  ARWEAVE_WALLET?: JWKInterface;
  CONTRACT_TX_ID?: string;
}

export const config: Config = {
  LOG_LEVEL: (process.env.LOG_LEVEL || 'debug') as LogLevel,
  NODE_ENV: (process.env.NODE_ENV || 'development') as Environment,
  // USE_BUNDLR_NETWORK: (process.env.USE_BUNDLR_NETWORK || false) as boolean,
};
