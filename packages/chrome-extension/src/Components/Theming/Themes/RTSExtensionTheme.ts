export interface IRTSTheme {
    intervals: [number, number, number];
    token: (factor: number) => number;
}

export interface IRTSEmotionTheme {
    rts: IRTSTheme;
}

export function createTheme(rtsTheme: IRTSTheme): IRTSEmotionTheme {
    return { rts: rtsTheme };
}

export const primaryFontColor = "#5F6368";
export const panelBgColor = "#F1F3F4";
export const panelBorderColor = "#CACDD1";
export const panelButtonHoverColor = "#EAEAEA";
export const panelButtonActiveColor = panelButtonHoverColor;

export const itemCurrentBgColor = "#CFE8FC";
export const itemHoverBgColor = "#EBF1FB";

export const tabUnderlineColor = "#1A73E8";

export const codePropNameColor = "#C80000";

