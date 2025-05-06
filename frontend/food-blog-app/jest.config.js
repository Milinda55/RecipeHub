module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/node_modules/@testing-library/jest-dom/extend-expect'], // Full path
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy'
    }
}