import { IHostListener } from "../IHostListener";
import { ITransport } from "../ITransport";

export class WindowMessageListener implements IHostListener {
    public startListen(handler: (message: unknown) => void) {
        window.addEventListener("message", async e => {
            handler(e.data);
        });
    }
}

export class WindowMessageTransport implements ITransport {
    public send(message: unknown): void {
        window.postMessage(message, "*");
    }
}
