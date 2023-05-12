const initialState = {
  owner: "",
  verificationKey: null,
  isProofRequired: true,
  canEvolve: true,
  whitelist: {
    put: {},
    update: {},
  },
  isWhitelistRequired: {
    put: false,
    update: false,
  },
};

export default initialState;
