import { declareProtocol, method } from "../ServiceBuilder/ProtocolDeclaration";
import { ClientInterface, createClient } from "../ServiceBuilder/CreateClient";
import { ChromeTabMessageTransport } from "../ServiceBuilder/Transports/Chrome/ChromeTransport";
import { HostInterface } from "../ServiceBuilder/CreateHost";
import { WindowMessageTransport } from "../ServiceBuilder/Transports/DOM/DOMTransport";

export type ElementType = string | { name: string } | undefined;

export interface ElementBounds {
    left: number;
    top: number;
    width: number;
    height: number;
    paddingTop: number;
    paddingLeft: number;
    paddingBottom: number;
    paddingRight: number;
}

export interface ElementShortInfo {
    name: undefined | string;
    bounds: ElementBounds;
}

export interface ElementRenderInfo {
    elementType: ElementType;
    bounds?: undefined | ElementBounds;
    nodeTag: number;
    serializedProps: unknown;
    parent?: ElementRenderInfo | undefined;
}

export interface WatchResult {
    selector: string;
    elementRenderInfo: ElementRenderInfo[];
}

export const pageToContentScriptProtocol = declareProtocol({
    setWatchResults: method<void, [WatchResult[]]>(false),
    setHoveredElementShortInfo: method<void, [ElementShortInfo]>(false),
    setHoveredElementInfo: method<void, [undefined | ElementRenderInfo]>(false),
});

export type IContentScriptClientForPage = ClientInterface<typeof pageToContentScriptProtocol>;

export class ContentScriptClientForPage extends createClient(pageToContentScriptProtocol) {
    public constructor() {
        super(new WindowMessageTransport());
    }
}

export const contentScriptProtocol = declareProtocol({
    startElementPicker: method<void, []>(false),
    stopElementPicker: method<void, []>(false),
    setWatchSelectors: method<void, [string[]]>(false),
    disableElementPicker: method<void, []>(false),
    enableElementPicker: method<void, []>(false),
    disableElementWatch: method<void, []>(false),
    enableElementWatch: method<void, []>(false),
});

export type IContentScriptHost = HostInterface<typeof contentScriptProtocol>;

export type IContentScriptClient = ClientInterface<typeof contentScriptProtocol>;

export class ContentScriptClient extends createClient(contentScriptProtocol) {
    public constructor(tabId: number) {
        super(new ChromeTabMessageTransport(tabId));
    }
}
