module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  testMatch: [
    '**/tests/**/*.test.(ts|js)',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {},
    ],
  },
}