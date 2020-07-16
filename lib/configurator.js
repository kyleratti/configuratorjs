"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurator = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const isConfigValue = (obj) => obj.type;
const isConfigNode = (obj) => Object.entries(obj).length === 1;
const buildConfigTree = (variable) => {
    let obj = {};
    for (const [key, value] of Object.entries(variable)) {
        let kid = {};
        if (isConfigValue(value)) {
            const configValue = value;
            const envValue = process.env[value.env];
            if (configValue.required && envValue === undefined)
                throw new Error(`configurator variable ${key} is required but ${value.env} is not set`);
            Object.assign(kid, {
                [key]: envValue === undefined
                    ? value.type(value.default)
                    : value.type(envValue),
            });
        }
        else if (isConfigNode(value)) {
            kid = { [key]: buildConfigTree(value) };
        }
        Object.assign(obj, kid);
    }
    return obj;
};
exports.configurator = (opts) => {
    dotenv_1.default.config(opts.envOpts);
    let test = buildConfigTree(opts.variables);
    console.log(`test`, test);
    console.log(`test`);
    let vars = {};
    Object.assign(vars, buildConfigTree(opts.variables));
    return vars;
};
/*
export const config = configurator({
  envOpts: {
    file: ".env.production"
  },
  vars: {
    reddit: {
      userAgent: {
        type: string,
        required: true,
      },
    }
  }
})
*/
//# sourceMappingURL=configurator.js.map