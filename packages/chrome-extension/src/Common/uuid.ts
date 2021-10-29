export function uuid(): string {
    return uuidV4Pattern.replace(/[018]/g, randomHexDigit);
}

function randomHexDigit(placeholder: string): string {
    return (Number(placeholder) ^ ((Math.random() * 16) >> (Number(placeholder) / 4))).toString(16);
}

const uuidV4Pattern = "10000000-1000-4000-8000-100000000000";
