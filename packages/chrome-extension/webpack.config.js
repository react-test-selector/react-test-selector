const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require("html-webpack-plugin");

let currentDir = __dirname;

const configBase = {
    target: ["web", "es6"],
    context: path.resolve(currentDir),
    mode: "development",
    devtool: false,
    output: {
        path: path.resolve(currentDir, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        envName: "rts-chrome",
                        configFile: "../../babel.config.js"
                    }
                },
                include: [
                    path.resolve(currentDir, "src"),
                    path.resolve(currentDir, "..", "react-test-selector", "src"),
                    path.resolve(currentDir, "..", "shared")
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
}


const pageScriptConfig = {
    ...configBase,
    entry: {
        page: "./src/PageScript/PageScriptEntryPoint",
    },
    output: {
        path: path.resolve(currentDir, "build-tmp"),
        library: {
            name: "pageScript",
            type: "var"
        },
    },
}

const contentScriptConfig = {
    ...configBase,
    entry: {
        content: "./src/ContentScript/ContentScriptEntryPoint",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/manifest.json" },
            ]
        }),
    ]
}

const devToolConfig = {
    ...configBase,
    entry: {
        devtool: "./src/DevToolPanels/DevToolEntryPoint",
    },
    plugins: [new HtmlPlugin({ filename: "devtool.html", inject: "body", minify: false })],
}

const devToolInspectPanelConfig = {
    ...configBase,
    entry: {
        ["devtool-inspect"]: "./src/DevToolPanels/DevToolInspectPanelEntryPoint",
    },
    plugins: [new HtmlPlugin({ filename: "devtool-inspect.html", inject: "body", minify: false })],
}

const devToolSelectorWatchPanelConfig = {
    ...configBase,
    entry: {
        ["devtool-selector-watch"]: "./src/DevToolPanels/DevToolSelectorWatchPanelEntryPoint",
    },
    plugins: [new HtmlPlugin({ filename: "devtool-selector-watch.html", inject: "body", minify: false })],
}

module.exports = [pageScriptConfig, contentScriptConfig, devToolConfig, devToolInspectPanelConfig, devToolSelectorWatchPanelConfig];

module.exports.parallelism = 1;
