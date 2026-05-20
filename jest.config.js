/**
 * Jest harness for the SOLID-upgrade research branch.
 *
 * Lives ALONGSIDE the existing mocha (.spec.ts) and WCT (HTML) suites.
 * New behavioural / before-after tests for this branch go in tests/jest/.
 * Run with: npm run test:jest
 */
module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/jest/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/interfaces/**',
    '!src/**/types/**',
    '!src/typings/**',
    '!src/_interfaces/**',
  ],
  coverageDirectory: '<rootDir>/coverage/jest',
  // Existing mocha specs use chai globals; do NOT pick them up.
  testPathIgnorePatterns: ['/node_modules/', '\\.spec\\.ts$'],
  // The lib's existing tsconfig targets ES5, but tests run in node — allow modern JS.
  // ts-jest handles transpilation via the tsconfig.jest.json above.
  verbose: false,
};
