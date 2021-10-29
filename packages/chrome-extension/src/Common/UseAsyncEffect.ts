import * as React from "react";

export function useAsyncEffect(action: (abortSignal: AbortSignal) => Promise<void>, deps?: React.DependencyList): void {
    React.useEffect(() => {
        const abortController = new AbortController();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        action(abortController.signal);
        return () => {
            abortController.abort();
        };
    }, deps);
}
