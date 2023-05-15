import {ripemd160} from '@ethersproject/sha2';
const snarkjs = require('snarkjs');

export type ProofSystem = 'groth16' | 'plonk';

export class Prover {
  private readonly wasmPath: string;
  private readonly proverKey: string;
  public readonly proofSystem: ProofSystem;

  constructor(wasmPath: string, proverKey: string, proofSystem: ProofSystem) {
    this.wasmPath = wasmPath;
    this.proverKey = proverKey;
    this.proofSystem = proofSystem;
  }

  async generateProof(
    preimage: bigint,
    curValue: unknown | null,
    nextValue: unknown | null
  ): Promise<{
    proof: object;
    publicSignals: [
      curValueHashOut: string,
      nextValueHashOut: string,
      key: string
    ];
  }> {
    return snarkjs[this.proofSystem].fullProve(
      // field names of this JSON object must match the input signal names of the circuit
      {
        preimage: preimage,
        curValueHash: curValue ? this.valueToBigInt(curValue) : BigInt(0),
        nextValueHash: nextValue ? this.valueToBigInt(nextValue) : BigInt(0),
      },
      this.wasmPath,
      this.proverKey
    );
  }

  valueToBigInt = (value: unknown): bigint => {
    return BigInt(ripemd160(Buffer.from(JSON.stringify(value))));
  };
}
