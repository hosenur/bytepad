import * as envalid from "envalid";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export const env = envalid.cleanEnv(process.env, {
  APP_HOST: envalid.str({ default: "10.122.16.2" }),
  APP_PORT: envalid.port({ default: 8080 }),
  DATABASE_URL: envalid.url(),
  AWS_ACCESS_KEY_ID: envalid.str(),
  AWS_SECRET_ACCESS_KEY: envalid.str(),
  AWS_REGION: envalid.str(),
  REDIS_URL: envalid.url(),
});
