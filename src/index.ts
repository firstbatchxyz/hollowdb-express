import express from 'express';
import helmet from 'helmet';
import routerRoot from './routes/root.route';
import {config} from './configurations';

import {logger} from './utilities/logger';
import {Server} from 'http';

import {destroyClients, setupClients} from './clients';
import cors from 'cors';

/**
 * Prepare the Express HTTP server
 * @returns A promise to Server which resolves once it starts listening.
 */
export async function launchServer(contractTxId: string): Promise<Server> {
  logger.log('Starting server...');

  // update config
  config.CONTRACT_TX_ID = contractTxId;

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
  const contractTxId = process.argv[2];
  launchServer(contractTxId)
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
