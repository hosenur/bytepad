import { exec } from 'child_process';
enum PlaygroundType {
    REACT = 'react',
    NEXT = 'next',
}
const getCommand = (type: PlaygroundType, port: number, name: string) => {
    switch (type) {
        case PlaygroundType.REACT:
            return `docker run -p 5173:${port} -d --name ${name} bytereact`;
        case PlaygroundType.NEXT:
            return `npx create-next-app playground-${port}`;
        default:
            return '';
    }
}

export const createPlayground = async (name: string, type: PlaygroundType, port: number) => {

    const command = getCommand(type, port, name);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}