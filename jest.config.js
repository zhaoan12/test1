module.exports = {
  verbose: true,
  testURL: "http://localhost/",
  testMatch: ["<rootDir>/test/*.test.js"],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  globalTeardown: '<rootDir>/test/teardown.js'
};
