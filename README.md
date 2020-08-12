# configuratorjs

- [configuratorjs](#configuratorjs)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)
  - [Configurator Type](#configurator-type)
  - [Configurator ConfigValue](#configurator-configvalue)
- [Example](#example)
  - [`appConfig.ts`](#appconfigts)
  - [`server.ts`](#serverts)
- [Combining Multiple Configurations](#combining-multiple-configurations)
  - [`globalConfig.ts`](#globalconfigts)
- [To Do](#to-do)

![CI/CD Release](https://github.com/kyleratti/configuratorjs/workflows/CI/CD%20Release/badge.svg) ![npm (scoped)](https://img.shields.io/npm/v/@kyleratti/configurator) ![NPM](https://img.shields.io/npm/l/@kyleratti/configurator)

A generic environment variable configuration library. There weren't enough already, so I built my own.

This library exists because I wanted the flexibility and security of reading in environment variables without compromising typings in TypeScript. It also breaks this micro package away from needing to include larger and unrelated packages in my projects, such as the entire [tuckbot-util](https://github.com/kyleratti/tuckbot-util) package for a configuration library.

By defining a `type` for a config, and a set of `parameters`, this library allows you to quickly build config structures from environment variables while including variable validation, variable requirements, defaults, and of course, TypeScript typings.

# Dependencies

- [dotenv](https://github.com/motdotla/dotenv)

# Installation

This package is [published on npm](https://www.npmjs.com/package/@kyleratti/configurator).

```shell
npm i --save @kyleratti/configurator
```

# Usage

Configurator has two main components to it: `types` and `ConfigValues`. A `type` is what tells TypeScript what to expect from your generated `configurator`. A `ConfigValue` tells the library how to interpret your configuration item.

## Configurator Type

The `type` of your configurator leverages TypeScript's wonderful type system to give you dependable access to your environment variables.

We're not reinventing the wheel on this one, so you can use any valid TypeScript type definition.

```typescript
type MyConfig = {
  admin: {
    port: number;
  };
};
```

## Configurator ConfigValue

The `ConfigValue` of your configurator is what is used by the library to build and validate your configuration to give output an object with the type you defined. Its structure should mimic your `type` above. You can nest `ConfigValue` objects as deeply as you need.

Each `ConfigValue` is an object containing:

| Property   | Type       | Required | Default       | Description                                                                                                                                                            |
| ---------- | ---------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `env`      | `string`   | `Yes`    |               | The environment variable to read from `process.env`                                                                                                                    |
| `type`     | `Function` | `No`     | `String(...)` | The function that should be used to convert the `env` variable                                                                                                         |
| `required` | `boolean`  | `No`     | `false`       | Whether or not this environment variable is required to be set. If this is `true` and the environment variable is not set, `configurator(...)` will `throw` an `Error` |
| `default`  | `any`      | `No`     |               | The default value to use, if any, should the environment variable not be set                                                                                           |

```typescript
const myConfigValue = {
  admin: {
    port: {
      env: "ADMIN_PORT",
      type: Number,
      required: false,
      default: 3991,
    },
  },
};
```

# Example

Let's put all of that together for a quick example.

## `appConfig.ts`

```typescript
import configurator from "@kyleratti/configurator";

/**
 * Admin configuration
 */
type AppConfig = {
  admin: {
    /**
     * The password needed to access the admin section
     * @required
     */
    password: string;

    /**
     * The port the admin section is listening on
     * @default 3991
     */
    port: number;
  };
  site: {
    /**
     * The title of the website
     * @default "!!! SITE TITLE UNSET !!!"
     */
    title: string;
  };
};

export const appConfig = configurator<AppConfig>({
  admin: {
    password: {
      env: "APP_ADMIN_PASSWORD",
      required: true,
    },
    port: {
      env: "APP_ADMIN_PORT",
      type: Number,
      required: false,
      default: 3991,
    },
  },
  site: {
    title: {
      env: "APP_SITE_TITLE",
      required: false,
      default: "!!! SITE TITLE UNSET !!!",
    },
  },
});
```

## `server.ts`

```typescript
import { appConfig } from "./appConfig.ts";

class Server {
  start = () => {
    console.log("Starting server...");

    console.log(`Site Title: ${appConfig.site.title}`);
    // "!!! SITE TITLE NOT SET !!!" or value of process.env.APP_SITE_TITLE

    console.log(`Admin Port: ${appConfig.admin.port}`);
    // number value of process.env.APP_ADMIN_PORT or the default

    console.log(`Admin Password: ${appConfig.admin.password}`);
    // string value of process.env.APP_ADMIN_PASSWORD or it will throw a new Error
  };
}
```

# Combining Multiple Configurations

For convenience, configurator ships with a `combinator` function that can combine multiple `configurator` objects into one.

**WARNING:** This currently does not combine types.

## `globalConfig.ts`

```typescript
import { combinator } from "@kyleratti/configurator";
import adminConfig from "./adminConfig";
import serverConfig from "./serverConfig";

export const config = combinator(adminConfig, serverConfig);
```

# To Do

- [ ] Find a way to remove the need for a type + config with nearly duplicate members
