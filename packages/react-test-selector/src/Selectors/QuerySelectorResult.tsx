import { FiberNode, findFirstDomElement } from "../ReactFiber/ReactFiberUtils";

import { IQuerySelectorResult } from "./IQuerySelectorResult";
import { createReactSelectorFromQueryString } from "./RTSQuery/RTSFromQueryBuilder";
import { drop, find, map, single, take } from "../../../shared/IterUtils";

export class QuerySelectorResult implements IQuerySelectorResult {
    private readonly nodesIterableFactory: () => Iterable<FiberNode>;

    public constructor(nodesIterableFactory: () => Iterable<FiberNode>) {
        this.nodesIterableFactory = nodesIterableFactory;
    }

    public at(index: number): IQuerySelectorResult {
        return new QuerySelectorResult(() => take(drop(this.nodesIterableFactory(), index), 1));
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

    public querySelector(selectorString: string): IQuerySelectorResult {
        const selector = createReactSelectorFromQueryString(selectorString);
        return selector.execute(this);
    }
}

export function isQuerySelectorResult(value: unknown): value is IQuerySelectorResult {
    return value instanceof QuerySelectorResult;
}
