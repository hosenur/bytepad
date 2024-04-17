import { exec } from 'child_process';
export const deleteContainer = async (name: string) => {
    const command = `docker rm -f ${name}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}