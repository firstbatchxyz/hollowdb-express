/* eslint-disable @typescript-eslint/no-explicit-any */
import {Server} from 'http';
import {expect} from 'chai';
import ArLocal from 'arlocal';
import {Admin} from 'hollowdb';
import {WarpFactory, ArWallet, LoggerFactory} from 'warp-contracts';
import {DeployPlugin} from 'warp-contracts-plugin-deploy';
import initialState from './resources/initialState';
import contractSource from './resources/contractSource';
import verificationKey from './circuits/verification_key.json';
import {randomInt} from 'crypto';
import {computeKey, Prover} from 'hollowdb-prover';
import {postData, getKey} from './util/fetch';
import {StatusCodes} from 'http-status-codes';
import {launchServer, killServer} from '../src/index';

const url = 'http://localhost:8000';

describe('server test', () => {
  let arlocal: ArLocal;
  let server: Server;
  let prover: Prover;

  const VALUE = 'foo is bar';
  const NEW_VALUE = 'bar is baz';
  const SECRET = BigInt(randomInt(9_999_999));
  const KEY = computeKey(SECRET);

  before(async () => {
    LoggerFactory.INST.logLevel('error');

    // create a local Arweave instance
    arlocal = new ArLocal(3169, false);
    await arlocal.start();

    // setup warp factory for local arweave
    const warp = WarpFactory.forLocal(3169).use(new DeployPlugin());
    const owner: ArWallet = (await warp.generateWallet()).jwk;
    const {contractTxId} = await Admin.deploy(
      owner,
      initialState,
      contractSource,
      warp,
      true
    );

    // set verification key for proofs
    new Admin(owner, contractTxId, warp).updateVerificationKey(
      'auth',
      verificationKey
    );

    // create prover
    prover = new Prover(
      './test/circuits/hollow-authz.wasm',
      './test/circuits/prover_key.zkey',
      'groth16'
    );
    expect(prover.protocol === verificationKey.protocol);

    // start the server
    server = await launchServer();
    console.log('waiting a bit for server to be ready...');
    await sleep(1800);
  });

  it('should put & get a value', async () => {
    const putResponse = await postData(url + '/put', {
      key: KEY,
      value: VALUE,
    });
    expect(putResponse.status).to.eq(StatusCodes.OK);
    await sleep(1500);

    const getResponse = await getKey(url, KEY);
    expect(getResponse.status).to.eq(StatusCodes.OK);
    expect(await getResponse.json().then((body: any) => body.data.value)).to.eq(
      VALUE
    );
  });

  it('should NOT put to an existing key', async () => {
    const response = await postData(url + '/put', {
      key: KEY,
      value: VALUE,
    });
    expect(response.status).to.eq(StatusCodes.BAD_REQUEST);
    expect(await response.json().then(reason => reason.message)).to.eq(
      'Contract Error [put]: Key already exists.'
    );
  });

  it('should NOT update with a wrong proof', async () => {
    const {proof} = await prover.prove(BigInt(0), VALUE, NEW_VALUE);
    const response = await postData(url + '/update', {
      key: KEY,
      value: NEW_VALUE,
      proof: proof,
    });
    expect(response.status).to.eq(StatusCodes.BAD_REQUEST);
    expect(await response.json().then(reason => reason.message)).to.eq(
      'Contract Error [update]: Invalid proof.'
    );
  });

  it('should update & get the new value', async () => {
    const {proof} = await prover.prove(SECRET, VALUE, NEW_VALUE);
    const updateResponse = await postData(url + '/update', {
      key: KEY,
      value: NEW_VALUE,
      proof: proof,
    });
    expect(updateResponse.status).to.eq(StatusCodes.OK);

    const getResponse = await getKey(url, KEY);
    expect(getResponse.status).to.eq(StatusCodes.OK);
    expect(await getResponse.json().then((body: any) => body.data.value)).to.eq(
      NEW_VALUE
    );
  });

  it('should remove the new value & get null', async () => {
    const {proof} = await prover.prove(SECRET, NEW_VALUE, null);
    const removeResponse = await postData(url + '/remove', {
      key: KEY,
      proof: proof,
    });
    expect(removeResponse.status).to.eq(StatusCodes.OK);

    const getResponse = await getKey(url, KEY);
    expect(getResponse.status).to.eq(StatusCodes.OK);
    expect(await getResponse.json().then((body: any) => body.data.value)).to.eq(
      null
    );
  });

  after(async () => {
    console.log('waiting a bit before closing...');
    await sleep(1500);
    await killServer(server);
    await arlocal.stop();
  });
});

const sleep = async (ms: number) => {
  await new Promise(res => {
    setTimeout(res, ms);
  });
};
