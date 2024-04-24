import { FrameworkType } from "@/types";
import { exec } from 'child_process';
import util from "util";
import { getTemplateName } from "./getTemplateName";
import { cleanStorage, deleteContainer } from "./helpers";
import { redis } from "./redis";
import { s3 } from "./s3";

const execAsync = util.promisify(exec);

// Assuming listedObjects.Contents is an array of S3.ObjectListEntry
async function copyFolderContents(
    sourceBucket: string,
    sourcePrefix: string,
    targetBucket: string,
    targetPrefix: string
): Promise<void> { // Specify return type as Promise<void>
    const listedObjects = await s3.listObjectsV2({ Bucket: sourceBucket, Prefix: sourcePrefix }).promise();
    if (!listedObjects.Contents) return;

    await Promise.all(listedObjects.Contents.map(async (object) => { // Type for object
        if (!object.Key) return; // Add a check for object.Key (optional
        const targetKey = object.Key.replace(sourcePrefix, targetPrefix);

        if (object.Key.endsWith('/')) {
            await s3.putObject({ Bucket: targetBucket, Key: targetKey }).promise();
            await copyFolderContents(sourceBucket, object.Key, targetBucket, targetKey);
        } else {
            await s3.copyObject({
                Bucket: targetBucket,
                CopySource: `${sourceBucket}/${object.Key}`,
                Key: targetKey,
            }).promise();
        }
    }));
}

export const setupPlayground = async (framework: FrameworkType, tag: string) => {
    const templateName = getTemplateName(framework);

    const sourceBucket = 'bytepad';
    const sourcePrefix = `templates/${templateName}/`;
    const targetBucket = 'bytepad';
    const targetPrefix = `playgrounds/${tag}/`;

    try {
        await copyFolderContents(sourceBucket, sourcePrefix, targetBucket, targetPrefix);
        console.log(`Successfully copied template to playground for tag: ${tag}`);
    } catch (error) {
        console.error('Error copying template:', error);
        throw error;
    }
};

export const clearPlayground = async (tag: string) => {
    await deleteContainer(tag);
    await cleanStorage(tag);
    await redis.del(tag);
}

