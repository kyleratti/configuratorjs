import { configurator } from "./configurator";

export * from "./configurator";

const config = configurator({
  variables: {
    snoowrap: {
      userAgent: {
        env: "SNOOWRAP_USER_AGENT",
        required: true,
      },
    },
  },
});

console.log(config);
