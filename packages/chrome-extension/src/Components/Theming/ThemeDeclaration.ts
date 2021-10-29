import { IRTSEmotionTheme } from "./Themes/RTSExtensionTheme";

declare module "@emotion/react" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Theme extends IRTSEmotionTheme {}
}

