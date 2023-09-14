import {hollowClient} from './hollow';

/**
 * Calls destroy of each client singleton.
 */
export async function destroyClients(): Promise<void> {
  await hollowClient().destroy();
}

/**
 * Calls setup of each client singleton.
 */
export async function setupClients(): Promise<void> {
  await hollowClient().setup();
}

export abstract class Client {
  public abstract setup(): Promise<void>;
  public abstract destroy(): Promise<void>;
}
