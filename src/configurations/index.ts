import {LogLevel} from 'warp-contracts';
import type {JWKInterface} from 'warp-contracts';
import type {HollowDBState} from 'hollowdb';
import verKey from './verkey.json'; // TODO: really needed?
import arWallet from './wallet.json';

type Environment = 'development' | 'production' | 'test';

interface Config {
  readonly LOG_LEVEL: LogLevel;
  readonly NODE_ENV: Environment;
  CONTRACT_TX_ID: string;
  // readonly USE_BUNDLR_NETWORK: boolean;
  readonly VERIFICATION_KEY: HollowDBState['verificationKey'];
  readonly ARWEAVE_WALLET: JWKInterface;
}

// const CONTRACT_TX_ID = process.argv[2] as string | undefined;

// const USE_BUNDLR_NETWORK = process.env.USE_BUNDLR_NETWORK as
//   | boolean
//   | undefined;

export const config: Config = {
  LOG_LEVEL: (process.env.LOG_LEVEL || 'debug') as LogLevel,
  NODE_ENV: (process.env.NODE_ENV || 'development') as Environment,
  // USE_BUNDLR_NETWORK: USE_BUNDLR_NETWORK || false,
  VERIFICATION_KEY: verKey as HollowDBState['verificationKey'],
  ARWEAVE_WALLET: arWallet as JWKInterface,
  CONTRACT_TX_ID: '', // will be set by server launch
};
