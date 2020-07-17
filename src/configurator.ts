interface ConfiguratorConfig {
  [key: string]: ConfigNode;
}

interface ConfigValue {
  /**
   * The environment variable to pull from
   * @example "NODE_ENV"
   */
  env: string;
  /**
   * The function that should be used to convert the value
   * @example Number
   * @default String
   */
  type?: Function;
  /**
   * Whether or not this environment variable is required to be set
   *
   * _configurator_ will throw an error if this is `true` and the environment variable is not set
   * @default false
   */
  required?: boolean;
  /**
   * The default value to use, if any, if the environment variable is not set
   * @default undefined
   */
  default?: any;
}

export interface ConfigNode {
  [key: string]: ConfigType;
}

type ConfigType = ConfigNode | ConfigValue | string;

const isConfigValue = (obj: ConfigType): obj is ConfigValue =>
  (obj as ConfigValue).env !== undefined;

const isConfigNode = (
  obj: ConfigValue | ConfigNode | string
): obj is ConfigNode =>
  Object.entries(obj).length > 0 && Object.entries(obj)[0].length > 0;

const buildConfigTree = (variable: ConfigNode): ConfigNode => {
  let obj = {};

  for (const [key, value] of Object.entries(variable)) {
    let childItem = {};

    if (typeof value === "string") {
      childItem = { [key]: process.env[value] };
    } else if (isConfigValue(value)) {
      const configValue = value as ConfigValue;
      const envValue = process.env[value.env];

      if (configValue.required && envValue === undefined)
        throw new Error(
          `configurator variable '${key}' is required but '${value.env}' is not set`
        );

      const typeFunc = value.type === undefined ? String : value.type;

      childItem = {
        [key]:
          envValue === undefined ? typeFunc(value.default) : typeFunc(envValue),
      };
    } else if (isConfigNode(value)) {
      childItem = { [key]: buildConfigTree(value) };
    } else {
      console.error(`???`);
    }

    Object.assign(obj, childItem as ConfigValue);
  }

  return obj as ConfigNode;
};

/**
 * Generates an object containing the specified application configuration
 *
 * NOTE: This module will not automatically read in any environment variables from external sources (e.g. via `dotenv`)
 * @param config
 */
export const configurator = <T extends unknown>(
  config: ConfiguratorConfig
): T => Object.assign({}, buildConfigTree(config)) as T;

/**
 * Combines multiple `configurator` objects into a single object
 *
 * NOTE: duplicate keys from later parameters will overwrite keys from earlier parameters
 * @param configs The `configurator` objects to combine
 * @return object[]
 */
export const combinator = (...configs: object[]) =>
  Object.assign({}, ...configs);
