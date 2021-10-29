import * as React from "react";
import { render } from "react-dom";
import pageScriptEntryPoint from "raw-loader!../../build-tmp/page.js";

import {
    ContentScriptApplication,
    currentHoveredElementValue,
    currentWatchesValue,
    watchesEnabledValue,
} from "../Components/ElementInspectorApplication/ContentScriptApplication";
import { uuid } from "../Common/uuid";
import { ClientInterface, createClient } from "../ServiceBuilder/CreateClient";
import { pageScriptProtocol } from "../PageScript/PageScriptProtocol";
import { createHost, HostInterface } from "../ServiceBuilder/CreateHost";
import { WindowMessageListener, WindowMessageTransport } from "../ServiceBuilder/Transports/DOM/DOMTransport";
import { ChromeRuntimeListener, ChromeRuntimeTransport } from "../ServiceBuilder/Transports/Chrome/ChromeTransport";
import { devToolPanelProtocol } from "../DevToolPanels/DevToolPanelsProtocol";

import {
    contentScriptProtocol,
    ElementRenderInfo,
    ElementShortInfo,
    IContentScriptHost,
    pageToContentScriptProtocol,
    WatchResult,
} from "./ContentScriptProtocol";

const instanceId = uuid();

const PageScriptClient = createClient(pageScriptProtocol);
const PageToContentHost = createHost(pageToContentScriptProtocol);
const ContentScriptHost = createHost(contentScriptProtocol);
const DevToolPanelClient = createClient(devToolPanelProtocol);

const devToolPanelClient = new DevToolPanelClient(new ChromeRuntimeTransport());

class ContentScript implements HostInterface<typeof pageToContentScriptProtocol>, IContentScriptHost {
    private readonly pageScriptClient: ClientInterface<typeof pageScriptProtocol>;

    public constructor(pageScriptClient: ClientInterface<typeof pageScriptProtocol>) {
        this.pageScriptClient = pageScriptClient;
    }

    public async setHoveredElementInfo(elementRenderInfo: ElementRenderInfo | undefined): Promise<void> {
        await devToolPanelClient.setHoveredElementInfo(elementRenderInfo);
    }

    public async setHoveredElementShortInfo(elementShortInfo: ElementShortInfo): Promise<void> {
        currentHoveredElementValue.set(elementShortInfo);
        await devToolPanelClient.setHoveredElementShortInfo(elementShortInfo);
    }

    public async setWatchResults(results: WatchResult[]): Promise<void> {
        currentWatchesValue.set(results.map(x => x.elementRenderInfo).flat());
        await devToolPanelClient.setWatchResults(results);
    }

    public async setWatchSelectors(selectors: string[]): Promise<void> {
        await this.pageScriptClient.setWatchSelectors(selectors);
    }

    public async startElementPicker(): Promise<void> {
        await this.pageScriptClient.startElementPicker();
    }

    public async stopElementPicker(): Promise<void> {
        await this.pageScriptClient.stopElementPicker();
    }

    public async disableElementPicker(): Promise<void> {
        currentHoveredElementValue.set(undefined);
        await this.pageScriptClient.stopElementPicker();
    }

    public enableElementPicker(): void {
        // noop
    }

    public enableElementWatch(): void {
        watchesEnabledValue.set(true);
    }

    public disableElementWatch(): void {
        watchesEnabledValue.set(false);
    }
}

window.addEventListener("load", () => {
    const clientJsScriptTag = document.createElement("script");
    clientJsScriptTag.type = "text/javascript";
    clientJsScriptTag.text = `
        (function () {
            ${pageScriptEntryPoint.toString()}

            pageScript.pageScriptEntryPoint(${JSON.stringify(instanceId)})
        })()`;
    document.head.appendChild(clientJsScriptTag);
});

const pageScriptClient = new PageScriptClient(new WindowMessageTransport());

let selectElement: boolean = false;

document.addEventListener("keydown", async e => {
    if (e.altKey && e.shiftKey && e.code === "KeyS") {
        selectElement = !selectElement;
        if (selectElement) {
            await pageScriptClient.startElementPicker();
        } else {
            await pageScriptClient.stopElementPicker();
        }
    }
});

const contentScript = new ContentScript(pageScriptClient);
const pageToContentHost = new PageToContentHost(contentScript, new WindowMessageListener());
const contentScriptHost = new ContentScriptHost(contentScript, new ChromeRuntimeListener());
pageToContentHost.start();
contentScriptHost.start();

const appElement = document.createElement("div");
document.body.append(appElement);
render(<ContentScriptApplication />, appElement);
