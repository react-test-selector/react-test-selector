import * as React from "react";
import { Global } from "@emotion/react";

import { IContentScriptClient, WatchResult } from "../../ContentScript/ContentScriptProtocol";
import { RTSExtensionThemeProvider } from "../Theming/RTSExtensionThemeProvider";
import { SelectorWatchPanel } from "../SelectorWatchPanel/SelectorWatchPanel";
import { externalValue, useExternalValue } from "../../Common/ExternalValue";

import { globalStyles } from "./SelectorWatchApplication.styles";
import { useAsyncEffect } from "../../Common/UseAsyncEffect";

export const watchResultsValue = externalValue<WatchResult[]>([]);

export function SelectorWatchApplication(props: { client: IContentScriptClient }): JSX.Element {
    const [selector, setSelector] = React.useState<string>("");
    const [watchResults] = useExternalValue(watchResultsValue);

    useAsyncEffect(async () => {
        await props.client.setWatchSelectors(selector.trim() === "" ? [] : [selector]);
    }, [selector]);

    return (
        <RTSExtensionThemeProvider themeName={chrome.devtools.panels.themeName === "dark" ? "dark" : "light"}>
            <Global styles={[globalStyles]} />
            <SelectorWatchPanel
                selector={selector}
                onChangeSelector={setSelector}
                foundElements={watchResults[0]?.elementRenderInfo ?? []}
            />
        </RTSExtensionThemeProvider>
    );
}

