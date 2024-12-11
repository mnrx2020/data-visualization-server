const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    rootDir: path.resolve(__dirname),
    testMatch: ['<rootDir>/__tests__/**/*.test.ts', '<rootDir>/__tests__/**/*.test.tsx'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        }],
    },
};
