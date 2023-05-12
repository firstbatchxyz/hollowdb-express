import express from 'express';
import helmet from 'helmet';
import routerRoot from './routes/root.route';
// import {config, redisConfig} from './configurations';

import {logger} from './utilities/logger';
// import {Server} from 'http';

import {destroyClients, setupClients} from './clients';
import cors from 'cors';

//@TODO: implement http server with handlers
//@TODO: implement kill switch
async function main() {
  logger.log('Starting server...');
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(routerRoot);

  await setupClients();

  app.listen(8000);
  logger.log('Server started on port 8000.');
}

main();
