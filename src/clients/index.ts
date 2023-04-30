import {hollowClient} from './hollow';
import {bundlrClient} from './bundlr';

/**
 * Calls destroy of each client singleton.
 */
export async function destroyClients(): Promise<void> {
  await Promise.all([hollowClient().destroy(), bundlrClient().destroy()]);
}

/**
 * Calls setup of each client singleton and performs a healthcheck.
 * @returns true if all clients pass the healthcheck
 */
export async function setupClients(): Promise<void> {
  await hollowClient().setup();
  await bundlrClient().setup();
}

export abstract class Client {
  public abstract setup(): Promise<void>;
  public abstract destroy(): Promise<void>;
}
