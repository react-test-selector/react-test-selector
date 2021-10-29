import { FiberNode, flattenFiberNodes, ReactSelectorToken } from "../React17/React17FiberUtils";

import { IReactTestSelectorResult } from "./IReactTestSelectorResult";
import { isReactSelectorResult, ReactTestSelectorResult } from "./ReactTestSelectorResult";
import { filter, flatMap } from "../../../shared/IterUtils";
import { reject } from "../../../shared/TypingUtils";

export class ReactTestSelector {
    private readonly tokens: ReactSelectorToken[];

    public constructor(tokens: ReactSelectorToken[]) {
        this.tokens = tokens;
    }

    public execute(startNode: IReactTestSelectorResult | FiberNode): ReactTestSelectorResult {
        return new ReactTestSelectorResult(() => {
            let startNodes: Iterable<FiberNode>;
            if (isReactSelectorResult(startNode)) {
                startNodes = startNode.iterateNodes();
            } else {
                startNodes = [startNode];
            }
            return flatMap(startNodes, x => this.findAllNodes(x, this.tokens, true));
        });
    }

    private *findAllNodes(
        startNode: FiberNode,
        tokens: ReactSelectorToken[],
        isTopLevelSearch: boolean
    ): Iterable<FiberNode> {
        if (tokens.length >= 1) {
            const [token, ...restTokens] = tokens;
            yield* flatMap(
                filter(
                    flattenFiberNodes(startNode, isTopLevelSearch), token ?? reject()
                ),
                    x => this.findAllNodes(x, restTokens, false));
        } else {
            yield startNode;
        }
    }
}
