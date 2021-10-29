import { FiberNode, FiberRootNode, findReactRoot } from "../React17/React17FiberUtils";

import { ReactTestSelectorResult } from "./ReactTestSelectorResult";

export class RootReactTestSelectorResult extends ReactTestSelectorResult {
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
