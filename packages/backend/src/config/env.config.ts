import { z } from "zod";
import "dotenv/config";

const envVariables = z.object({
  PORT: z.string({ required_error: "Env variable PORT is required" }),
  DATABASE_URL: z.string({
    required_error: "Env variable DATABASE_URL is required",
  }),
  CLOUDFLARE_ACCOUNT_ID: z.string({
    required_error: "Env variable CLOUDFLARE_ACCOUNT_ID is required",
  }),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string({
    required_error: "Env variable CLOUDFLARE_SECRET_ACCESS_KEY is required",
  }),
  CLOUDFLARE_ACCESS_KEY_ID: z.string({
    required_error: "Env variable CLOUDFLARE_ACCESS_KEY_ID is required",
  }),
  CLOUDFLARE_BUCKET_NAME: z.string({
    required_error: "Env variable CLOUDFLARE_BUCKET_NAME is required",
  }),
});

 
let env: z.infer<typeof envVariables>;

try {
  env = envVariables.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const errorMessage = JSON.parse(error.message)[0].message;
    throw new Error(errorMessage);
  } else {
    throw Error("Something went wrong parsing env variables");
  }
}

export default env;
