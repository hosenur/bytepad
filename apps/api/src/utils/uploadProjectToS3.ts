import * as fs from 'fs';
import * as path from 'path';
import { s3 } from './s3';

function walkSync(dir: string, filelist: string[] = []): string[] {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            filelist = walkSync(filePath, filelist);
        } else {
            filelist.push(filePath);
        }
    });
    return filelist;
}
export async function uploadProjectToS3(template: string, projectName: string) {
    const templatePath = path.join(__dirname, "..", "templates", template);
    const files = walkSync(templatePath);
    for (const file of files) {
        const fileContent = fs.readFileSync(file);
        const relativePath = path.relative(templatePath, file);
        const params = {
            Bucket: "bytepad",
            Key: `${projectName}/${relativePath}`,
            Body: fileContent
        };
        try {
            await s3.putObject(params).promise();
            console.log(`Successfully uploaded ${file}`);
        }
        catch (err) {
            console.log(err);
        }

    }
}