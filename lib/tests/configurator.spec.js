"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
describe("reddit tests", () => {
    test("create snoowrap configurator", () => {
        const config = __1.configurator({
            variables: {
                reddit: {
                //
                },
                snoowrap: {
                    userAgent: {
                        env: "SNOOWRAP_USER_AGENT",
                        required: true,
                    },
                },
            },
        });
    });
});
//# sourceMappingURL=configurator.spec.js.map