import { z } from "zod";

const envVariables = z.object({
  SERVER: z.string({ required_error: "Env variable SERVER is required" }),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string({
    required_error:
      "Env variable NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required",
  }),
  CLERK_SECRET_KEY: z.string({
    required_error: "Env variable CLERK_SECRET_KEY is required",
  }),
});

// eslint-disable-next-line import/no-mutable-exports
let parsed: z.infer<typeof envVariables>;

try {
  parsed = envVariables.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const errorMessage = JSON.parse(error.message)[0].message;
    throw new Error(errorMessage);
  } else {
    throw Error("Something went wrong parsing env variables");
  }
}

export default parsed;
