const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  collectCoverageFrom: ["**/src/**/*.ts"],
  testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
};
