import * as React from "react";

class ExternalValue<T> {
    private currentValue: T;
    private readonly listeners: Array<(nextValue: T) => void> = [];

    public constructor(initialValue: T) {
        this.currentValue = initialValue;
    }

    public addChangeListener(listener: (nextValue: T) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index >= 0) {
                this.listeners.splice(index, 1);
            }
        };
    }

    public get current(): T {
        return this.currentValue;
    }

    public set(nextValue: T): void {
        for (const listener of this.listeners) {
            listener(nextValue);
        }
        this.currentValue = nextValue;
    }
}

export function externalValue<T>(): ExternalValue<T | undefined>;
export function externalValue<T>(initial: T): ExternalValue<T>;
export function externalValue(initial?: unknown): ExternalValue<unknown> {
    return new ExternalValue(initial);
}

export function useExternalValue<T>(value: ExternalValue<T>): [T] {
    const [stateValue, setStateValue] = React.useState<T>(value.current);
    React.useEffect(() => value.addChangeListener(setStateValue), []);
    return [stateValue];
}
