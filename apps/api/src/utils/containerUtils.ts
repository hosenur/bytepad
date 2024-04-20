import { exec } from 'child_process';
import fs from 'fs-extra'
import util from 'util';
import { redis } from './redis';
interface File {
    type: "file" | "dir";
    name: string;
}

const execAsync = util.promisify(exec);
const getRandomPort = () => {
    return Math.floor(Math.random() * 2000) + 3000;
}
export const createContainer = async (tag: string) => {
    //check if a docker container with the same tag is running, by execAsync
    const existingContainer = await execAsync(`docker ps -a -q --filter "name=${tag}"`);
    if (existingContainer.stdout) {
        console.log("Container Already Exists For Tag: ", tag);
        return;
    }

    console.log("Creating Container For Tag: ", tag);


    const port = getRandomPort();
    await execAsync(`mkdir -p ./tmp/${tag} && aws s3 cp s3://bytepad/playgrounds/${tag} ./tmp/${tag} --recursive`);
    await execAsync(`docker run -d --name ${tag} -v ./tmp/${tag}:/app -p ${port}:3000 bytepad sh -c "cd /app && bun install && bun dev"`);
    await redis.set(tag, JSON.stringify({ port, lastRequest: Date.now() }));
    console.log(tag, " running on port ", port);
    return port;
}


export const getDirectory = (dir: string, baseDir: string): Promise<File[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files.map(file => ({ type: file.isDirectory() ? "dir" : "file", name: file.name, path: `${baseDir}/${file.name}` })));
            }
        });
    });
}
















export const getFile = async (pathToFile: string, tag: string) => {
    await redis.set(tag, JSON.stringify({ port: 3000, lastRequest: Date.now() }));
    return new Promise((resolve, reject) => {
        fs.readFile(pathToFile, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}
export const saveFile = async (file: string, content: string, tag: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, content, "utf8", (err) => {
            if (err) {
                return reject(err);
            }
            sysncFolderToS3(tag).then(() => {
                resolve();
            })
        });
    });
}
function sysncFolderToS3(tag: string) {
    return execAsync(`aws s3 sync ./tmp/${tag} s3://bytepad/playgrounds/${tag} --exclude "node_modules/*"`);
}
