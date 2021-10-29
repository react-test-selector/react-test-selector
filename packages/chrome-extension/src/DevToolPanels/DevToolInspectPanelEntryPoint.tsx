import "core-js/proposals/iterator-helpers";

import { render } from "react-dom";
import * as React from "react";

import {
    ContentScriptClient,
    ElementRenderInfo,
    ElementShortInfo,
    WatchResult,
} from "../ContentScript/ContentScriptProtocol";
import { createHost, HostInterface } from "../ServiceBuilder/CreateHost";
import { ChromeTabMessagesListener } from "../ServiceBuilder/Transports/Chrome/ChromeTransport";

import { devToolPanelProtocol } from "./DevToolPanelsProtocol";
import { currentElementValue, InspectPanelApplication } from "../Components/InspectPanelApplication/InspectPanelApplication";

const currentTabId = chrome.devtools.inspectedWindow.tabId;
const DevToolHost = createHost(devToolPanelProtocol);

class DevToolInspectPanel implements HostInterface<typeof devToolPanelProtocol> {
    public setHoveredElementInfo(args: ElementRenderInfo | undefined): Promise<void> | void {
        currentElementValue.set(args);
    }

    public setHoveredElementShortInfo(args: ElementShortInfo): Promise<void> | void {
        // noop
    }

    public setWatchResults(args: WatchResult[]): void {
        // noop
    }
}

const host = new DevToolHost(new DevToolInspectPanel(), new ChromeTabMessagesListener(currentTabId));
host.start();

const client = new ContentScriptClient(currentTabId);

const appElement = document.createElement("div");
appElement.id = "root";
document.body.append(appElement);
render(<InspectPanelApplication client={client} />, appElement);
