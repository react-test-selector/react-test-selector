import * as React from "react";
import { action } from "@storybook/addon-actions";

import { storiesMeta } from "../../../.storybook/StorybookTypingUtils";
import { RTSExtensionThemeProvider } from "../Theming/RTSExtensionThemeProvider";

import { ElementInspector } from "./ElementInspector";
import { elementInfo1 } from "./StoryData1";
import { defaultElementInfo } from "./StoryData2";

export default storiesMeta({
    title: "Controls/ElementInspector",
});

export const main = () => (
    <RTSExtensionThemeProvider themeName={"light"}>
        <ElementInspector elementInfo={defaultElementInfo} pickEnabled={false} onPickClick={action("PickClick")} />
    </RTSExtensionThemeProvider>
);

export const fromCandyApp1 = () => (
    <RTSExtensionThemeProvider themeName={"light"}>
        <ElementInspector elementInfo={elementInfo1} pickEnabled={false} onPickClick={action("PickClick")} />
    </RTSExtensionThemeProvider>
);
