import { ContentScriptClient } from "../ContentScript/ContentScriptProtocol";

const client = new ContentScriptClient(chrome.devtools.inspectedWindow.tabId);

chrome.devtools.panels.create("RTS Inspect", "", "devtool-inspect.html", function (panel) {
    panel.onHidden.addListener(async () => {
        await client.disableElementPicker();
    });
    panel.onShown.addListener(async () => {
        await client.enableElementPicker();
    });
});

chrome.devtools.panels.create("RTS Watch", "", "devtool-selector-watch.html", function (panel) {
    panel.onHidden.addListener(async () => {
        await client.disableElementWatch();
    });
    panel.onShown.addListener(async () => {
        await client.enableElementWatch();
    });
});
