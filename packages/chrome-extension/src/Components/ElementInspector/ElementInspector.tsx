import * as React from "react";
import { Global } from "@emotion/react";

import { ElementRenderInfo, ElementType } from "../../ContentScript/ContentScriptProtocol";
import { parseComponentNameWithHocs } from "../../../../react-test-selector/src/Selectors/RTSQuery/ParseComponentNameWithHocs";

import {
    ComponentsPanel,
    CurrentComponent,
    globalStyles,
    InspectLayout,
    ParentChain,
    ParentChainHeader,
    ParentChainItem,
    PropertiesPanel,
    PropertiesPanelContent,
    PropName,
    PropsItem,
    PropValue,
    Root,
    SvgIcon,
    TopPanel,
    TopPanelButton,
    TopPanelTab,
} from "./ElementInspector.styles";

interface ElementInspectorProps {
    elementInfo: undefined | ElementRenderInfo;
    pickEnabled: boolean;
    onPickClick: () => void;
}

export function ElementInspector(props: ElementInspectorProps): JSX.Element {
    const renderElementType = (elementType: ElementType) => {
        if (typeof elementType === "string") {
            return "<" + elementType + " />";
        }
        if (elementType?.name == undefined) {
            return "<Unknown />";
        }
        const parsedName = parseComponentNameWithHocs(elementType?.name);
        if (parsedName?.hocs.length === 0) {
            return `<${parsedName?.name} />`;
        } else if (parsedName?.hocs.length === 1) {
            return `<${parsedName?.name} /> + ${parsedName?.hocs[0]}`;
        } else {
            return `<${parsedName?.name} /> + ${parsedName?.hocs[0]} + ${(parsedName?.hocs.length ?? 0) - 1} hocs`;
        }
    };

    const [currentElement, setCurrentElement] = React.useState<undefined | ElementRenderInfo>(props.elementInfo);

    // @ts-ignore
    return (
        <Root>
            <Global styles={[globalStyles]} />
            <TopPanel>
                <TopPanelButton onClick={props.onPickClick} active={props.pickEnabled}>
                    <SelectElementIcon /> Pick element (Alt + Shift + S)
                </TopPanelButton>
            </TopPanel>
            <InspectLayout>
                <ComponentsPanel>
                    {props.elementInfo && (
                        <>
                            <CurrentComponent
                                current={currentElement === props.elementInfo}
                                onClick={() => setCurrentElement(props.elementInfo)}>
                                {renderElementType(props.elementInfo.elementType)}
                            </CurrentComponent>
                            <ParentChain>
                                <ParentChainHeader>Rendered by</ParentChainHeader>
                                {[...flattenRenderChain(props.elementInfo)].slice(1).map((element, index) => (
                                    <ParentChainItem
                                        key={index}
                                        current={currentElement === element}
                                        onClick={() => setCurrentElement(element)}>
                                        {renderElementType(element.elementType)}
                                    </ParentChainItem>
                                ))}
                            </ParentChain>
                        </>
                    )}
                </ComponentsPanel>
                <PropertiesPanel>
                    <TopPanel>
                        <TopPanelTab current>Props</TopPanelTab>
                    </TopPanel>
                    <PropertiesPanelContent>
                        {Object.entries(currentElement?.serializedProps ?? {}).map(([x, y]) => (
                            <PropsItem>
                                <PropName>{x}:</PropName>
                                <PropValue>{JSON.stringify(y, undefined, "  ")}</PropValue>
                            </PropsItem>
                        ))}
                    </PropertiesPanelContent>
                </PropertiesPanel>
            </InspectLayout>
        </Root>
    );
}

function* flattenRenderChain(startElement: ElementRenderInfo): Iterable<ElementRenderInfo> {
    let currentElement = startElement;
    while (currentElement.parent != undefined) {
        yield currentElement;
        currentElement = currentElement.parent;
    }
}

export function SelectElementIcon(): JSX.Element {
    return (
        <SvgIcon>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" />
                <path d="M18 27L15 15L27 19L21 21L18 27Z" fill="#5F6368" />
                <path d="M12 27H5V5H27V12M15 15L18 27L21 21L27 19L15 15Z" stroke="#5F6368" strokeWidth="2" />
                <path d="M21.5 21.5L28 28" stroke="#5F6368" strokeWidth="2" />
            </svg>
        </SvgIcon>
    );
}
