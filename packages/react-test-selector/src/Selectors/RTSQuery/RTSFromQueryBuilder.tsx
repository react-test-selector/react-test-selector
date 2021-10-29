import { FiberNode, FiberNodeTag, ReactSelectorToken } from "../../React17/React17FiberUtils";
import { ReactTestSelector } from "../ReactTestSelector";

import {
    RTSComponentHocsMatch,
    RTSComponentHostMatch,
    RTSElementKind,
    RTSQueryAttributeOperator,
    RTSQueryAttributesRule,
    RTSQueryComponentNameMatch,
    RTSQueryParser,
    RTSQueryPseudoSelectorType,
    RTSQueryRule,
} from "./RTSQueryParser";
import { parseComponentNameWithHocs } from "./ParseComponentNameWithHocs";
import { isNotNullOrUndefined, reject } from "../../../../shared/TypingUtils";

export function createReactSelectorFromQueryString(selectorString: string): ReactTestSelector {
    const parser = new RTSQueryParser();
    const rule = parser.parse(selectorString);
    const tokens: ReactSelectorToken[] = [];

    let currentRule: typeof rule | undefined = rule;
    while (currentRule != undefined) {
        if (currentRule.pseudo?.type === RTSQueryPseudoSelectorType.Root) {
            currentRule = currentRule.childRule;
            continue;
        }
        tokens.push(buildSelectorTokenByRule(currentRule));
        currentRule = currentRule.childRule;
    }
    return new ReactTestSelector(tokens);
}

function elementNameMatchToHocs(displayName: string | undefined, name: string, hocs: RTSComponentHostMatch): boolean {
    if (hocs.type === RTSComponentHocsMatch.NoHocs) {
        return displayName === name;
    }
    const parsedName = parseComponentNameWithHocs(displayName);
    if (parsedName == undefined || parsedName.name !== name) {
        return false;
    }
    if (hocs.type === RTSComponentHocsMatch.AnyHocs) {
        return true;
    }
    if (hocs.type === RTSComponentHocsMatch.StartsWithHoc) {
        return parsedName.hocs[0] === hocs.name;
    }
    if (hocs.type === RTSComponentHocsMatch.EndsByHoc) {
        return parsedName.hocs[parsedName.hocs.length - 1] === hocs.name;
    }
    if (hocs.type === RTSComponentHocsMatch.ContainsHoc) {
        return parsedName.hocs.find(x => x === name) != undefined;
    }
    return false;
}

function createElementToken(element: RTSQueryComponentNameMatch | undefined): ReactSelectorToken {
    if (element == undefined) {
        return () => true;
    }
    if (element.type === RTSElementKind.AnyElement) {
        return (node: FiberNode) =>
            node.tag === FiberNodeTag.FunctionComponent ||
            node.tag === FiberNodeTag.ClassComponent ||
            node.tag === FiberNodeTag.HostComponent;
    }
    if (element.type === RTSElementKind.Component) {
        return (node: FiberNode) => {
            if (node.tag === FiberNodeTag.SimpleMemoComponent) {
                const displayName =
                    typeof node.elementType !== "string"
                        ? node.elementType?.displayName ?? node.elementType?.name
                        : undefined;
                return elementNameMatchToHocs(displayName, element.name, element.hocs);
            }
            if (node.tag === FiberNodeTag.MemoComponent) {
                const displayName =
                    typeof node.elementType !== "string"
                        ? node.elementType?.displayName ?? node.elementType?.name
                        : undefined;
                return elementNameMatchToHocs(displayName, element.name, element.hocs);
            }
            if (node.tag === FiberNodeTag.ForwardRef) {
                const displayName =
                    typeof node.elementType !== "string"
                        ? node.elementType?.displayName ?? node.elementType?.name
                        : undefined;
                return elementNameMatchToHocs(displayName, element.name, element.hocs);
            }
            if (node.tag === FiberNodeTag.FunctionComponent) {
                const displayName =
                    typeof node.elementType !== "string"
                        ? node.elementType?.displayName ?? node.elementType?.name
                        : undefined;
                return elementNameMatchToHocs(displayName, element.name, element.hocs);
            }
            if (node.tag === FiberNodeTag.ClassComponent) {
                const displayName =
                    typeof node.elementType !== "string"
                        ? node.elementType?.displayName ?? node.elementType?.name
                        : undefined;
                return elementNameMatchToHocs(displayName, element.name, element.hocs);
            }
            return false;
        };
    }
    if (element.type === RTSElementKind.Tag) {
        return (node: FiberNode) => {
            if (node.tag === FiberNodeTag.HostComponent) {
                return node.elementType === element.name;
            }
            return false;
        };
    }
    return () => true;
}

