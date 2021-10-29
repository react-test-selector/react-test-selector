import { FiberNode, findFirstDomElement } from "../React17/React17FiberUtils";

import { IReactTestSelectorResult } from "./IReactTestSelectorResult";
import { createReactSelectorFromQueryString } from "./RTSQuery/RTSFromQueryBuilder";
import { drop, find, map, single, take } from "../../../shared/IterUtils";

export class ReactTestSelectorResult implements IReactTestSelectorResult {
    private readonly nodesIterableFactory: () => Iterable<FiberNode>;

    public constructor(nodesIterableFactory: () => Iterable<FiberNode>) {
        this.nodesIterableFactory = nodesIterableFactory;
    }

    public at(index: number): IReactTestSelectorResult {
        return new ReactTestSelectorResult(() => take(drop(this.nodesIterableFactory(), index), 1));
    }

    public hasNodes(): boolean {
        for (const _node of this.iterateNodes()) {
            return true;
        }
        return false;
    }

    public getDomElement(): Element | undefined {
        return find(map(this.iterateNodes(), x => findFirstDomElement(x)), x => true);
    }

    public getDomElements(): Array<Element | undefined> {
        return [...map(this.iterateNodes(), x => findFirstDomElement(x))];
    }

    public getProps(): Record<string, unknown> {
        const singleFiberNode = single(this.iterateNodes());
        return singleFiberNode.memoizedProps ?? {};
    }

    public iterateNodes(): Iterable<FiberNode> {
        return this.nodesIterableFactory();
    }

    public printNodes(): void {
        const nodes = this.nodesIterableFactory();
        for (const node of nodes) {
            // eslint-disable-next-line no-console
            console.log(node);
        }
    }

    public querySelector(selectorString: string): IReactTestSelectorResult {
        const selector = createReactSelectorFromQueryString(selectorString);
        return selector.execute(this);
    }
}

export function isReactSelectorResult(value: unknown): value is IReactTestSelectorResult {
    return value instanceof ReactTestSelectorResult;
}
