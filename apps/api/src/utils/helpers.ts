import { ExecException, exec } from 'child_process';
import fs from 'fs-extra';
import util from 'util';
const execAsync = util.promisify(exec);
import { render } from '@react-email/render';
import { InviteEmail } from "@/emails/invite"


// Deletes the container from system
export async function deleteContainer(tag: string) {
    const exists = await checkTag(tag);
    if (exists) {
        try {
            await execAsync(`docker rm -f ${tag}`);
            return console.log("Container Deleted");
        }
        catch (e) {
            console.error(e);
        }
    }
    return console.log("Container Not Found");
}

// clears the locally stored project files
export async function cleanStorage(tag: string) {
    const exists = await checkFileExists(tag);
    if (exists) {
        try {
            await fs.remove(`./tmp/${tag}`);
            return console.log("Storage Cleaned");
        }
        catch (e) {
            console.error(e);
        }
    }
    return console.log("Storage Not Found");
}

// checks if a container with the given tag exists
export function checkTag(tag: string) {
    return new Promise((resolve, reject) => {
        exec(`docker ps -a -q --filter "name=${tag}"`, (err: ExecException | null, stdout: string, stderr: string) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(stdout ? true : false);
            }
        })
    })
}

// checks if a file with the given tag exists
export async function checkFileExists(tag: string) {
    return fs.existsSync(`./tmp/${tag}`);
}

//send invitation email
export async function sendInvitationEmail(email: string, token: string, tag: string) {
    const emailHtml = render(InviteEmail({ token, tag }));

}