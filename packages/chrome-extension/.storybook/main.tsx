import * as path from "path";
import { emotionStorybookWorkaroundViaAliases } from "../../Common/EmotionStorybookWorkaroundViaAliases";

const repoRootDir = path.resolve(__dirname, "..", "..");

export default {
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
            ...emotionStorybookWorkaroundViaAliases(repoRootDir),
        };
        config.target = ["web", "es5"];
        config.module.rules = [];
        config.module.rules.push(
            {
                test: /\.tsx?$/,
                use: "babel-loader",
                include: [
                    path.resolve(repoRootDir, "RTSChromeExtension", "src"),
                    path.resolve(repoRootDir, "RTSChromeExtension", ".storybook"),
                    path.resolve(repoRootDir, "ReactTestSelector", "src"),
                    path.resolve(repoRootDir, "Common"),
                ],
            },
        );

        return config;
    },
};
