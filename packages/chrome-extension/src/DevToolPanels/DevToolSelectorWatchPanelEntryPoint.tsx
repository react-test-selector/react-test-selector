import "core-js/proposals/iterator-helpers";

import { render } from "react-dom";
import * as React from "react";

import {
    ContentScriptClient,
    ElementRenderInfo,
    ElementShortInfo,
    WatchResult,
} from "../ContentScript/ContentScriptProtocol";
import {
    SelectorWatchApplication,
    watchResultsValue,
} from "../Components/SelectorWatchApplication/SelectorWatchApplication";
import { createHost, HostInterface } from "../ServiceBuilder/CreateHost";
import { ChromeTabMessagesListener } from "../ServiceBuilder/Transports/Chrome/ChromeTransport";

import { devToolPanelProtocol } from "./DevToolPanelsProtocol";

const contentScriptClient = new ContentScriptClient(chrome.devtools.inspectedWindow.tabId);

const currentTabId = chrome.devtools.inspectedWindow.tabId;
const DevToolHost = createHost(devToolPanelProtocol);

class DevToolWatchPanel implements HostInterface<typeof devToolPanelProtocol> {
    public setHoveredElementInfo(args: ElementRenderInfo | undefined): Promise<void> | void {
        // noop
    }

    public setHoveredElementShortInfo(args: ElementShortInfo): Promise<void> | void {
        // noop
    }

    public setWatchResults(results: WatchResult[]): void {
        watchResultsValue.set(results);
    }
}

const host = new DevToolHost(new DevToolWatchPanel(), new ChromeTabMessagesListener(currentTabId));
host.start();

const appElement = document.createElement("div");
appElement.id = "root";
document.body.append(appElement);
render(<SelectorWatchApplication client={contentScriptClient} />, appElement);
