import {LogLevel} from 'warp-contracts';
import type {JWKInterface} from 'warp-contracts';
import type {HollowDBState} from 'hollowdb';
import verKey from './verkey.json';
import arWallet from './wallet.json';

type Environment = 'development' | 'production';

interface Config {
  readonly LOG_LEVEL: LogLevel;
  readonly NODE_ENV: Environment;
  readonly CONTRACT_TX_ID: string;
  // readonly USE_BUNDLR_NETWORK: boolean;
  readonly VERIFICATION_KEY: HollowDBState['verificationKey'];
  readonly ARWEAVE_WALLET: JWKInterface;
}

const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel | undefined;
const NODE_ENV = process.env.NODE_ENV as Environment | undefined;
const CONTRACT_TX_ID = process.argv[2] as string | undefined;

// const USE_BUNDLR_NETWORK = process.env.USE_BUNDLR_NETWORK as
//   | boolean
//   | undefined;

export const config: Config = {
  LOG_LEVEL: LOG_LEVEL || 'debug',
  NODE_ENV: NODE_ENV || 'development',
  CONTRACT_TX_ID: CONTRACT_TX_ID || '',
  // USE_BUNDLR_NETWORK: USE_BUNDLR_NETWORK || false,
  VERIFICATION_KEY: verKey as HollowDBState['verificationKey'],
  ARWEAVE_WALLET: arWallet as JWKInterface,
};
