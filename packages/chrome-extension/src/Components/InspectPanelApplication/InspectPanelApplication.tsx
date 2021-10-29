import { css, Global } from "@emotion/react";
import * as React from "react";

import { externalValue, useExternalValue } from "../../Common/ExternalValue";
import { ElementRenderInfo, IContentScriptClient } from "../../ContentScript/ContentScriptProtocol";
import { RTSExtensionThemeProvider } from "../Theming/RTSExtensionThemeProvider";
import { ElementInspector } from "../ElementInspector/ElementInspector";

export const currentElementValue = externalValue<ElementRenderInfo>();
export const pickElementEnabledValue = externalValue<boolean>(false);

interface InspectPanelApplicationProps {
    client: IContentScriptClient;
}

export function InspectPanelApplication(props: InspectPanelApplicationProps): JSX.Element {
    const [elementRenderInfo] = useExternalValue(currentElementValue);
    const [pickElementEnabled] = useExternalValue(pickElementEnabledValue);

    const handlePickClick = async () => {
        await props.client.startElementPicker();
    };

    return (
        <RTSExtensionThemeProvider themeName={chrome.devtools.panels.themeName === "dark" ? "dark" : "light"}>
            <Global styles={[globalStyles]} />
            <ElementInspector
                onPickClick={handlePickClick}
                elementInfo={elementRenderInfo}
                pickEnabled={pickElementEnabled}
            />
        </RTSExtensionThemeProvider>
    );
}

const globalStyles = css({
    body: {
        margin: 0,
        padding: 0,
    },
});
