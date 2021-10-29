import { css } from "@emotion/react";

export const globalStorybookStyles: any = () => {
    return css({
        body: {
            background: "#fff",
            color: "#222",
        },
    });
};

export const typographyStyles = css({
    "body, input": {
        fontFamily: "Segoe UI, Arial, sans-serif",
        fontSize: "12px",
        lineHeight:  "15px",
    },
});