function getAttributeOrProps(node: FiberNode, attributeName: string): string | undefined {
    const memoizedProp = node.memoizedProps?.[attributeName];
    if (
        typeof memoizedProp === "object" ||
        typeof memoizedProp === "string" ||
        typeof memoizedProp === "number" ||
        typeof memoizedProp === "boolean" ||
        typeof memoizedProp === "symbol"
    ) {
        return memoizedProp?.toString();
    }
    if (Array.isArray(memoizedProp)) {
        return memoizedProp
            .map(x => {
                if (
                    typeof x === "object" ||
                    typeof x === "string" ||
                    typeof x === "number" ||
                    typeof x === "boolean" ||
                    typeof x === "symbol"
                ) {
                    const toString: string | undefined = x?.toString();
                    return toString;
                }
                return `${x}`;
            })
            .filter(isNotNullOrUndefined)
            .join(",");
    }
    return `${memoizedProp}`;
}

function getAttributeOrPropsExtended(
    node: FiberNode,
    attributeName: string
): Array<undefined | string> | string | undefined {
    const memoizedProp = node.memoizedProps?.[attributeName];
    if (Array.isArray(memoizedProp)) {
        return memoizedProp.map(x => {
            if (
                typeof x === "object" ||
                typeof x === "string" ||
                typeof x === "number" ||
                typeof x === "boolean" ||
                typeof x === "symbol"
            ) {
                const toString: string | undefined = x?.toString();
                return toString;
            }
            return `${x}`;
        });
    }
    if (
        typeof memoizedProp === "object" ||
        typeof memoizedProp === "string" ||
        typeof memoizedProp === "number" ||
        typeof memoizedProp === "boolean" ||
        typeof memoizedProp === "symbol"
    ) {
        return memoizedProp?.toString();
    }
    return `${memoizedProp}`;
}

function createAttributeToken(attributeRule: RTSQueryAttributesRule): ReactSelectorToken {
    switch (attributeRule.operator) {
        case RTSQueryAttributeOperator.Equals:
            return node => getAttributeOrProps(node, attributeRule.attributeName) === attributeRule.value;
            break;
        case RTSQueryAttributeOperator.EqualsInWhitespaceSeparated:
            return node => {
                const value = getAttributeOrPropsExtended(node, attributeRule.attributeName);
                if (Array.isArray(value)) {
                    return value.some(x => x?.trim() === attributeRule.value);
                } else {
                    const list = value?.split(" ") ?? [];
                    return list.some(x => x.trim() === attributeRule.value);
                }
            };
            break;
        case RTSQueryAttributeOperator.StartsWith:
            return node =>
                getAttributeOrProps(node, attributeRule.attributeName)?.startsWith(attributeRule.value ?? reject()) ??
                false;
            break;
        case RTSQueryAttributeOperator.EndsBy:
            return node =>
                getAttributeOrProps(node, attributeRule.attributeName)?.endsWith(attributeRule.value ?? reject()) ??
                false;
            break;
        case RTSQueryAttributeOperator.Contains:
            return node =>
                getAttributeOrProps(node, attributeRule.attributeName)?.includes(attributeRule.value ?? reject()) ??
                false;
            break;
        case RTSQueryAttributeOperator.Exists:
            return node => node.memoizedProps != undefined && attributeRule.attributeName in node.memoizedProps;
            break;
    }
    return () => false;
}

function createAttributesToken(attributes: RTSQueryAttributesRule[] | undefined): ReactSelectorToken {
    if (attributes == undefined || attributes.length === 0) {
        return () => true;
    }
    return intersectTokens(attributes.map(createAttributeToken));
}

function buildSelectorTokenByRule(currentRule: RTSQueryRule): ReactSelectorToken {
    return intersectTokens([createElementToken(currentRule.element), createAttributesToken(currentRule.attributes)]);
}

function intersectTokens(tokens: ReactSelectorToken[]): ReactSelectorToken {
    return node => tokens.every(token => token(node));
}
