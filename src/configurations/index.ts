import {LogLevel} from 'warp-contracts';
// import {ConfigurationInput} from 'lightship';
import {RedisClientOptions} from 'redis';

type Environment = 'development' | 'production';

interface Config {
  readonly LOG_LEVEL: LogLevel;
  readonly NODE_ENV: Environment;
  readonly CONTRACT_TX_ID: string;
  readonly REDIS_PASSWORD: string;
  readonly REDIS_USER: string;
  readonly REDIS_HOST: string;
  readonly REDIS_PORT: string;
}

const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel | undefined;
const NODE_ENV = process.env.NODE_ENV as Environment | undefined;

export const config: Config = {
  LOG_LEVEL: LOG_LEVEL || 'info',
  NODE_ENV: NODE_ENV || 'development',
  CONTRACT_TX_ID: process.env.CONTRACT_TX_ID || '',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'redispw',
  REDIS_USER: process.env.REDIS_USER || 'default',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || '32768',
};

// export const lightshipConfig: ConfigurationInput = {
//   shutdownDelay: 5000, //This value should match readinessProbe.periodSeconds
//   shutdownHandlerTimeout: 5000,
//   gracefulShutdownTimeout: 10000,
//   port: 9000,
// };

export const redisConfig: RedisClientOptions = {
  url: `redis://${config.REDIS_USER}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`,
};
