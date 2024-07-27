module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    coverageDirectory: 'coverage',
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
  };
  