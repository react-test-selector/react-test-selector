import { declareProtocol, method } from "../ServiceBuilder/ProtocolDeclaration";
import { createHost, HostInterface } from "../ServiceBuilder/CreateHost";

export const pageScriptProtocol = declareProtocol({
    startElementPicker: method<void, []>(false),
    stopElementPicker: method<void, []>(false),
    setWatchSelectors: method<void, [string[]]>(false),
});

export type IPageScriptImpl = HostInterface<typeof pageScriptProtocol>

export const PageScriptHost = createHost(pageScriptProtocol);
