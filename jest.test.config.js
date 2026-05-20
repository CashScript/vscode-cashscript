/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/testSetup.ts"],
  moduleNameMapper: {
    "^vscode$": "<rootDir>/__mocks__/vscode.ts"
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/out/"
  ],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { "isolatedModules": true }]
  }
};
