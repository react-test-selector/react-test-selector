import { FiberNode, FiberRootNode, findReactRoot } from "../ReactFiber/ReactFiberUtils";

import { QuerySelectorResult } from "./QuerySelectorResult";

export class RootReactTestSelectorResult extends QuerySelectorResult {
    public constructor() {
        super(function (): Iterable<FiberNode> {
            const root = RootReactTestSelectorResult.findReactRoot();
            if (root == undefined) {
                return [];
            }
            return [root.current];
        });
    }

    public static findReactRoot(): undefined | FiberRootNode {
        return findReactRoot();
    }
}
