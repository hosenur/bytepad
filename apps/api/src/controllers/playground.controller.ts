import prisma from "@/utils/db";
import { getTemplateName } from "@/utils/getTemplateName";
import { setupPlayground } from "@/utils/setupPlyagound";
import type { Request, Response } from "express";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { v4 as uuid } from 'uuid';
export class PlaygroundController {


  public async createPlayground(req: Request, res: Response): Promise<void> {
    const template = getTemplateName(req.body.type);
    const { framework } = req.body;
    if (!framework) {
      res.status(400).json({ message: "Type is required" });
      return;
    }
    if (!req.auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const tag = uniqueNamesGenerator({ dictionaries: [colors, animals], separator: '-', length: 2, seed: uuid() });
    await setupPlayground(framework, tag);
    await prisma.playground.create({
      data: {
        tag: tag,
        owner: req.auth.userId,
        framework: req.body.framework,
        PlaygroundMember: {
          create: {
            role: "OWNER",
            userId: req.auth.userId,
          }
        }
      }
    })
    res.status(201).json({ tag });
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

  public async getPlaygroundFileTree(req: Request, res: Response): Promise<void> {
    const params = {
      Bucket: "bytepad",
      Prefix: "teal-swift"
    }

  }

}
