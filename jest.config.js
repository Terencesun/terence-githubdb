module.exports = {
        "preset": "ts-jest",
        "collectCoverage": false,
        "coverageProvider": "babel",
        "coverageDirectory": "./coverage",
        "testEnvironment": "node",
        "moduleDirectories": [
                "node_modules",
                __dirname,
        ],
};
