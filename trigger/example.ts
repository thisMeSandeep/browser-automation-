import { logger, task } from "@trigger.dev/sdk";

export const helloWorld = task({
  id: "hello-world",
  run: async (payload: { message: string }) => {
    logger.log("Hello, world!", { payload });

    return {
      message: `Task Finished `,
    };
  },
});
