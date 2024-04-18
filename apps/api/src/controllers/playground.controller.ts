import prisma from "@/utils/db";
import { getTemplateName } from "@/utils/getTemplateName";
import { getUserID } from "@/utils/getUserID";
import { uploadProjectToS3 } from "@/utils/uploadProjectToS3";
import { WithAuthProp } from "@clerk/clerk-sdk-node";
import type { Request, Response } from "express";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { v4 as uuid } from 'uuid';
export class PlaygroundController {


  public async createPlayground(req: Request, res: Response): Promise<void> {
    const template = getTemplateName(req.body.type);
    const { type } = req.body;
    if (!type) {
      res.status(400).json({ message: "Type is required" });
      return;
    }
    if (!req.auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const name = uniqueNamesGenerator({ dictionaries: [colors, animals], separator: '-', length: 2, seed: uuid() });
    await prisma.playground.create({
      data: {
        name: name,
        owner: req.auth.userId,
        type: "REACT",
        PlaygroundMember: {
          create: {
            role: "OWNER",
            userId: req.auth.userId,
          }
        }
      }
    })
    await uploadProjectToS3(template, name);
    res.status(201).json({ name });
  }

  public async getPlaygrounds(req: Request, res: Response): Promise<void> {
    if (!req.auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const playgrounds = await prisma.playground.findMany({
      where: {
        PlaygroundMember: {
          some: {
            userId: req.auth.userId
          }
        }
      }
    })
    res.json(playgrounds);
  }
  
}
