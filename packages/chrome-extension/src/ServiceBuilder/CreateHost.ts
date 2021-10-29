import type { IProtocolDeclaration, MethodDeclaration } from "./ProtocolDeclaration";
import { ProtocolMethodsBase } from "./ProtocolDeclaration";
import { IHostListener } from "./Transports/IHostListener";

type HostMethod<T> = T extends MethodDeclaration<infer TR, infer TArgs>
    ? TArgs extends unknown[]
        ? (...args: TArgs) => Promise<TR> | TR
        : never
    : never;

export interface IHost<T> {
    start(): void;
}

interface HostClass<TProtocol> {
    new (instance: HostInterfaceFromProtocol<TProtocol>, listener: IHostListener): IHost<TProtocol>;
}

export type HostInterfaceFromProtocol<TProtocol> = {
    [K in keyof TProtocol]: HostMethod<TProtocol[K]>;
};

export type HostInterface<T> = T extends IProtocolDeclaration<infer TMethodDecl>
    ? HostInterfaceFromProtocol<TMethodDecl>
    : never;

class HostBase<TProtocol extends ProtocolMethodsBase> implements IHost<TProtocol> {
    private readonly implementationInstance: HostInterfaceFromProtocol<TProtocol>;
    private readonly protocolDeclaration: IProtocolDeclaration<TProtocol>;
    private readonly listener: IHostListener;

    public constructor(
        protocolDeclaration: IProtocolDeclaration<TProtocol>,
        implementationInstance: HostInterfaceFromProtocol<TProtocol>,
        listener: IHostListener
    ) {
        this.listener = listener;
        this.protocolDeclaration = protocolDeclaration;
        this.implementationInstance = implementationInstance;
    }

    public start(): void {
        this.listener.startListen(async message => {
            // @ts-ignore
            if (message.pb === 1) {
                // @ts-ignore
                const method = this.protocolDeclaration.getMethod(message.methodName);
                if (method == undefined) {
                    return;
                }
                // @ts-ignore
                // eslint-disable-next-line prefer-spread
                await this.implementationInstance[message.methodName]?.apply(
                    this.implementationInstance,
                    // @ts-ignore
                    message.arguments
                );
                if (method?.hasResult) {
                    throw new Error("Window messages does not support responses");
                }
            }
        });
    }
}

export function createHost<TProtocol extends ProtocolMethodsBase>(
    service: IProtocolDeclaration<TProtocol>
): HostClass<TProtocol> {
    return class Host extends HostBase<TProtocol> {
        public constructor(implementationInstance: HostInterfaceFromProtocol<TProtocol>, listener: IHostListener) {
            super(service, implementationInstance, listener);
        }
    };
}
