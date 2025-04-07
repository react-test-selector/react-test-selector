import { FiberNode, FiberRootNode, findReactRoot } from "../ReactFiber/ReactFiberUtils";

import { QuerySelectorResult } from "./QuerySelectorResult";

export class RootReactTestSelectorResult extends QuerySelectorResult {
    public constructor() {
        super(function (): Iterable<FiberNode> {
            const root = RootReactTestSelectorResult.findReactRoots();
            if (root == undefined) {
                return [];
            }
            return root.map(x => x.current);
        });
    }

    public static findReactRoot(): undefined | FiberRootNode {
        return RootReactTestSelectorResult.findReactRoots()[0];
    }

    private static findReactRoots(rootCssSelector?: string): FiberRootNode[] {
        return findReactRoot();
    }
}
