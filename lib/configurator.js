"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurator = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const isConfigValue = (obj) => obj.env !== undefined;
const isConfigNode = (obj) => Object.entries(obj).length > 0 && Object.entries(obj)[0].length > 0;
const buildConfigTree = (variable) => {
    let obj = {};
    for (const [key, value] of Object.entries(variable)) {
        let childItem = {};
        if (typeof value === "string") {
            childItem = { [key]: process.env[value] };
        }
        else if (isConfigValue(value)) {
            const configValue = value;
            const envValue = process.env[value.env];
            if (configValue.required && envValue === undefined)
                throw new Error(`configurator variable '${key}' is required but '${value.env}' is not set`);
            const typeFunc = value.type === undefined ? String : value.type;
            childItem = {
                [key]: envValue === undefined
                    ? typeFunc(value.default)
                    : value.type(envValue),
            };
        }
        else if (isConfigNode(value)) {
            childItem = { [key]: buildConfigTree(value) };
        }
        else {
            console.error(`???`);
        }
        Object.assign(obj, childItem);
    }
    return obj;
};
exports.configurator = (opts) => {
    dotenv_1.default.config(opts.envOpts);
    return Object.assign({}, buildConfigTree(opts.variables));
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