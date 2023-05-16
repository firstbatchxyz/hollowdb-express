import express from 'express';
import helmet from 'helmet';
import routerRoot from './routes/root.route';
import {config} from './configurations';
import {logger} from './utilities/logger';
import {Server} from 'http';
import {destroyClients, setupClients} from './clients';
import cors from 'cors';
import type {JWKInterface} from 'warp-contracts';
import {readFileSync} from 'fs';

/**
 * Prepare the Express HTTP server
 * @returns A promise to Server which resolves once it starts listening.
 */
export async function launchServer(
  contractTxId: string,
  wallet: JWKInterface
): Promise<Server> {
  logger.log(`Starting server (env: ${config.NODE_ENV})`);

  // update config
  config.CONTRACT_TX_ID = contractTxId;
  config.ARWEAVE_WALLET = wallet;

  // setup middlewares & routes
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(routerRoot);

  await setupClients();

  // listen
  return await new Promise(resolve => {
    const server = app.listen(8000, () => {
      logger.log('========= LIVE! =========');
      logger.log('Server started on port 8000.');
      resolve(server);
    });
  });
}

/**
 * Kills the server gracefully. Optionally exits the process, which you should NOT if you are testing.
 * @param server the HTTP server to close
 * @param exitProcess do process.exit after closing?
 */
export async function killServer(server: Server, exitProcess = false) {
  logger.log('\n\nKilling server.');

  await destroyClients();

  server.close(err => {
    if (err) {
      logger.log('Error during termination.', err);
      // eslint-disable-next-line no-process-exit
      exitProcess && process.exit(1);
    } else {
      logger.log('Gracefully terminated. 💐');
      // eslint-disable-next-line no-process-exit
      exitProcess && process.exit(0);
    }
  });
}

if (require.main === module) {
  // get contractTxId as an argument
  if (process.argv.length !== 3) {
    throw new Error('Please provide contractTxId as an argument.');
  }
  const contractTxId = process.argv[2];

  // read wallet
  const wallet = JSON.parse(
    readFileSync('./src/secrets/wallet.json').toString()
  ) as JWKInterface;

  launchServer(contractTxId, wallet)
    .then(server => {
      // signal listeners
      process.on('SIGTERM', () => killServer(server, true));
      process.on('SIGINT', () => killServer(server, true));
    })
    .catch(err => {
      logger.log('Could not launch server:', err);
      // eslint-disable-next-line no-process-exit
      destroyClients().then(() => process.exit(1));
    });
}
