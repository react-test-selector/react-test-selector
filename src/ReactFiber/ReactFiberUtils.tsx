import { ComponentType } from "react";
import { Predicate } from "../Utils/Funcs";
import { concat, find } from "../Utils/IterUtils";
import {reject} from "../Utils/TypingUtils";


export type ReactSelectorToken = Predicate<FiberNode>;

type ReactProps = Record<string, unknown>;
type ReactState = Record<string, unknown>;

enum FiberNodeMode {
    Mode8 = 8,
}

export enum FiberNodeTag {
    FunctionComponent = 0,
    ClassComponent = 1,
    IndeterminateComponent = 2,
    HostRoot = 3,
    HostPortal = 4,
    HostComponent = 5,
    HostText = 6,
    Fragment = 7,
    Mode = 8,
    ContextConsumer = 9,
    ContextProvider = 10,
    ForwardRef = 11,
    Profiler = 12,
    SuspenseComponent = 13,
    MemoComponent = 14,
    SimpleMemoComponent = 15,
    LazyComponent = 16,
    IncompleteClassComponent = 17,
    DehydratedFragment = 18,
    SuspenseListComponent = 19,
    FundamentalComponent = 20,
    ScopeComponent = 21,
    Block = 22,
    OffscreenComponent = 23,
    LegacyHiddenComponent = 24,
}

type FiberNodeType = string;
type FiberNodeElementType = string | ComponentType;

export interface FiberRootNode {
    callbackExpirationTime: number;
    callbackNode: null;
    callbackPriority: number;
    containerInfo: HTMLElement;
    context: unknown;
    current: FiberNode;
    finishedExpirationTime: number;
    finishedWork: null;
    firstPendingTime: number;
    firstSuspendedTime: number;
    hydrate: boolean;
    interactionThreadID: number;
    lastExpiredTime: number;
    lastPingedTime: number;
    lastSuspendedTime: number;
    memoizedInteractions: unknown;
    nextKnownPendingLevel: number;
    pendingChildren: null;
    pendingContext: null;
    pendingInteractionMap: unknown;
    pingCache: null;
    tag: number;
}

export interface FiberNode {
    tag: FiberNodeTag;
    child: null | FiberNode;
    sibling: null | FiberNode;
    current?: null | FiberNode;
    return: null | FiberNode;

    actualDuration: number;
    actualStartTime: number;
    alternate: FiberNode;
    childExpirationTime: number;
    dependencies: null | unknown;
    effectTag: number;
    elementType: null | FiberNodeElementType;
    expirationTime: number;
    firstEffect: null | FiberNode;
    index: number;
    key: null | unknown;
    lastEffect: null | FiberNode;
    memoizedProps: null | ReactProps;
    memoizedState: ReactState;
    mode: FiberNodeMode;
    nextEffect: null | FiberNode;
    pendingProps: null | ReactProps;
    ref: null | Function;
    selfBaseDuration: number;
    stateNode: FiberNode | HTMLElement;
    treeBaseDuration: number;
    type: null | FiberNodeType;
    updateQueue: unknown;
}

export function findReactRoot(rootCssSelector?: string): undefined | FiberRootNode {
    if (rootCssSelector) {
        const rootElement = document.querySelector(rootCssSelector);

        // @ts-ignore
        return rootElement?.["_reactRootContainer"]?.["_internalRoot"]
            ?? reject(`Root container with selector ${rootCssSelector} not found`);
    }
    // @ts-ignore
    const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, false);
    while (treeWalker.nextNode()) {
        if (treeWalker.currentNode.hasOwnProperty("_reactRootContainer")) {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return treeWalker.currentNode?.["_reactRootContainer"]?.["_internalRoot"];
        }
    }
    return undefined;
}

export function findFirstDomElement(fiber: undefined | FiberNode): Element | undefined {
    const stateNode = find(concat([fiber], flattenFiberNodes(fiber, false)),
        x => x?.stateNode instanceof Element
    )?.stateNode;
    if (stateNode != undefined && !(stateNode instanceof Element)) {
        throw new Error("InvalidProgramState");
    }
    return stateNode ?? undefined;
}

