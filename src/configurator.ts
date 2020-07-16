import dotenv from "dotenv";

type ConfiguratorConfig = {
  envOpts?: dotenv.DotenvConfigOptions;
  variables: ConfigNode;
};

type ConfigValue = {
  /**
   * The environment variable to pull from
   * @example `NODE_ENV`
   */
  env: string;
  /**
   * The function that should be used to convert the value
   * @default String
   * @example Number
   */
  type?: any;
  required?: boolean;
  default?: any;
};

type ConfigNode = {
  [key: string]: ConfigNode | ConfigValue;
};

const isConfigValue = (obj: ConfigValue | ConfigNode): obj is ConfigValue =>
  (obj as ConfigValue).type;

const isConfigNode = (obj: ConfigValue | ConfigNode): obj is ConfigNode =>
  Object.entries(obj).length === 1;

const buildConfigTree = (variable: ConfigNode): ConfigNode => {
  let obj = {};

  for (const [key, value] of Object.entries(variable)) {
    let kid = {};
    if (isConfigValue(value)) {
      const configValue = value as ConfigValue;
      const envValue = process.env[value.env];

      if (configValue.required && envValue === undefined)
        throw new Error(
          `configurator variable ${key} is required but ${value.env} is not set`
        );

      Object.assign(kid, {
        [key]:
          envValue === undefined
            ? value.type(value.default)
            : value.type(envValue),
      });
    } else if (isConfigNode(value)) {
      kid = { [key]: buildConfigTree(value) };
    }

    Object.assign(obj, kid);
  }

  return obj;
};

export const configurator = (opts: ConfiguratorConfig): ConfigNode => {
  dotenv.config(opts.envOpts);

  let test = buildConfigTree(opts.variables);
  console.log(`test`, test);
  console.log(`test`);

  let vars = {};
  Object.assign(vars, buildConfigTree(opts.variables));

  return vars as ConfigNode;
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
