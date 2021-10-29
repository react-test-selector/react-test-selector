import { declareProtocol, method } from "../ServiceBuilder/ProtocolDeclaration";
import { ElementRenderInfo, ElementShortInfo, WatchResult } from "../ContentScript/ContentScriptProtocol";

export const devToolPanelProtocol = declareProtocol({
    setWatchResults: method<void, [WatchResult[]]>(false),
    setHoveredElementShortInfo: method<void, [ElementShortInfo]>(false),
    setHoveredElementInfo: method<void, [undefined | ElementRenderInfo]>(false),
});
