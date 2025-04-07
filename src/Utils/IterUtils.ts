import { Predicate } from "./Funcs";
import { reject } from "./TypingUtils";

export function* concat<T>(...iterables: Array<Iterable<T>>): IterableIterator<T> {
    for (const iterableItem of iterables) {
        yield* iterableItem;
    }
}

export function find<T>(items: Iterable<T>, condition: Predicate<T>): T | undefined {
    for (const item of items) {
        if (condition(item)) {
            return item;
        }
    }
    return undefined;
}

export function * map<T, R>(items: Iterable<T>, selector: (item: T) => R): Iterable<R> {
    for (const item of items) {
        yield selector(item);
    }
}

export function * drop<T, R>(items: Iterable<T>, count: number): Iterable<T> {
    let dropped = 0;
    for (const item of items) {
        if (dropped < count) {
            dropped++;
        } else {
            yield item;
        }
    }
}

export function * take<T, R>(items: Iterable<T>, count: number): Iterable<T> {
    let taken = 0;
    for (const item of items) {
        if (taken < count) {
            yield item;
            taken++;
        } else {
            break;
        }
    }
}

const EmptySingleElement = Symbol.for("EmptySingleElement");

export function single<T>(items: readonly T[] | Iterable<T>, singleAssertMessage?: string): T {
    if (Array.isArray(items)) {
        if (items.length !== 1) {
            throw new Error(
                singleAssertMessage ?? `Sequence must contain exactly single element, but got ${items.length}`
            );
        }
        return items[0] ?? reject();
    } else {
        let singleElement: T | typeof EmptySingleElement = EmptySingleElement;
        for (const item of items) {
            if (singleElement !== EmptySingleElement) {
                throw new Error(
                    singleAssertMessage ?? `Sequence must contain exactly single element, but got at least 2`
                );
            }
            singleElement = item;
        }
        if (singleElement === EmptySingleElement) {
            throw new Error(singleAssertMessage ?? "Sequence must contain exactly single element, but got 0");
        }
        return singleElement;
    }
}


export function filter<T, S extends T>(items: Iterable<T>, test: (value: T, index: number) => value is S): Iterable<S>;
export function filter<T>(items: Iterable<T>, test: (value: T, index: number) => boolean): Iterable<T>;
export function * filter<T>(items: Iterable<T>, test: (value: T, index: number) => boolean): Iterable<T> {
    let index = 0;
    for (const item of items) {
        if (test(item, index)) {
            yield item;
        }
        index++;
    }
}

export function * flatMap<T, U>(items: Iterable<T>, selector: (value: T) => Iterable<U>): Iterable<U> {
    for (const item of items) {
        yield * selector(item);
    }
}
