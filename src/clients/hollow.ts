import {Admin} from 'hollowdb';
import {defaultCacheOptions} from 'warp-contracts';
import type {JWKInterface} from 'warp-contracts';
import {LmdbCache} from 'warp-contracts-lmdb';
import {Client} from '.';
import {config} from '../configurations';
import {WarpFactory} from 'warp-contracts';
import {logger} from '../utilities/logger';

class HollowClient implements Client {
  private static instance: HollowClient;
  public hollowdb: Admin;

  private constructor(jwk: JWKInterface, contractTxId: string) {
    const warp =
      config.NODE_ENV === 'test'
        ? WarpFactory.forLocal(3169)
        : WarpFactory.forMainnet()
            .useStateCache(
              new LmdbCache({
                ...defaultCacheOptions,
                inMemory: true,
                dbLocation: './cache/warp/state',
              })
            )
            .useContractCache(
              new LmdbCache({
                ...defaultCacheOptions,
                inMemory: true,
                dbLocation: './cache/warp/contract',
              }),
              new LmdbCache({
                ...defaultCacheOptions,
                inMemory: true,
                dbLocation: './cache/warp/src',
              })
            )
            .useKVStorageFactory(
              (contractTxId: string) =>
                new LmdbCache({
                  ...defaultCacheOptions,
                  inMemory: true,
                  dbLocation: `./cache/warp/kv/lmdb_2/${contractTxId}`,
                })
            );

    this.hollowdb = new Admin(jwk, contractTxId, warp);
  }

  /**
   * Setup will call `hollowdb.readState()` to trigger the underlying cache
   * to be downloaded.
   */
  public async setup(): Promise<void> {
    logger.log('Downloading HollowDB cache...');
    await this.hollowdb.readState();
  }

  public async destroy(): Promise<void> {
    // TODO: check if this is the right way to close the warp
    try {
      await this.hollowdb.warp.close();
    } catch (error) {
      logger.log(error);
    }
  }

  public static getInstance(): HollowClient {
    if (!HollowClient.instance) {
      if (!config.CONTRACT_TX_ID) {
        throw new Error('Contract txId not found in config.');
      }
      if (!config.ARWEAVE_WALLET) {
        throw new Error('Wallet not found in config.');
      }

      HollowClient.instance = new HollowClient(
        config.ARWEAVE_WALLET,
        config.CONTRACT_TX_ID
      );
    }

    return HollowClient.instance;
  }
}

export function hollowClient(): HollowClient {
  return HollowClient.getInstance();
}
