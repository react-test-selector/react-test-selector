export interface IHostListener {
    startListen(handler: (message: unknown) => void): void;
}
