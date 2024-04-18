import { env } from "@/config";
import AWS from "aws-sdk";
AWS.config.update({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
});

export const s3 = new AWS.S3();
