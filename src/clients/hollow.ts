import {Admin as HollowDB} from 'hollowdb';
import {defaultCacheOptions, Warp} from 'warp-contracts';
import type {JWKInterface} from 'warp-contracts';
import {LmdbCache} from 'warp-contracts-lmdb';
import {Client} from '.';
import {config} from '../configurations';
// import fs from 'fs';
// import path from 'path';
import {WarpFactory} from 'warp-contracts';
import {logger} from '../utilities/logger';

class HollowClient implements Client {
  private static instance: HollowClient;
  public hollowdb: HollowDB;
  private warp: Warp;

  private constructor(jwk: JWKInterface, contractTxId: string) {
    this.warp =
      config.NODE_ENV === 'test'
        ? WarpFactory.forLocal(3169 /* testing port */)
        : WarpFactory.forMainnet()
            .useStateCache(
              new LmdbCache({
                ...defaultCacheOptions,
                dbLocation: './cache/warp/state',
              })
            )
            .useContractCache(
              new LmdbCache({
                ...defaultCacheOptions,
                dbLocation: './cache/warp/contract',
              }),
              new LmdbCache({
                ...defaultCacheOptions,
                dbLocation: './cache/warp/src',
              })
            )
            .useKVStorageFactory(
              (contractTxId: string) =>
                new LmdbCache({
                  ...defaultCacheOptions,
                  dbLocation: `./cache/warp/kv/lmdb_2/${contractTxId}`,
                })
            );

    this.hollowdb = new HollowDB(jwk, contractTxId, this.warp);
  }

  //download the cache and setVerkey and whiteLists if needed
  public async setup(): Promise<void> {
    // //set verification key
    // await this.hollowdb.setVerificationKey(config.VERIFICATION_KEY);

    // //set whiteList requirement so no one can write to the contract besides the server
    // await this.hollowdb.setWhitelistRequirement({
    //   put: true,
    //   update: true,
    // });

    //download the cache
    logger.log('Hollowdb is downloading the cache...');
    await this.hollowdb.readState();
    logger.log('Hollowdb is done downloading the cache');
  }

  //TODO: delete previous cache
  public async destroy(): Promise<void> {
    //@TODO: check if this is the right way to close the warp
    try {
      await this.hollowdb.warp.close();
    } catch (error) {
      logger.log(error);
    }
  }

  public static getInstance(): HollowClient {
    if (!HollowClient.instance) {
      // const walletPath = path.join(__dirname, '../configurations/wallet.json');
      // const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf8'));

      // if (!wallet) {
      //   throw new Error(
      //     'Wallet not found, please put your wallet.json under configurations folder'
      //   );
      // }

      if (config.CONTRACT_TX_ID === '') {
        throw new Error(
          'Contract tx id not found, please use yarn start <CONTRACT_TX_ID>'
        );
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
