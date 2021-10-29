import "core-js/proposals/iterator-helpers";
import type { FiberNode } from "../../../react-test-selector/src/React16/React16FiberUtils";
import {
    findCurrentFiberUsingSlowPath,
    findFirstDomElement,
} from "../../../react-test-selector/src/React17/React17FiberUtils";
import { RootReactTestSelectorResult } from "../../../react-test-selector/src/Selectors/RootReactTestSelectorResult";
import {
    ContentScriptClientForPage,
    ElementBounds,
    ElementRenderInfo,
    IContentScriptClientForPage,
    WatchResult,
} from "../ContentScript/ContentScriptProtocol";
import { WindowMessageListener } from "../ServiceBuilder/Transports/DOM/DOMTransport";

import { IPageScriptImpl, PageScriptHost } from "./PageScriptProtocol";
import { debounce } from "./Debounce";
import { isNotNullOrUndefined } from "../../../shared/TypingUtils";

function getElementBounds(targetElement: Element): ElementBounds {
    function parseNumberSilent(input: string): number {
        const result = parseInt(input, 10);
        return isFinite(result) ? result : 0;
    }

    const rect = targetElement.getBoundingClientRect();
    const style = getComputedStyle(targetElement);
    const bounds: ElementBounds = {
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        paddingTop: parseNumberSilent(style.paddingTop),
        paddingLeft: parseNumberSilent(style.paddingLeft),
        paddingBottom: parseNumberSilent(style.paddingBottom),
        paddingRight: parseNumberSilent(style.paddingRight),
    };
    return bounds;
}

function getElementTypeName(x: FiberNode): string | undefined {
    if (typeof x.elementType === "string") {
        return x.elementType;
    } else {
        return x.elementType?.displayName ?? x.elementType?.name;
    }
    return undefined;
}

function serializeProps(memoizedProps: unknown, depth: number = 0): unknown {
    if (Array.isArray(memoizedProps)) {
        if (depth > 1) {
            return `Array(${memoizedProps.length})`;
        } else {
            return memoizedProps.map(x => serializeProps(x, depth + 1));
        }
    }
    if (memoizedProps instanceof Node) {
        return `[${memoizedProps.constructor.name}]`;
    }
    if (typeof memoizedProps === "object") {
        if (memoizedProps == undefined) {
            return memoizedProps;
        }
        if ("$$typeof" in memoizedProps) {
            // @ts-ignore
            const elementType = memoizedProps["type"];
            return `<${typeof elementType === "string" ? elementType : (elementType?.displayName ?? elementType?.name ?? "anonymous")} />`;
        }
        if (depth > 1) {
            const props = [];
            for (const prop in memoizedProps) {
                props.push(prop);
            }
            return `{ ${props.join(", ")} }`;
        } else {
            const result = {};
            for (const prop in memoizedProps) {
                // @ts-ignore
                result[prop] = serializeProps(memoizedProps[prop], depth + 1);
            }
            return result;
        }
    }
    if (typeof memoizedProps === "string" || typeof memoizedProps === "number" || typeof memoizedProps === "boolean") {
        return memoizedProps;
    }
    if (typeof memoizedProps === "function") {
        return "function () {}";
    }

    return `[${typeof memoizedProps}]`;
}

function createElementRenderInfo(
    fiberNode: FiberNode | undefined,
    skipParents: boolean = false
): undefined | ElementRenderInfo {
    if (fiberNode == undefined) {
        return undefined;
    }
    const domElement = findFirstDomElement(fiberNode);
    return {
        elementType:
            typeof fiberNode.elementType === "string"
                ? fiberNode.elementType
                : { name: fiberNode.elementType?.displayName ?? fiberNode.elementType?.name ?? "" },
        nodeTag: fiberNode.tag,
        parent: skipParents ? undefined : createElementRenderInfo(fiberNode.return ?? undefined),
        serializedProps: serializeProps(fiberNode.memoizedProps),
        bounds: domElement != undefined ? getElementBounds(domElement) : undefined,
    };
}

function extractFiberNodeFromDom(element: Element): undefined | FiberNode {
    for (const propName in element) {
        if (propName.startsWith("__reactInternalInstance$") || propName.startsWith("__reactFiber")) {
            // @ts-ignore
            return findCurrentFiberUsingSlowPath(element[propName]) ?? undefined;
        }
    }
    return undefined;
}

class PageScriptService implements IPageScriptImpl {
    private selectElement: boolean = false;
    private currentElement: Element | undefined;
    private watchedSelectors: string[] = [];
    private readonly contentScriptClient: IContentScriptClientForPage;
    private readonly sendElementDetailedInfoDebounced: (targetElement: undefined | Element) => void;

    public constructor(contentScriptClient: IContentScriptClientForPage) {
        this.contentScriptClient = contentScriptClient;
        document.addEventListener("mouseover", this.handleMouseOver);
        this.sendElementDetailedInfoDebounced = debounce(this.sendElementDetailedInfo, 300);
        setInterval(this.handleRefreshWatches, 500);
    }

    private readonly handleRefreshWatches = async () => {
        const results: WatchResult[] = [];
        for (const selector of this.watchedSelectors) {
            const result = [...new RootReactTestSelectorResult().querySelector(selector).iterateNodes()];
            results.push({
                selector: "string",
                elementRenderInfo: result.map(x => createElementRenderInfo(x, true)).filter(isNotNullOrUndefined),
            });
        }
        await this.contentScriptClient.setWatchResults(results);
    };

    private readonly sendElementDetailedInfo = async (targetElement: undefined | Element): Promise<void> => {
        if (targetElement == undefined) {
            await this.contentScriptClient.setHoveredElementInfo(undefined);
        } else {
            await this.contentScriptClient.setHoveredElementInfo(
                createElementRenderInfo(extractFiberNodeFromDom(targetElement))
            );
        }
    };

    private readonly handleMouseOver = async (e: MouseEvent) => {
        if (!this.selectElement) {
            return;
        }
        const targetElement = e.target;
        if (targetElement instanceof Element && this.currentElement !== targetElement) {
            this.currentElement = targetElement;
            const fiber = extractFiberNodeFromDom(targetElement);
            const bounds = getElementBounds(targetElement);
            await this.contentScriptClient.setHoveredElementShortInfo({
                name: fiber ? getElementTypeName(fiber) : undefined,
                bounds: bounds,
            });
            this.sendElementDetailedInfoDebounced(targetElement);
        } else {
            this.sendElementDetailedInfoDebounced(undefined);
        }
    };

    public setWatchSelectors(selectors: string[]): void {
        this.watchedSelectors = selectors;
    }

    public startElementPicker(): void {
        this.selectElement = true;
    }

    public stopElementPicker(): void {
        this.selectElement = false;
    }
}

export function pageScriptEntryPoint(instanceId: string): void {
    const contentScriptClient = new ContentScriptClientForPage();
    const pageScriptInstance = new PageScriptService(contentScriptClient);
    const host = new PageScriptHost(pageScriptInstance, new WindowMessageListener());
    host.start();
}
