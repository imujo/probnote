import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export default createEnv({
  server: {
    CLERK_SECRET_KEY: z.string({
      required_error: "Env variable CLERK_SECRET_KEY is required",
    }),
  },
  client: {
    NEXT_PUBLIC_SERVER: z
      .string({
        required_error: "Env variable NEXT_PUBLIC_SERVER is required",
      })
      .url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string({
      required_error:
        "Env variable NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required",
    }),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER: process.env.NEXT_PUBLIC_SERVER,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
});
