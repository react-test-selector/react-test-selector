import * as React from "react";

import { ElementRenderInfo, ElementType } from "../../ContentScript/ContentScriptProtocol";
import { parseComponentNameWithHocs } from "../../../../react-test-selector/src/Selectors/RTSQuery/ParseComponentNameWithHocs";

import {
    Count,
    ElementName,
    PropName,
    PropsItem,
    PropValue,
    ResultItem,
    ResultItemProps,
    Results,
    Root,
    SelectorInput,
} from "./SelectorWatchPanel.styles";

interface SelectorWatchPanelProps {
    selector: string;
    onChangeSelector: (nextValue: string) => void;
    foundElements: ElementRenderInfo[];
}

export function SelectorWatchPanel(props: SelectorWatchPanelProps): JSX.Element {
    const renderElementType = (elementType: ElementType) => {
        if (typeof elementType === "string") {
            return "<" + elementType;
        }
        if (elementType?.name == undefined) {
            return "<Unknown />";
        }
        const parsedName = parseComponentNameWithHocs(elementType?.name);
        if (parsedName?.hocs.length === 0) {
            return `<${parsedName?.name}`;
        } else if (parsedName?.hocs.length === 1) {
            return `<${parsedName?.name} + ${parsedName?.hocs[0]}`;
        } else {
            return `<${parsedName?.name} + ${parsedName?.hocs[0]} + ${(parsedName?.hocs.length ?? 0) - 1} hocs`;
        }
    };

    return (
        <Root>
            <SelectorInput
                autoFocus
                value={props.selector}
                onChange={e => props.onChangeSelector(e.target.value)}
                placeholder="Type selector here... (e.. input[data-testid=MyInput])"
            />
            <Results>
                <Count>Found {props.foundElements.length} items</Count>
                {props.foundElements.slice(0, 20).map((item, index) => (
                    <ResultItem key={index}>
                        <ElementName>{renderElementType(item.elementType)}</ElementName>
                        <ResultItemProps>
                            {Object.entries(item?.serializedProps ?? {})
                                .filter(([x]) => x !== "children")
                                .map(([x, y]) => (
                                    <PropsItem key={x}>
                                        <PropName>{x}=</PropName>
                                        <PropValue>
                                            {"{"}
                                            {JSON.stringify(y, (name, value) => {
                                                if (!name) {
                                                    return value;
                                                }
                                                if (typeof value === "string" && value.length > 10) {
                                                    return "...";
                                                }
                                                return value;
                                            })}
                                            {"}"}
                                        </PropValue>
                                    </PropsItem>
                                ))}
                        </ResultItemProps>
                        <div>{"/>"}</div>
                    </ResultItem>
                ))}
            </Results>
        </Root>
    );
}
