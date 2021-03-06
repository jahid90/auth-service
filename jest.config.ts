/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    coverageReporters: ['html', 'lcov'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    roots: ['<rootDir>/__tests__'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
