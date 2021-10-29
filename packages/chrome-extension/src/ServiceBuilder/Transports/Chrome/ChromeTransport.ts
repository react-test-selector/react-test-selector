import { ITransport } from "../ITransport";

export class ChromeRuntimeListener {
    public startListen(handler: (message: unknown) => void) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            handler(message);
        });
    }
}

export class ChromeTabMessagesListener {
    private readonly tabId: number;

    public constructor(tabId: number) {
        this.tabId = tabId;
    }

    public startListen(handler: (message: unknown) => void) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (sender.tab?.id === this.tabId) {
                handler(message);
            }
        });
    }
}

export class ChromeTabMessageTransport implements ITransport {
    private readonly tabId: number;

    public constructor(tabId: number) {
        this.tabId = tabId;
    }

    public send(message: unknown): void {
        chrome.tabs.sendMessage(this.tabId, message);
    }
}

export class ChromeRuntimeTransport implements ITransport {
    public send(message: unknown): void {
        chrome.runtime.sendMessage(message);
    }
}
