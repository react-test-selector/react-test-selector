import { createTheme } from "./RTSExtensionTheme";

export const lightTheme = createTheme({
    intervals: [5, 10, 20],
    token: (factor: number) => factor * 5,
});
