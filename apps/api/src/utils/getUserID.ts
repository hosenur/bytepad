import clerkClient from "@clerk/clerk-sdk-node";
export const getUserID = async (token: string) => {
    const { sub } = await clerkClient.verifyToken(token);
    const { id } = await clerkClient.users.getUser(sub);
    return id;
}
