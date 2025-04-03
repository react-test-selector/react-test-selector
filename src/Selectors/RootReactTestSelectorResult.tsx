import { FiberNode, FiberRootNode, findReactRoot } from "../ReactFiber/ReactFiberUtils";

import { QuerySelectorResult } from "./QuerySelectorResult";

export class RootReactTestSelectorResult extends QuerySelectorResult {
    public constructor(rootCssSelector?: string) {
        super(function (): Iterable<FiberNode> {
            const root = RootReactTestSelectorResult.findReactRoot(rootCssSelector);
            if (root == undefined) {
                return [];
            }
            return [root.current];
        });
    }

    public static findReactRoot(rootCssSelector?: string): undefined | FiberRootNode {
        return findReactRoot(rootCssSelector);
    }
}