export function* flattenFiberNodes(fiber: undefined | FiberNode, searchCurrentFiber: boolean): Iterable<FiberNode> {
    if (fiber == undefined) {
        return;
    }
    const currentParent = searchCurrentFiber ? findCurrentFiberUsingSlowPath(fiber) : fiber;
    if (!currentParent) {
        return;
    }
    let node = currentParent;
    while (true) {
        if (node.child) {
            node.child.return = node;
            node = node.child;
            if (
                node.tag === FiberNodeTag.HostComponent ||
                node.tag === FiberNodeTag.HostText ||
                node.tag === FiberNodeTag.ClassComponent ||
                node.tag === FiberNodeTag.FunctionComponent ||
                node.tag === FiberNodeTag.SimpleMemoComponent ||
                node.tag === FiberNodeTag.MemoComponent ||
                node.tag === FiberNodeTag.ForwardRef
            ) {
                yield node;
            }
            continue;
        }
        if (node === currentParent) {
            return;
        }
        while (!node.sibling) {
            if (!node.return || node.return === currentParent) {
                return;
            }
            node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
        if (
            node.tag === FiberNodeTag.HostComponent ||
            node.tag === FiberNodeTag.HostText ||
            node.tag === FiberNodeTag.ClassComponent ||
            node.tag === FiberNodeTag.FunctionComponent ||
            node.tag === FiberNodeTag.SimpleMemoComponent ||
            node.tag === FiberNodeTag.MemoComponent ||
            node.tag === FiberNodeTag.ForwardRef
        ) {
            yield node;
        }
    }
}

export function findCurrentFiberUsingSlowPath(fiber: FiberNode): FiberNode | null {
    const alternate = fiber.alternate;
    if (!alternate) {
        return fiber;
    }
    let a: FiberNode = fiber;
    let b: FiberNode = alternate;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const parentA = a.return;
        if (parentA === null) {
            // We're at the root.
            break;
        }
        const parentB = parentA.alternate;
        if (parentB === null) {
            // There is no alternate. This is an unusual case. Currently, it only
            // happens when a Suspense component is hidden. An extra fragment fiber
            // is inserted in between the Suspense fiber and its children. Skip
            // over this extra fragment fiber and proceed to the next parent.
            const nextParent = parentA.return;
            if (nextParent !== null) {
                a = b = nextParent;
                continue;
            }
            // If there's no parent, we're at the root.
            break;
        }

        // If both copies of the parent fiber point to the same child, we can
        // assume that the child is current. This happens when we bailout on low
        // priority: the bailed out fiber's child reuses the current child.
        if (parentA.child === parentB.child) {
            let child = parentA.child;
            while (child) {
                if (child === a) {
                    return fiber;
                }
                if (child === b) {
                    return alternate;
                }
                child = child.sibling;
            }
        }

        if (a.return !== b.return) {
            a = parentA;
            b = parentB;
        } else {
            let didFindChild = false;
            let child = parentA.child;
            while (child) {
                if (child === a) {
                    didFindChild = true;
                    a = parentA;
                    b = parentB;
                    break;
                }
                if (child === b) {
                    didFindChild = true;
                    b = parentA;
                    a = parentB;
                    break;
                }
                child = child.sibling;
            }
            if (!didFindChild) {
                // Search parent B's child set
                child = parentB.child;
                while (child) {
                    if (child === a) {
                        didFindChild = true;
                        a = parentB;
                        b = parentA;
                        break;
                    }
                    if (child === b) {
                        didFindChild = true;
                        b = parentB;
                        a = parentA;
                        break;
                    }
                    child = child.sibling;
                }
            }
        }
    }
    if ("current" in a.stateNode && a.stateNode?.current === a) {
        return fiber;
    }
    return alternate;
}
