import { exec } from 'child_process';
import util from 'util';
import { s3 } from './s3';
import { redis } from './redis';
import fs from 'fs';
const execAsync = util.promisify(exec);
const getRandomPort = () => {
    return Math.floor(Math.random() * 2000) + 3000;
}
export const createContainer = async (tag: string) => {
    const port = getRandomPort();

    await execAsync(`mkdir -p /tmp/${tag} && aws s3 cp s3://bytepad/playgrounds/${tag} /tmp/${tag} --recursive`);
    await execAsync(`docker run -d --name ${tag} -v /tmp/${tag}:/app -p ${port}:3000 bytepad sh -c "cd /app && bun install && bun dev"`);
    await redis.set(tag, JSON.stringify({ port, lastRequest: Date.now() }));
    return port;
}

export const getDirectory = async (tag: string) => {
    await redis.set(tag, JSON.stringify({ port: 3000, lastRequest: Date.now() }));
    return new Promise((resolve, reject) => {
        fs.readdir(`/tmp/${tag}`, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files.map(file => ({ type: file.isDirectory() ? "dir" : "file", name: file.name, path: file.name })));
            }
        })
    });
}

export const getFile = async (tag: string, path: string) => {
    await redis.set(tag, JSON.stringify({ port: 3000, lastRequest: Date.now() }));
    return new Promise((resolve, reject) => {
        fs.readFile(`/tmp/${tag}/${path}`, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}
export const saveFile = async (tag: string, path: string, content: string) => {
    await redis.set(tag, JSON.stringify({ port: 3000, lastRequest: Date.now() }));
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, content, "utf8", (err) => {
            if (err) {
                return reject(err);
            }
            sysncFolderToS3(tag).then(() => {
                resolve();
            })
        });
    }
    )
}
function sysncFolderToS3(tag: string) {
    return execAsync(`aws s3 sync /tmp/${tag} s3://bytepad/playgrounds/${tag}`);
}