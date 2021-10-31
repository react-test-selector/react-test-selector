import * as path from "path";

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const packagesDir = path.resolve(__dirname, "..", "..");

export default {
    typescript: {
        check: false,
        docgen: 'none'
    },
    core: {
        builder: "webpack5",
    },
    stories: ["../src/**/*.stories.tsx"],
    addons: ["@storybook/addon-essentials"],
    webpackFinal: (config: any) => {
        config.resolve = config.resolve || {};
        config.resolve.extensions = [".ts", ".tsx", ".js", ".jsx"];
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            ...emotionStorybookWorkaroundViaAliases(repoRoot),
        };

        // disable docgen plugin
        config.plugins.pop();

        config.target = ["web", "es5"];
        config.module.rules = [];
        config.module.rules.push(
            {
                test: /\.tsx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        configFile: path.resolve(packagesDir, "..", "babel.config.js"),
                    }
                },
                include: [
                    path.resolve(packagesDir, "chrome-extension", "src"),
                    path.resolve(packagesDir, "chrome-extension", ".storybook"),
                    path.resolve(packagesDir, "react-test-selector", "src"),
                    path.resolve(packagesDir, "shared"),
                ],
            },
        );

        return config;
    },
};


export function emotionStorybookWorkaroundViaAliases(repoRootDir: string) {
    console.log(require.resolve("@emotion/styled"));
    console.log(require.resolve("emotion-theming"));
    return {
        ["@emotion/core"]: path.dirname(path.dirname(require.resolve("@emotion/react"))),
        ["@emotion/styled"]: path.dirname(path.dirname(require.resolve("@emotion/styled"))),
        ["emotion-theming"]: path.dirname(path.dirname(require.resolve("@emotion/react"))),
    };
}
