module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
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