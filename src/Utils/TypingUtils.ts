export function reject(message?: string): never {
    throw new Error(message ?? "Undefined is not allowed");
}

export function isNotNullOrUndefined<T>(input: T): input is NonNullable<T> {
    return input != undefined;
}
