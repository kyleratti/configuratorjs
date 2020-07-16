import { configurator } from "../";

describe("reddit tests", () => {
  test("create snoowrap configurator", () => {
    const config = configurator({
      variables: {
        reddit: {
          //
        },
        snoowrap: {
          userAgent: {
            env: "SNOOWRAP_USER_AGENT",
            required: true,
          },
        },
      },
    });
  });
});
