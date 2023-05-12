/* eslint-disable @typescript-eslint/no-explicit-any */
import {Server} from 'http';
import {expect} from 'chai';
import ArLocal from 'arlocal';
import {Admin} from 'hollowdb';
import {WarpFactory, ArWallet} from 'warp-contracts';
import {DeployPlugin} from 'warp-contracts-plugin-deploy';
import initialState from './resources/initialState';
import contractSource from './resources/contractSource';
import verificationKey from './circuit/verification_key.json';
import {randomInt} from 'crypto';
import {computeKey} from './util/computeKey';
import {postData, getKey} from './util/fetch';
import {Prover} from './util/prover';
import {StatusCodes} from 'http-status-codes';
import {killServer, launchServer} from '../src';

describe('ExpressJS tests', () => {
  let arlocal: ArLocal;
  let server: Server;
  let url: string;
  let prover: Prover;

  const VALUE = BigInt(randomInt(9_999_999)).toString();
  const NEW_VALUE = BigInt(randomInt(9_999_999)).toString();
  const SECRET = BigInt(randomInt(9_999_999));
  const KEY = computeKey(SECRET);
  const ARWEAVE_PORT = 3169;

  before(async () => {
    console.log('Starting...');

    // create a local Arweave instance
    arlocal = new ArLocal(ARWEAVE_PORT, false);
    await arlocal.start();

    // setup warp factory for local arweave
    const warp = WarpFactory.forLocal(ARWEAVE_PORT).use(new DeployPlugin());
    const owner: ArWallet = (await warp.generateWallet()).jwk;
    const {contractTxId} = await Admin.deploy(
      owner,
      initialState,
      contractSource,
      warp,
      true
    );

    // set verification key for proofs
    new Admin(owner, contractTxId, warp).setVerificationKey(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      verificationKey as any
    ); // TODO: hollowdb shall fix this

    // create prover
    prover = new Prover(
      __dirname + '/circuit/hollow-authz.wasm',
      __dirname + '/circuit/prover_key.zkey',
      'plonk'
    );
    console.log(verificationKey.protocol, 'prover ready');

    // start the server
    server = await launchServer();

    await new Promise(res => {
      console.log('waiting a bit for server to be ready...');
      setTimeout(res, 1800);
    });
  });

  it('should put & get a value', async () => {
    // put
    const putResponse = await postData(url + '/put', {
      data: {
        key: KEY,
        value: VALUE,
      },
    });
    expect(putResponse.status).to.eq(StatusCodes.OK);

    const getResponse = await getKey(url, KEY);
    expect(getResponse.status).to.eq(StatusCodes.OK);
    expect(await getResponse.json().then((body: any) => body.value)).to.eq(
      VALUE
    );
  });

  it('should NOT put to an existing key', async () => {
    const putResponse = await postData(url + '/put', {
      data: {
        key: KEY,
        value: VALUE,
      },
    });
    expect(putResponse.status).to.eq(StatusCodes.BAD_REQUEST);
    expect(await putResponse.text()).to.eq(
      'Contract Error [put]: Key already exists, use update instead'
    );
  });

  it('should NOT update with a wrong proof', async () => {
    const {proof} = await prover.generateProof(BigInt(0), VALUE, NEW_VALUE);
    const putResponse = await postData(url + '/update', {
      data: {
        key: KEY,
        value: NEW_VALUE,
        proof: proof,
      },
    });
    expect(putResponse.status).to.eq(StatusCodes.BAD_REQUEST);
    expect(await putResponse.text()).to.eq(
      'Contract Error [update]: Proof verification failed in: update'
    );
  });

  it('should update & get the new value', async () => {
    // update
    const {proof} = await prover.generateProof(SECRET, VALUE, NEW_VALUE);
    const updateResponse = await postData(url + '/update', {
      data: {
        key: KEY,
        value: NEW_VALUE,
        proof: proof,
      },
    });
    expect(updateResponse.status).to.eq(StatusCodes.OK);

    const getResponse = await getKey(url, KEY);
    expect(getResponse.status).to.eq(StatusCodes.OK);
    expect(await getResponse.json().then((body: any) => body.value)).to.eq(
      NEW_VALUE
    );
  });

  it('should remove the new value & get null', async () => {
    // update
    const {proof} = await prover.generateProof(SECRET, NEW_VALUE, null);
    const removeResponse = await postData(url + '/remove', {
      data: {
        key: KEY,
        proof: proof,
      },
    });
    expect(removeResponse.status).to.eq(StatusCodes.OK);

    const getResponse = await getKey(url, KEY);
    expect(getResponse.status).to.eq(StatusCodes.OK);
    expect(await getResponse.json().then((body: any) => body.value)).to.eq(
      null
    );
  });

  after(async () => {
    await new Promise(res => {
      console.log('waiting a bit before closing...');
      setTimeout(res, 1500);
    });
    await killServer(server);
    await arlocal.stop();
  });
});
