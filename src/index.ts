import { configurator } from "./configurator";

export * from "./configurator";

const config = configurator({
  variables: {
    reddit: {
      clientId: {
        env: "REDDIT_CLIENT_ID",
      },
      clientSecret: {
        env: "REDDIT_CLIENT_SECRET",
      },
      username: {
        env: "REDDIT_USERNAME",
      },
      password: {
        env: "REDDIT_PASSWORD",
      },
    },
    snoowrap: {
      userAgent: {
        env: "SNOOWRAP_USER_AGENT",
      },
    },
  },
});

console.log(config);
