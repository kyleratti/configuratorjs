import configurator from "../";

describe("reddit tests", () => {
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
