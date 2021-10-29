import styled from "@emotion/styled";

import { codePropNameColor, panelBorderColor } from "../Theming/Themes/RTSExtensionTheme";

export const Root = styled.div(props => ({}));
export const ResultItemProps = styled.div(props => ({ paddingLeft: 10 }));
export const ElementName = styled.div(props => ({ color: "#6A51B2", fontWeight: 700 }));
export const Results = styled.div(props => ({
    padding: "0 5px",
}));
export const Count = styled.div(props => ({
    paddingTop: 5,
    paddingBottom: 10,
}));
export const ResultItem = styled.div(props => ({
    fontFamily: "Consolas, monospace",
    fontSize: "11px",
    lineHeight: "17px",
    padding: "5px 0",
    borderBottom: `1px solid ${panelBorderColor}`,
}));
export const SelectorInput = styled.input(props => ({
    fontFamily: "Consolas, monospace",
    fontSize: "14px",
    lineHeight: "20px",
    width: "100%",
    boxSizing: "border-box",
    border: 0,
    borderBottom: `1px solid #aaa`,
    padding: 5,
    boxShadow: "0px 2px 2px 0 rgba(34, 60, 80, 0.2)",
    outline: 0,
}));
export const PropertiesPanelContent = styled.div(props => ({
    flex: "1 1 100%",
    padding: 5,
    overflow: "auto",
}));
export const PropsItem = styled.div(props => ({
    fontFamily: "Consolas, monospace",
    fontSize: "11px",
    lineHeight: "17px",
    display: "flex",
}));
export const PropName = styled.div(props => ({
    flex: "0 1",
    color: codePropNameColor,
    whiteSpace: "nowrap",
}));
export const PropValue = styled.pre(props => ({
    flex: "0 1 50%",
    margin: 0,
}));
