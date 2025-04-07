import { reject } from "../../Utils/TypingUtils";

export enum RTSComponentHocsMatch {
    NoHocs,
    AnyHocs,
    StartsWithHoc,
    EndsByHoc,
    ContainsHoc,
}

export type RTSComponentHostMatch =
    | { type: RTSComponentHocsMatch.NoHocs }
    | { type: RTSComponentHocsMatch.AnyHocs }
    | { type: RTSComponentHocsMatch.StartsWithHoc; name: string }
    | { type: RTSComponentHocsMatch.EndsByHoc; name: string }
    | { type: RTSComponentHocsMatch.ContainsHoc; name: string };

export type RTSQueryComponentNameMatch =
    | { type: RTSElementKind.AnyElement }
    | { type: RTSElementKind.Tag; name: string }
    | {
          type: RTSElementKind.Component;
          name: string;
          hocs: RTSComponentHostMatch;
      };

export enum RTSQueryAttributeOperator {
    Equals = "=",
    EqualsInWhitespaceSeparated = "~=",
    StartsWith = "^=",
    EndsBy = "$=",
    Contains = "*=",
    Exists = "",
}

export interface RTSQueryAttributesRule {
    attributeName: string;
    operator: RTSQueryAttributeOperator;
    value?: string;
}

export enum RTSElementKind {
    AnyElement,
    Tag,
    Component,
}

export enum RTSQueryPseudoSelectorType {
    Root = ":root",
}

interface RTSQueryPseudoSelector {
    type: RTSQueryPseudoSelectorType.Root;
}

export interface RTSQueryRule {
    element?: RTSQueryComponentNameMatch;
    attributes?: RTSQueryAttributesRule[];
    pseudo?: RTSQueryPseudoSelector;
    childRule?: RTSQueryRule;
}

export class RTSQueryParser {
    public parse(selectorString: string): RTSQueryRule {
        try {
            const combinedRules = this.splitIIntoCombinedRules(selectorString);
            let result: undefined | RTSQueryRule;
            let currentRule: undefined | RTSQueryRule;
            for (const ruleString of combinedRules) {
                if (currentRule == undefined) {
                    currentRule = this.parseSingleRule(ruleString);
                    result = currentRule;
                } else {
                    currentRule.childRule = this.parseSingleRule(ruleString);
                    currentRule = currentRule.childRule;
                }
            }
            return result ?? reject(`Selector string cannot be parsed: '${selectorString}'`);
        } catch (e) {
            throw new Error(`Failed to parse selector '${selectorString}'\n${e}`);
        }
    }

    private parseSingleRule(ruleString: string): RTSQueryRule {
        if (ruleString === ":root") {
            return {
                pseudo: { type: RTSQueryPseudoSelectorType.Root },
            };
        }
        const currentRule: RTSQueryRule = {};
        const [tagOrComponentSpec, ...rest] = ruleString.split("[");
        const attributesSpec = rest.length === 0 ? "" : "[" + rest.join("[");
        currentRule.element = this.parseElementSelector(tagOrComponentSpec);
        currentRule.attributes = this.parseAttributesSelectors(attributesSpec);
        return currentRule;
    }

    private splitIIntoCombinedRules(selectorString: string) {
        return selectorString.split(/ (?![^\[]*\])/);
    }

    private parseAttributesSelectors(attributesSelectorString: string): undefined | RTSQueryAttributesRule[] {
        if (attributesSelectorString === "") {
            return undefined;
        }
        const attributeSelectors = this.extractAttributesSelectors(attributesSelectorString);
        return attributeSelectors.map(x => this.parseAttributesSelector(x));
    }

    private extractAttributesSelectors(attributesSelectorString: string): string[] {
        type AttributeSelectorSetParseState =
            | "Start"
            | "Selector"
            | "DoubleQuoted"
            | "DoubleQuotedEscape"
            | "SingleQuoted"
            | "SingleQuotedEscape";

        const result: string[] = [];
        let currentSelector = "";
        let state: AttributeSelectorSetParseState = "Start";
        for (const char of attributesSelectorString) {
            switch (state) {
                case "Start":
                    if (char === "[") {
                        state = "Selector";
                    } else {
                        return reject(`Expected [, bug got ${char}`);
                    }
                    break;
                case "Selector":
                    if (char === '"') {
                        currentSelector += char;
                        state = "DoubleQuoted";
                    } else if (char === "'") {
                        currentSelector += char;
                        state = "SingleQuoted";
                    } else if (char === "]") {
                        result.push(currentSelector);
                        currentSelector = "";
                        state = "Start";
                    } else {
                        currentSelector += char;
                    }
                    break;
                case "DoubleQuoted":
                    if (char === '"') {
                        currentSelector += char;
                        state = "Selector";
                    } else if (char === "\\") {
                        currentSelector += char;
                        state = "DoubleQuotedEscape";
                    } else {
                        currentSelector += char;
                    }
                    break;
                case "DoubleQuotedEscape":
                    currentSelector += char;
                    state = "DoubleQuoted";
                    break;
                case "SingleQuoted":
                    if (char === "'") {
                        currentSelector += char;
                        state = "Selector";
                    } else if (char === "\\") {
                        currentSelector += char;
                        state = "SingleQuotedEscape";
                    } else {
                        currentSelector += char;
                    }
                    break;
                case "SingleQuotedEscape":
                    currentSelector += char;
                    state = "SingleQuoted";
                    break;
            }
        }
        if (state === "Start") {
            return result;
        } else if (state === "Selector") {
            return reject("Expected ]");
        } else if (state === "DoubleQuoted") {
            return reject('Expected "');
        } else if (state === "DoubleQuotedEscape") {
            return reject("Expected char");
        } else if (state === "SingleQuoted") {
            return reject("Expected '");
        } else if (state === "SingleQuotedEscape") {
            return reject("Expected char");
        }
        return reject(`Unexpected state: ${state}`);
    }

