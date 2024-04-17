import { createContainer } from "@/utils/createContainer";
import { deleteContainer } from "@/utils/deleteContainer";
import { getFileList } from "@/utils/fileSystem";
import type { Request, Response } from "express";
import clerkClient from '@clerk/clerk-sdk-node';
import { uniqueNamesGenerator, animals, colors } from "unique-names-generator"
import { getUserID } from "@/utils/getUserID";
import prisma from "@/utils/db";
export class PlaygroundController {

  public async getPlaygrounds(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const id = await getUserID(token);
    const data = await prisma.playgroundMember.findMany({
      where: {
        userId: id
      }
    })
    res.json({
      playgrounds: data
    }).status(200)
  }

  public async createPlayground(req: Request, res: Response): Promise<void> {
    const { type } = req.body;
    if (!type) {
      res.status(400).json({ message: "Type is required" });
      return;
    }
    const name = uniqueNamesGenerator({ dictionaries: [colors, animals], separator: '-', length: 2 });
    createContainer(name, type, 5173);
    res.json({ name });
  }
  public async getFiles(req: Request, res: Response): Promise<void> {
    const red = await getFileList("18a77b819a55")
    res.json(red)
  }
  public async deletePlayground(req: Request, res: Response): Promise<void> {
    const { name } = req.body;
    deleteContainer(name);
    res.json({ message: "Deleted" });
  }
}
