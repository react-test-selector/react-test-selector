import { FiberNode } from "../React17/React17FiberUtils";

export interface IReactTestSelectorResult {
    iterateNodes(): Iterable<FiberNode>;
    hasNodes(): boolean;
    at(index: number): IReactTestSelectorResult;
    getDomElements(): Array<Element | undefined>;
    getDomElement(): Element | undefined;
    querySelector(selectorString: string): IReactTestSelectorResult;
    getProps(): Record<string, unknown>;
}
