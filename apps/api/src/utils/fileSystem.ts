import { exec, ExecException } from 'child_process';

interface File {
    name: string;
    isDirectory: boolean;
    children?: File[];
}

function parseDirectoryStructure(fileList: string[]): File[] {
    const root: File[] = [];

    fileList.forEach(filePath => {
        if (filePath.includes('node_modules')) {
            return; // Skip node_modules directory
        }

        const parts = filePath.split('/');
        let currentDir: File[] = root;

        for (let i = 1; i < parts.length; i++) {
            const fileName = parts[i];
            const isLast = i === parts.length - 1;

            if (isLast) {
                // Last part, it's a file
                currentDir.push({ name: fileName, isDirectory: false });
            } else {
                // Directory
                let directory = currentDir.find(file => file.name === fileName && file.isDirectory);
                if (!directory) {
                    directory = { name: fileName, isDirectory: true, children: [] };
                    currentDir.push(directory);
                    // Sort directories alphabetically after adding
                    currentDir.sort((a, b) => a.name.localeCompare(b.name));
                }
                currentDir = directory.children as File[];
            }
        }
    });

    // Sort root directories first, then files alphabetically within each directory
    root.sort((a, b) => {
        if (a.isDirectory === b.isDirectory) {
            return a.name.localeCompare(b.name);
        }
        return a.isDirectory ? -1 : 1;
    });

    return root;
}

export async function getFileList(containerId: string): Promise<File[]> {
    // Command to list files in the current working directory inside the Docker container
    const command = `docker exec ${containerId} find .`;

    return new Promise((resolve, reject) => {
        exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                reject(`Error executing command: ${error.message}`);
            } else if (stderr) {
                reject(`Command stderr: ${stderr}`);
            } else {
                const fileList = stdout.split('\n').filter(Boolean);
                resolve(parseDirectoryStructure(fileList));
            }
        });
    });
}
