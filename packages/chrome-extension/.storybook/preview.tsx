import * as React from "react";

import { Global } from "@emotion/react";
import { globalStorybookStyles, typographyStyles } from "./GlobalStorybookStyles";

// import "core-js/features/array/flat";
// import "core-js/features/array/flat-map";
// import "core-js/proposals/iterator-helpers";
// import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";
// import "regenerator-runtime";

export const decorators = [
    (Story: React.ComponentType, context: any) => {
        return (
            <>
            <Global styles={[globalStorybookStyles, typographyStyles]} />
            <Story/>
            </>
        );
    },
];

