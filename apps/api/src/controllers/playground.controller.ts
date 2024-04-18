import prisma from "@/utils/db";
import { getUserID } from "@/utils/getUserID";
import type { Request, Response } from "express";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { v4 as uuid } from 'uuid';
export class PlaygroundController {


  public async createPlayground(req: Request, res: Response): Promise<void> {
    console.log(req.auth)
    const { type } = req.body;
    if (!type) {
      res.status(400).json({ message: "Type is required" });
      return;
    }
    const name = uniqueNamesGenerator({ dictionaries: [colors, animals], separator: '-', length: 2, seed: uuid() });
    res.json({ status: true, name });
    // uploadProjectToS3("bytereact", name);
  }

}
