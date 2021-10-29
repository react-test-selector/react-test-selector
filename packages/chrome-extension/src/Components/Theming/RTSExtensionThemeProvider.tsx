import * as React from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";

import { lightTheme } from "./Themes/LightTheme";
import { darkTheme } from "./Themes/DarkTheme";

interface RTSExtensionThemeProviderProps {
    themeName: "dark" | "light";
    children: React.ReactNode;
}

export function RTSExtensionThemeProvider(props: RTSExtensionThemeProviderProps): JSX.Element {
    return (
        <EmotionThemeProvider theme={props.themeName === "light" ? lightTheme : darkTheme}>
            {props.children}
        </EmotionThemeProvider>
    );
}
