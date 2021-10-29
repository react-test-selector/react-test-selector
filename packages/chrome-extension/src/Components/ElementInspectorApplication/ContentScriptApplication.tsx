import * as React from "react";

import { ElementBoundsOverlay } from "../ElementBoundsOverlay/ElementBoundsOverlay";
import { ElementRenderInfo, ElementShortInfo } from "../../ContentScript/ContentScriptProtocol";
import { externalValue, useExternalValue } from "../../Common/ExternalValue";

export const currentHoveredElementValue = externalValue<ElementShortInfo>();
export const watchesEnabledValue = externalValue<boolean>(false);
export const currentWatchesValue = externalValue<ElementRenderInfo[]>([]);

export function ContentScriptApplication(props: {}): React.ReactElement {
    const [watchesEnabled] = useExternalValue(watchesEnabledValue);
    const [currentWatches] = useExternalValue(currentWatchesValue);
    const [elementShortInfo] = useExternalValue(currentHoveredElementValue);

    return (
        <div>
            {watchesEnabled &&
                currentWatches.map((x, i) =>
                    x.bounds ? <ElementBoundsOverlay key={i} elementBounds={x.bounds} /> : <></>
                )}
            {elementShortInfo && <ElementBoundsOverlay elementBounds={elementShortInfo.bounds} />}
            {/* element && <ElementInspector element={element} /> */}
        </div>
    );
}
