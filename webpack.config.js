const path = require("path");
const webpack = require("webpack");

module.exports = {
    target: ["web", "es6"],
    context: __dirname,
    // mode: "development",
    mode: "production",
    devtool: false,
    entry: {
      "react-test-selector": "./src/InjectScriptEntryPoint",
    },
    output: {
        path: path.join(__dirname, "lib"),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                  loader: "babel-loader",
                  options: {
                    configFile: "./babel.config.js"
                  }
                },
                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "..", "shared"),
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
};
