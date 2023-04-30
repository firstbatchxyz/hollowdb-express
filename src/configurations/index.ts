import {LogLevel} from 'warp-contracts';
import {verKey} from './verkey';
import {HollowDBState} from 'hollowdb';

type Environment = 'development' | 'production';

interface Config {
  readonly LOG_LEVEL: LogLevel;
  readonly NODE_ENV: Environment;
  readonly CONTRACT_TX_ID: string;
  readonly USE_BUNDLR_NETWORK: boolean;
  readonly VERIFICATION_KEY: HollowDBState['verificationKey'];
}

const CONTRACT_TX_ID = process.argv[2] as string | undefined;
const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel | undefined;
const NODE_ENV = process.env.NODE_ENV as Environment | undefined;
const USE_BUNDLR_NETWORK = process.env.USE_BUNDLR_NETWORK as
  | boolean
  | undefined;

export const config: Config = {
  LOG_LEVEL: LOG_LEVEL || 'debug',
  NODE_ENV: NODE_ENV || 'development',
  CONTRACT_TX_ID: CONTRACT_TX_ID || '',
  USE_BUNDLR_NETWORK: USE_BUNDLR_NETWORK || false,
  VERIFICATION_KEY: verKey as HollowDBState['verificationKey'],
};
