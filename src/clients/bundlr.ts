import Bundlr from '@bundlr-network/client';
import type {JWKInterface} from 'warp-contracts';
import {Client} from '.';
import fs from 'fs';
import path from 'path';

class BundlrClient implements Client {
  private static instance: BundlrClient;
  public bundlr: InstanceType<typeof Bundlr>;

  private constructor(jwk: JWKInterface) {
    this.bundlr = new Bundlr('http://node1.bundlr.network', 'arweave', jwk);
  }

  //download the cache and setVerkey and whiteLists if needed
  public async setup(): Promise<void> {}

  //TODO: delete cache
  public async destroy(): Promise<void> {}

  public static getInstance(): BundlrClient {
    if (!BundlrClient.instance) {
      const walletPath = path.join(__dirname, '../configurations/wallet.json');
      const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf8'));

      if (!wallet) {
        throw new Error(
          'Wallet not found, please put your wallet.json under configurations folder'
        );
      }

      BundlrClient.instance = new BundlrClient(wallet as JWKInterface);
    }

    return BundlrClient.instance;
  }
}

export function bundlrClient(): BundlrClient {
  return BundlrClient.getInstance();
}
