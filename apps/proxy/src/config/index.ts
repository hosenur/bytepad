import * as envalid from "envalid";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export const env = envalid.cleanEnv(process.env, {
  APP_HOST: envalid.str({ default: "0.0.0.0" }),
  APP_PORT: envalid.port({ default: 7070 }),
  REDIS_URL: envalid.url(),
});
