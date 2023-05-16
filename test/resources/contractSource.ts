const contractSource = `
// contracts/hollowDB/actions/crud/get.ts
var get = async (state, action) => {
  const { key } = action.input.data;
  return {
    result: await SmartWeave.kv.get(key)
  };
};

// contracts/hollowDB/errors/index.ts
var errors = {
  KeyExistsError: new ContractError("Key already exists, use update instead"),
  KeyNotExistsError: new ContractError("Key does not exist"),
  CantEvolveError: new ContractError("Evolving is disabled"),
  NoVerificationKeyError: new ContractError("Verification key is not set"),
  UnknownProofSystemError: new ContractError("Unknown proof system"),
  NotWhitelistedError: (f) => new ContractError("User is not whitelisted for: " + f),
  UnknownFunctionError: (f) => new ContractError("Unknown function: ", f),
  InvalidProofError: (f) => new ContractError("Proof verification failed in: " + f),
  NotOwnerError: (f) => new ContractError("Only the contract owner has access to: " + f)
};
var errors_default = errors;

// contracts/hollowDB/actions/crud/put.ts
var put = async (state, action) => {
  const { key, value } = action.input.data;
  if (state.isWhitelistRequired.put && !state.whitelist.put[action.caller]) {
    throw errors_default.NotWhitelistedError(action.input.function);
  }
  if (await SmartWeave.kv.get(key) !== null) {
    throw errors_default.KeyExistsError;
  }
  await SmartWeave.kv.put(key, value);
  return { state };
};

// contracts/hollowDB/utils/index.ts
var verifyProof = async (proof, psignals, verificationKey) => {
  if (verificationKey === null) {
    throw errors_default.NoVerificationKeyError;
  }
  if (verificationKey.protocol !== "groth16" && verificationKey.protocol !== "plonk") {
    throw errors_default.UnknownProofSystemError;
  }
  return await SmartWeave.extensions[verificationKey.protocol].verify(verificationKey, psignals, proof);
};
var valueToBigInt = (value) => {
  return BigInt(SmartWeave.extensions.ethers.utils.ripemd160(Buffer.from(JSON.stringify(value))));
};

// contracts/hollowDB/actions/crud/update.ts
var update = async (state, action) => {
  const { key, value, proof } = action.input.data;
  if (state.isWhitelistRequired.update && !state.whitelist.update[action.caller]) {
    throw errors_default.NotWhitelistedError(action.input.function);
  }
  const dbValue = await SmartWeave.kv.get(key);
  if (dbValue === null) {
    throw errors_default.KeyNotExistsError;
  }
  if (!state.isProofRequired || await verifyProof(proof, [valueToBigInt(dbValue), valueToBigInt(value), BigInt(key)], state.verificationKey)) {
    await SmartWeave.kv.put(key, value);
  } else {
    throw errors_default.InvalidProofError(action.input.function);
  }
  return { state };
};

// contracts/hollowDB/actions/crud/remove.ts
var remove = async (state, action) => {
  const { key, proof } = action.input.data;
  if (state.isWhitelistRequired.update && !state.whitelist.update[action.caller]) {
    throw errors_default.NotWhitelistedError(action.input.function);
  }
  const dbValue = await SmartWeave.kv.get(key);
  if (dbValue === null) {
    throw errors_default.KeyNotExistsError;
  }
  if (!state.isProofRequired || await verifyProof(proof, [valueToBigInt(dbValue), 0n, BigInt(key)], state.verificationKey)) {
    await SmartWeave.kv.put(key, null);
  } else {
    throw errors_default.InvalidProofError(action.input.function);
  }
  return { state };
};

// contracts/hollowDB/actions/evolve.ts
var evolve = async (state, action) => {
  if (action.caller !== state.owner) {
    throw errors_default.NotOwnerError(action.input.function);
  }
  if (!state.canEvolve) {
    throw errors_default.CantEvolveError;
  }
  state.evolve = action.input.value;
  return { state };
};

// contracts/hollowDB/actions/state/getAllKeys.ts
var getAllKeys = async (state, action) => {
  return {
    result: await SmartWeave.kv.keys()
  };
};

// contracts/hollowDB/actions/state/updateState.ts
var updateState = async (state, action) => {
  const { newState } = action.input.data;
  if (action.caller !== state.owner) {
    throw errors_default.NotOwnerError(action.input.function);
  }
  return {
    state: {
      ...state,
      ...newState
    }
  };
};

// contracts/hollowDB/actions/state/updateWhitelist.ts
var updateWhitelist = async (state, action) => {
  const { whitelist, type } = action.input.data;
  if (action.caller !== state.owner) {
    throw errors_default.NotOwnerError(action.input.function);
  }
  whitelist.add.forEach((user) => {
    state.whitelist[type][user] = true;
  });
  whitelist.remove.forEach((user) => {
    delete state.whitelist[type][user];
  });
  return { state };
};

// contracts/hollowDB/contract.ts
var handle = (state, action) => {
  switch (action.input.function) {
    case "get":
      return get(state, action);
    case "getAllKeys":
      return getAllKeys(state, action);
    case "put":
      return put(state, action);
    case "update":
      return update(state, action);
    case "remove":
      return remove(state, action);
    case "updateState":
      return updateState(state, action);
    case "updateWhitelist":
      return updateWhitelist(state, action);
    case "evolve":
      return evolve(state, action);
    default:
      throw errors_default.UnknownFunctionError(action.input.function);
  }
};
` as string;

export default contractSource;
