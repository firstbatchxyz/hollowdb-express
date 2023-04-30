import express from 'express';
// import routerRoot from './routes/root.route';
// import {config, redisConfig} from './configurations';

import {logger} from './utilities/logger';
import {Server} from 'http';

import {destroyClients, setupClients} from './clients';

console.log('Hello World!');
