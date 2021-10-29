import * as React from "react";
import { useMemo } from "react";

import { ElementBounds, ElementShortInfo } from "../../PageScript/PageScriptEntryPoint";

import { HorizontalLine, InnerOverlay, OuterOverlay, VerticalLine } from "./ElementBoundsOverlay.styles";

interface ElementBoundsOverlayProps {
    elementBounds: ElementBounds;
}

export function ElementBoundsOverlay({ elementBounds }: ElementBoundsOverlayProps): React.ReactElement {
    return (
        <>
            <OuterOverlay
                style={{
                    left: elementBounds.left,
                    top: elementBounds.top,
                    width: elementBounds.width,
                    height: elementBounds.height,
                }}
            />
            <InnerOverlay
                style={{
                    left: elementBounds.left + elementBounds.paddingLeft,
                    top: elementBounds.top + elementBounds.paddingTop,
                    width: elementBounds.width - elementBounds.paddingLeft - elementBounds.paddingRight,
                    height: elementBounds.height - elementBounds.paddingTop - elementBounds.paddingBottom,
                }}
            />
            <VerticalLine
                style={{
                    left: elementBounds.left,
                }}
            />
            <VerticalLine
                style={{
                    left: elementBounds.left + elementBounds.width,
                }}
            />
            <HorizontalLine
                style={{
                    top: elementBounds.top,
                }}
            />
            <HorizontalLine
                style={{
                    top: elementBounds.top + elementBounds.height,
                }}
            />
        </>
    );
}
