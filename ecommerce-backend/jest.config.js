export default {
  testEnvironment: 'node',
  transform: {},
  // Remove .js from extensionsToTreatAsEsm as it's already inferred from package.json type:module
  extensionsToTreatAsEsm: [],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.(js|jsx)$': '$1',
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
};