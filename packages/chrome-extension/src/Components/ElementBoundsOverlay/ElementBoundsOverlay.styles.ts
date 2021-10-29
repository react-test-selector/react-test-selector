import styled from "@emotion/styled";

export const InnerOverlay = styled.div({
    zIndex: 1000001,
    position: "fixed",
    backgroundColor: `rgba(0, 0, 255, 0.2)`,
    pointerEvents: "none",
    boxSizing: "border-box",
});

export const VerticalLine = styled.div({
    zIndex: 1000000,
    position: "fixed",
    pointerEvents: "none",
    width: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    borderLeft: `1px dashed #888`,
});

export const HorizontalLine = styled.div({
    zIndex: 1000000,
    position: "fixed",
    pointerEvents: "none",
    height: 0,
    left: 0,
    right: 0,
    opacity: 0.5,
    borderTop: `1px dashed #888`,
});

export const OuterOverlay = styled.div({
    zIndex: 1000000,
    position: "fixed",
    backgroundColor: `rgba(0, 255, 0, 0.2)`,
    pointerEvents: "none",
    boxSizing: "border-box",
    border: `1px dotted  #888`,
});
