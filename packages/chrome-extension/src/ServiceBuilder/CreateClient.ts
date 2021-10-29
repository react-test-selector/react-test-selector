import { IProtocolDeclaration, MethodDeclaration, ProtocolMethodsBase } from "./ProtocolDeclaration";
import { ITransport } from "./Transports/ITransport";

type ClientMethod<T> = T extends MethodDeclaration<infer TR, infer TArgs>
    ? TArgs extends unknown[]
        ? (...args: TArgs) => Promise<TR>
        : never
    : never;

export type Client<TProtocol> = {
    [K in keyof TProtocol]: ClientMethod<TProtocol[K]>;
};

export interface ClientClass<TMethodDecl> {
    new (transport: ITransport): Client<TMethodDecl>;
}

export type ClientInterface<TDeclaration> = TDeclaration extends IProtocolDeclaration<infer TProtocol>
    ? Client<TProtocol>
    : never;

export function createClient<TProtocol extends ProtocolMethodsBase>(
    protocol: IProtocolDeclaration<TProtocol>
): ClientClass<TProtocol> {
    class ClientBase {
        protected readonly transport: ITransport;

        public constructor(transport: ITransport) {
            this.transport = transport;
        }
    }

    for (const [name, _method] of protocol.getMethods()) {
        // @ts-ignore
        ClientBase.prototype[name] = function (this: ClientBase, ...args: unknown[]) {
            this.transport.send({
                pb: 1,
                methodName: name,
                arguments: args,
            });
        };
    }
    // @ts-ignore
    return ClientBase;
}
