import { z } from "zod";
import "dotenv/config";

const envVariables = z.object({
  PORT: z.string({ required_error: "Env variable PORT is required" }),
  DATABASE_URL: z.string({
    required_error: "Env variable DATABASE_URL is required",
  }),
});

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
