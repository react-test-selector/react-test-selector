import styled from "@emotion/styled";
import { css } from "@emotion/react";

import {
    codePropNameColor,
    itemCurrentBgColor,
    itemHoverBgColor,
    panelBgColor,
    panelBorderColor,
    panelButtonActiveColor,
    panelButtonHoverColor,
    primaryFontColor,
    tabUnderlineColor,
} from "../Theming/Themes/RTSExtensionTheme";

export const Root = styled.div(props => ({
    color: primaryFontColor,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
}));

export const TopPanel = styled.div(props => ({
    backgroundColor: panelBgColor,
    borderBottom: `1px solid ${panelBorderColor}`,
    height: props.theme.rts.token(5),
}));

export const InspectLayout = styled.div(props => ({
    display: "flex",
    flex: "1 1 100%",
    overflow: "hidden",
}));

export const SvgIcon = styled.div(props => ({
    display: "inline-block",

    "> svg": {
        marginTop: "-1px",
        marginBottom: "-3px",
    },
}));

export const TopPanelButton = styled.div<{ active?: boolean }>(props => ({
    display: "inline-block",
    backgroundColor: props.active ? panelButtonActiveColor : panelBgColor,
    cursor: "pointer",
    ":hover": {
        backgroundColor: props.active ? panelButtonActiveColor : panelButtonHoverColor,
    },
    height: props.theme.rts.token(5),
    padding: `${props.theme.rts.token(1)}px ${props.theme.rts.token(2)}px`,
    boxSizing: "border-box",
}));

export const TopPanelTab = styled.div<{ current?: boolean }>(props => ({
    display: "inline-block",
    backgroundColor: panelBgColor,
    cursor: "pointer",
    ":hover": {
        backgroundColor: panelButtonHoverColor,
    },
    height: props.theme.rts.token(5),
    padding: `${props.theme.rts.token(1)}px ${props.theme.rts.token(2)}px`,
    borderBottom: props.current ? `2px solid ${tabUnderlineColor}` : undefined,
    boxSizing: "border-box",
}));

export const ComponentsPanel = styled.div(props => ({
    padding: "5px 2px",
    flex: "0 1 50%",
    overflow: "auto",
}));

export const PropertiesPanel = styled.div(props => ({
    flex: "0 1 50%",
    borderLeft: `1px solid ${panelBorderColor}`,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
}));

export const CurrentComponent = styled.div<{ current?: boolean }>(props => ({
    fontFamily: "Consolas, monospace",
    fontSize: "11px",
    lineHeight: "17px",
    padding: "0 5px",
    cursor: "default",

    backgroundColor: props.current ? itemCurrentBgColor : undefined,
    ":hover": {
        borderRadius: 2,
        backgroundColor: props.current ? itemCurrentBgColor : itemHoverBgColor,
    },
}));

export const ParentChain = styled.div(props => ({}));

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
    marginRight: 5,
    color: codePropNameColor,
    whiteSpace: "nowrap",
}));

export const PropValue = styled.pre(props => ({
    flex: "0 1 50%",
    margin: 0,
}));

export const ParentChainHeader = styled.div(props => ({
    paddingTop: 10,
    marginLeft: 5,
    marginRight: 5,
    color: "#CCC0CC",
    borderBottom: "1px solid #aaa",
    fontFamily: "Consolas, monospace",
}));

export const ParentChainItem = styled.div<{ current?: boolean }>(props => ({
    fontFamily: "Consolas, monospace",
    fontSize: "11px",
    lineHeight: "17px",
    padding: "0 5px",
    cursor: "default",

    backgroundColor: props.current ? itemCurrentBgColor : undefined,
    ":hover": {
        borderRadius: 2,
        backgroundColor: props.current ? itemCurrentBgColor : itemHoverBgColor,
    },
}));

export const globalStyles = css({
    body: {
        height: "100%",
    },
    html: {
        height: "100%",
    },
    "#root": {
        height: "100%",
        position: "relative",
    },
});
