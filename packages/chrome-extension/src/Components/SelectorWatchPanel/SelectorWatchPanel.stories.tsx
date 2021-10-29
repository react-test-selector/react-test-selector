import * as React from "react";
import { action } from "@storybook/addon-actions";

import { storiesMeta } from "../../../.storybook/StorybookTypingUtils";

import { SelectorWatchPanel } from "./SelectorWatchPanel";
import { resultsFromCandy1 } from "./StoryData1";

export default storiesMeta({
    title: "Controls/SelectorWatchPanel",
});

export const empty = () => (
    <SelectorWatchPanel foundElements={[]} selector={""} onChangeSelector={action("ChangeSelector")} />
);

export const withManyInputs = () => (
    <SelectorWatchPanel
        foundElements={resultsFromCandy1}
        selector={"Input"}
        onChangeSelector={action("ChangeSelector")}
    />
);
