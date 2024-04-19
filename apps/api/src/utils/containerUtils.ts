import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);
const usedPorts = new Set();

const getPort = () => {
    let port = Math.floor(Math.random() * 10000) + 3000;
    while (usedPorts.has(port)) {
        port = Math.floor(Math.random() * 10000) + 3000;
    }
    usedPorts.add(port);
    return port;
};

export const createContainer = async (tag: string) => {
    try {
        const { stdout: existingContainerNames, stderr } = await execAsync(`docker ps --filter "name=${tag}" --format "{{.Names}}"`);

        if (existingContainerNames) {
            console.log(`Container with tag ${tag} already exists`);
            // Start existing container
            await execAsync(`docker start ${tag}`);
            // Get the port of the container
            // const { stdout: portOutput } = await execAsync(`docker port ${tag}`);
            // const port = portOutput.split(':')[1].trim();
            // console.log(`Container with tag ${tag} started on port ${port}`);
            // return port;
            //just get the exposed port from the container
            const { stdout: portOutput } = await execAsync(`docker inspect --format='{{(index (index .NetworkSettings.Ports "3000/tcp") 0).HostPort}}' ${tag}`);
            const port = portOutput.trim();
            console.log(`Container with tag ${tag} started on port ${port}`);
            return port;
        }

        // Download project files from S3 to temporary folder
        await execAsync(`mkdir -p /tmp/${tag} && aws s3 cp s3://bytepad/playgrounds/${tag} /tmp/${tag} --recursive`);

        const port = getPort();

        // Run new container
        await execAsync(`docker run -d --name ${tag} -v /tmp/${tag}:/app -p ${port}:3000 bytepad sh -c "cd /app && yarn install && yarn dev --port 3000 --host"`);
        console.log(`Container with tag ${tag} started on port ${port}`);
        return port;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getDirectory = async (tag: string) => {
    try {
        const { stdout: containerNames, stderr } = await execAsync(`docker ps -a --filter "name=${tag}" --format "{{.Names}}"`);

        if (!containerNames) {
            console.log(`Container with tag ${tag} does not exist`);
            return null;
        }

        const { stdout: filesOutput } = await execAsync(`docker exec ${tag} find /app -type f -not -path '**/node_modules/*'`);
        const files = filesOutput.split('\n').map(file => file.replace('/app/', ''));

        return files;
    } catch (error) {
        console.error(error);
        return null;
    }
};
