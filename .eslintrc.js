module.exports = {
        extends: [ "alloy", "alloy/typescript" ],
        env: {
                node: true,
                jest: true
        },
        globals: {},
        rules: {
                indent: [ "error", 8, { SwitchCase: 1 } ],
                "prefer-promise-reject-errors": "off",
                "@typescript-eslint/no-parameter-properties": "off",
                "@typescript-eslint/method-signature-style": "off",
                "@typescript-eslint/unified-signatures": "off",
                "@typescript-eslint/no-invalid-this": "off",
                "max-params": "off",
                "max-depth": "off",
                semi: [ "error", "always" ],
                quotes: [ 2, "double" ],
                complexity: [ "error", { max: 50 } ],
                "@typescript-eslint/no-loss-of-precision": "off",
                "no-unreachable-loop": "off",
                "space-before-blocks": 2,
                "array-bracket-spacing": [ "error", "always" ],
                "object-curly-spacing": [ "error", "always" ],
                "@typescript-eslint/member-ordering": "off",
                "@typescript-eslint/no-inferrable-types": "off",
                "prefer-object-spread": "off",
        },
};
