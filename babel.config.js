module.exports = {
    presets: [
      ["@babel/env", { targets: { browsers: "> 0%" }, }]
    ],
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          corejs: { version: 3, proposals: true },
          regenerator: undefined,
          version: "^7.15.4",
        }
      ]
    ],
    overrides: [
        {
            test: ["**/*.ts", "**/*.tsx"],
            presets: ["@babel/preset-typescript"],
            plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                ["@babel/plugin-proposal-private-methods", { loose: true }],
                ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
                ["@babel/plugin-proposal-optional-chaining"],
                ["@babel/plugin-proposal-nullish-coalescing-operator"],
            ],
        },
    ]
};
