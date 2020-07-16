"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const configurator_1 = require("./configurator");
__exportStar(require("./configurator"), exports);
const config = configurator_1.configurator({
    variables: {
        snoowrap: {
            userAgent: {
                env: "SNOOWRAP_USER_AGENT",
                required: true,
            },
        },
    },
});
console.log(config);
//# sourceMappingURL=index.js.map