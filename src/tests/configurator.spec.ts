import { combinator, configurator } from "../";

describe("reddit environment variable test", () => {
  test("load default snoowrap user agent", () => {
    type DefaultOnMissingVarConfig = {
      snoowrap: {
        userAgent: string;
      };
    };

    const variables = {
      snoowrap: {
        userAgent: {
          env: "SNOOWRAP_USER_AGENT_NOTREAL",
          default: "configurator_test",
        },
      },
    };

    return expect(
      configurator<DefaultOnMissingVarConfig>(variables).snoowrap.userAgent
    ).toEqual(variables.snoowrap.userAgent.default);
  });

  test("error on missing required variable", () => {
    type ErrorOnMissingVarConfig = {
      snoowrap: {
        userAgent: string;
      };
    };

    const variables = {
      snoowrap: {
        userAgent: {
          env: "SNOOWRAP_USER_AGENT_NOTREAL",
          required: true,
        },
      },
    };

    return expect(() => {
      configurator<ErrorOnMissingVarConfig>({
        variables: variables,
      });
    }).toThrow();
  });

  test("load reddit username as '@kyleratti/configurator'", () => {
    type RedditUsernameConfig = {
      reddit: {
        username: string;
      };
    };

    const variables = {
      reddit: {
        username: {
          env: "REDDIT_USERNAME",
          required: true,
        },
      },
    };

    return expect(
      configurator<RedditUsernameConfig>(variables).reddit.username
    ).toBe("@kyleratti/configurator");
  });

  test("load environment variable as boolean", () => {
    type RedditUsernameConfig = {
      reddit: {
        username: string;
      };
    };

    const variables = {
      reddit: {
        username: {
          env: "REDDIT_USERNAME",
          type: Boolean,
          required: true,
        },
      },
    };

    return expect(
      configurator<RedditUsernameConfig>(variables).reddit.username
    ).toBe(true);
  });

  test("validate username against list of valid usernames", () => {
    type RedditUsernameConfig = {
      reddit: {
        username: string;
      };
    };

    const variables = {
      reddit: {
        username: {
          env: "REDDIT_USERNAME",
          required: true,
        },
      },
    };

    const validUsernames = ["@kyleratti/configurator", "configuratorjs"];

    return expect(
      validUsernames.includes(
        configurator<RedditUsernameConfig>(variables).reddit.username
      )
    ).toBe(true);
  });
});

describe("nested environment variable test", () => {
  test("load default snoowrap user agent", () => {
    type DefaultOnMissingVarConfig = {
      snoowrap: {
        user: {
          agent: string;
        };
      };
    };

    const variables = {
      snoowrap: {
        user: {
          agent: {
            env: "SNOOWRAP_USER_AGENT_NOTREAL",
            default: "configurator_test",
          },
        },
      },
    };

    return expect(
      configurator<DefaultOnMissingVarConfig>(variables).snoowrap.user.agent
    ).toEqual(variables.snoowrap.user.agent.default);
  });
});

describe("validator tests", () => {
  test("omitting validator just returns env value", () => {
    type OmittedConfig = {
      reddit: {
        username: string;
      };
    };

    const variables = {
      reddit: { username: { env: "REDDIT_USERNAME", required: true } },
    };

    return expect(
      typeof configurator<OmittedConfig>(variables).reddit.username
    ).toBe("string");
  });

  test("Boolean validator", () => {
    type BooleanConfig = {
      reddit: { username: string };
    };

    const variables = {
      reddit: {
        username: {
          env: "REDDIT_USERNAME",
          required: true,
          validator: true,
          type: Boolean,
        },
      },
    };

    return expect(configurator<BooleanConfig>(variables).reddit.username).toBe(
      true
    );
  });

  test("Array validator", () => {
    type ArrayConfig = {
      reddit: { username: string };
    };

    const variables = {
      reddit: {
        username: {
          env: "REDDIT_USERNAME",
          required: true,
          validator: ["@kyleratti/configurator", "tucker is a cute dog"],
        },
      },
    };

    return expect(() => {
      configurator<ArrayConfig>(variables);
    }).not.toThrowError();
  });

  test("Function validator", () => {
    type FunctionConfig = { reddit: { username: string } };

    const variables = {
      reddit: {
        username: {
          env: "REDDIT_USERNAME",
          required: true,
          validator: (input: String) => {
            return input.toLowerCase() === "@kyleratti/configurator";
          },
        },
      },
    };

    return expect(() => {
      configurator<FunctionConfig>(variables);
    }).not.toThrowError();
  });
});

describe("combinator", () => {
  test("combine two generic objects", () => {
    type GeneralConfigOne = {
      option: {
        key: boolean;
      };
    };

    type GeneralConfigTwo = {
      optionTwo: {
        key: string;
      };
    };

    const configOne = configurator<GeneralConfigOne>({
      option: {
        key: {
          env: "REDDIT_USERNAME",
        },
      },
    });

    const configTwo = configurator<GeneralConfigTwo>({
      optionTwo: {
        key: {
          env: "REDDIT_USERNAME",
        },
      },
    });

    const combined = combinator(configOne, configTwo);

    expect(combined.option.key).toBeDefined();
    expect(combined.optionTwo.key).toBeDefined();
  });
});
