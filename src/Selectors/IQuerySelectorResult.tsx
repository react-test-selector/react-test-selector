import { FiberNode } from "../ReactFiber/ReactFiberUtils";

export interface IQuerySelectorResult {
    querySelector(selectorString: string): IQuerySelectorResult;
    iterateNodes(): Iterable<FiberNode>;
    hasNodes(): boolean;
    at(index: number): IQuerySelectorResult;
    getDomElements(): Array<Element | undefined>;
    getDomElement(): Element | undefined;
    getProps(): Record<string, unknown>;
}
