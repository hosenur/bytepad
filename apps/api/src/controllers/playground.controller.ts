import prisma from "@/utils/db";
import { getTemplateName } from "@/utils/getTemplateName";
import { clearPlayground, setupPlayground } from "@/utils/playgroundUtils";
import { redis } from "@/utils/redis";
import { s3 } from "@/utils/s3";
import { Playground } from "@prisma/client";
import type { Request, Response } from "express";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { v4 as uuid } from 'uuid';

export class PlaygroundController {
  public async getPlaygroundStatus(req: Request, res: Response): Promise<void> {
    const { tag } = req.params;
    const running = await redis.get(tag) ? true : false;
    res.json({ running });
  }
  public async getPort(req: Request, res: Response): Promise<void> {
    const { tag } = req.params;
    const data = await redis.get(tag);
    const port = JSON.parse(data || "{}").port;
    res.json({ port });
  }


  public async deletePlayground(req: Request, res: Response): Promise<void> {
    const { tag } = req.params;
    if (!req.auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const playground = await prisma.playground.findFirst({
      where: {
        tag,
        PlaygroundMember: {
          some: {
            userId: req.auth.userId
          }
        }
      }
    });
    if (!playground) {
      res.status(404).json({ message: "Playground not found" });
      return;
    }
    await prisma.playgroundMember.deleteMany({
      where: {
        playgroundId: playground.id
      }
    });
    await prisma.playground.delete({
      where: {
        id: playground.id
      }
    });
    await redis.del(tag);
    //delete from s3, /tmp/{tag} and stop and remove container if running
    const params = {
      Bucket: 'bytepad',
      Delete: {
        Objects: [
          { Key: `playgrounds/${tag}/` },
          { Key: `playgrounds/${tag}` }
        ],
        Quiet: false
      }
    };
    await s3.deleteObjects(params).promise();
    await clearPlayground(tag)
    res.json({ message: "Playground deleted" });
  }


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
    type ResponseType = (Playground & { running: boolean })[];
    if (!req.auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const data = await prisma.playground.findMany({
      where: {
        PlaygroundMember: {
          some: {
            userId: req.auth.userId
          }
        }
      }
    })
    const playgrounds: ResponseType = await Promise.all(data.map(async playground => {
      const running = await redis.get(playground.tag) ? true : false;
      return {
        running,
        ...playground
      };
    }));
    res.json(playgrounds);
  }

}
