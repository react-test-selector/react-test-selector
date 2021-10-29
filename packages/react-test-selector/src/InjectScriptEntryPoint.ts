import { IReactTestSelectorResult } from "./Selectors/IReactTestSelectorResult";
import { RootReactTestSelectorResult } from "./Selectors/RootReactTestSelectorResult";

interface ReactTestSelectorGlobal {
    querySelector(selectorString: string): IReactTestSelectorResult;
}

declare global {
    interface Window {
        rts: ReactTestSelectorGlobal;
    }
}

window.rts = {
    querySelector: (selectorString: string) => new RootReactTestSelectorResult().querySelector(selectorString),
};
