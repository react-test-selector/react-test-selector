import { reject } from "../../../../shared/TypingUtils";

export interface ComponentNameWithHocs {
    hocs: string[];
    name: string;
}

const hocRegex = /^([^\(]+)\((.*?)\)$/;

export function parseComponentNameWithHocs(displayName: string | undefined): ComponentNameWithHocs | undefined {
    if (displayName == undefined) {
        return undefined;
    }
    let currentName = displayName;
    const hocs: string[] = [];

    let currentMatch;
    while ((currentMatch = hocRegex.exec(currentName))) {
        currentName = currentMatch[2] ?? reject();
        hocs.push(currentMatch[1] ?? reject());
    }
    return { hocs: hocs, name: currentName };
}
