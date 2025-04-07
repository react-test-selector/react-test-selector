import { IQuerySelectorResult } from "./Selectors/IQuerySelectorResult";
import { RootReactTestSelectorResult } from "./Selectors/RootReactTestSelectorResult";

interface ReactTestSelectorGlobal {
    querySelector(selectorString: string): IQuerySelectorResult;
}

declare global {
    interface Window {
        rts: ReactTestSelectorGlobal;
    }
}

window.rts = {
    querySelector: (selectorString: string) => new RootReactTestSelectorResult().querySelector(selectorString),
};
