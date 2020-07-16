"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const package_json_1 = __importDefault(require("../../package.json"));
describe("reddit tests", () => {
    test("load default snoowrap user agent", () => {
        const variables = {
            snoowrap: {
                userAgent: {
                    env: "SNOOWRAP_USER_AGENT_NOTREAL",
                    default: "configurator_test",
                },
            },
        };
        return expect(__1.configurator({ variables: variables }).snoowrap
            .userAgent).toEqual(variables.snoowrap.userAgent.default);
    });
    test("error on missing required variable", () => {
        const variables = {
            snoowrap: {
                userAgent: {
                    env: "SNOOWRAP_USER_AGENT_NOTREAL",
                    required: true,
                },
            },
        };
        return expect(() => {
            __1.configurator({
                variables: variables,
            });
        }).toThrow();
    });
    test("load reddit username as 'configuratorjs'", () => {
        const variables = {
            reddit: {
                username: {
                    env: "REDDIT_USERNAME",
                    required: true,
                },
            },
        };
        return expect(__1.configurator({ variables: variables }).reddit
            .username).toBe(package_json_1.default.name);
    });
});
//# sourceMappingURL=configurator.spec.js.map