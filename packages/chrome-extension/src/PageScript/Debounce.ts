export function debounce<A extends unknown[]>(func: (...args: A) => void, wait: number): (...args: A) => void {
    let timeout: NodeJS.Timeout | undefined;
    return function(...args: A): void {
        if (timeout != undefined) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            timeout = undefined;
            func(...args);
        }, wait);
    };
}