    private parseAttributesSelector(attributesSpec: string): RTSQueryAttributesRule {
        const attributeSelectorRegEx = /^([^=~*\^\$\]]+?)\s*(([~*\^\$]?=)\s*(.*?))?$/;
        const attributeSelectorMatch = attributeSelectorRegEx.exec(attributesSpec);
        if (attributeSelectorMatch) {
            let attributesRule: RTSQueryAttributesRule;
            const name = attributeSelectorMatch[1] ?? reject();
            const operatorString = attributeSelectorMatch[3];
            const value = attributeSelectorMatch[4];
            if (operatorString != undefined && value != undefined) {
                let operator: RTSQueryAttributeOperator;
                if (operatorString === "=") {
                    operator = RTSQueryAttributeOperator.Equals;
                } else if (operatorString === "^=") {
                    operator = RTSQueryAttributeOperator.StartsWith;
                } else if (operatorString === "$=") {
                    operator = RTSQueryAttributeOperator.EndsBy;
                } else if (operatorString === "*=") {
                    operator = RTSQueryAttributeOperator.Contains;
                } else if (operatorString === "~=") {
                    operator = RTSQueryAttributeOperator.EqualsInWhitespaceSeparated;
                } else {
                    throw new Error();
                }
                attributesRule = {
                    attributeName: name,
                    operator: operator,
                    value: this.unwrapAttributeValue(value),
                };
            } else {
                attributesRule = {
                    attributeName: name,
                    operator: RTSQueryAttributeOperator.Exists,
                };
            }
            return attributesRule;
        } else {
            throw new Error(`Invalid attribute selector: ${attributesSpec}`);
        }
    }

    private parseElementSelector(tagOrComponentSpec: string | undefined): RTSQueryComponentNameMatch {
        if (tagOrComponentSpec != undefined && tagOrComponentSpec !== "" && tagOrComponentSpec !== "*") {
            if (tagOrComponentSpec.includes("**")) {
                const anyHocRegEx = /^\*\*\(([^\(\)]+)\)$/;
                const anyHocMatch = anyHocRegEx.exec(tagOrComponentSpec);
                if (anyHocMatch) {
                    return {
                        type: RTSElementKind.Component,
                        name: anyHocMatch[1] ?? reject(),
                        hocs: { type: RTSComponentHocsMatch.AnyHocs },
                    };
                }
                const startsWithHocRegEx = /^([^\(\)]+)\(\*\*\(([^\(\)]+)\)\)$/;
                const startsWithHocMatch = startsWithHocRegEx.exec(tagOrComponentSpec);
                if (startsWithHocMatch) {
                    return {
                        type: RTSElementKind.Component,
                        name: startsWithHocMatch[2] ?? reject(),
                        hocs: { type: RTSComponentHocsMatch.StartsWithHoc, name: startsWithHocMatch[1] ?? reject() },
                    };
                }
                const endsByHocRegEx = /^\*\*\(([^\(\)]+)\(([^\(\)]+)\)\)$/;
                const endsByHocMatch = endsByHocRegEx.exec(tagOrComponentSpec);
                if (endsByHocMatch) {
                    return {
                        type: RTSElementKind.Component,
                        name: endsByHocMatch[2] ?? reject(),
                        hocs: { type: RTSComponentHocsMatch.EndsByHoc, name: endsByHocMatch[1] ?? reject() },
                    };
                }
                const containsHocRegEx = /^\*\*\(([^\(\)]+)\(\*\*\(([^\(\)]+)\)\)\)$/;
                const containsHocMatch = containsHocRegEx.exec(tagOrComponentSpec);
                if (containsHocMatch) {
                    return {
                        type: RTSElementKind.Component,
                        name: containsHocMatch[2] ?? reject(),
                        hocs: { type: RTSComponentHocsMatch.ContainsHoc, name: containsHocMatch[1] ?? reject() },
                    };
                }
            }
            if (tagOrComponentSpec[0] === tagOrComponentSpec[0]?.toUpperCase() || tagOrComponentSpec.includes("(")) {
                return {
                    type: RTSElementKind.Component,
                    name: tagOrComponentSpec,
                    hocs: { type: RTSComponentHocsMatch.NoHocs },
                };
            } else {
                return { type: RTSElementKind.Tag, name: tagOrComponentSpec };
            }
        } else {
            return { type: RTSElementKind.AnyElement };
        }
    }

    private unwrapAttributeValue(value: string): string {
        if (value.startsWith("'") && value.endsWith("'")) {
            return value
                .substring(1, value.length - 1)
                .replace(/\\'/g, "'")
                .replace(/\\\\/g, "\\");
        }
        if (value.startsWith('"') && value.endsWith('"')) {
            const result = JSON.parse(value);
            return typeof result === "string" ? result : reject();
        }
        return value;
    }
}
