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
