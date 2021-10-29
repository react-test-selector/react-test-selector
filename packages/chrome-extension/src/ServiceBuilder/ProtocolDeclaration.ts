interface MethodDeclarationBase {
    readonly hasResult: boolean;
}

export interface MethodDeclaration<TR, TArgs> {
    readonly hasResult: boolean;
}

class MethodDeclarationImpl<TR, TArgs> implements MethodDeclaration<TR, TArgs> {
    public readonly hasResult: boolean;

    public constructor(hasResult: boolean) {
        this.hasResult = hasResult;
    }
}

export interface IProtocolDeclaration<TProtocol extends ProtocolMethodsBase> {
    getMethod(methodName: string): undefined | MethodDeclarationBase;
    getMethods(): Array<[string, MethodDeclarationBase]>;
}

export type ProtocolMethodsBase = Record<string, MethodDeclarationBase>;

class ProtocolDeclaration<TProtocol extends ProtocolMethodsBase> implements IProtocolDeclaration<TProtocol> {
    private readonly protocolMethods: TProtocol;

    public constructor(protocolMethods: TProtocol) {
        this.protocolMethods = protocolMethods;
    }

    public getMethod(methodName: string): undefined | MethodDeclarationBase {
        return this.protocolMethods[methodName];
    }

    public getMethods(): Array<[string, MethodDeclarationBase]> {
        return Object.entries(this.protocolMethods);
    }
}

export function declareProtocol<TProtocol extends ProtocolMethodsBase>(
    methods: TProtocol
): IProtocolDeclaration<TProtocol> {
    return new ProtocolDeclaration(methods);
}

export function method<TR, TArgs>(hasResult: boolean): MethodDeclaration<TR, TArgs> {
    return new MethodDeclarationImpl(hasResult);
}
