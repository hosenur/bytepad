import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export class PlaygroundController {
  public async getPlayground(_: Request, res: Response): Promise<void> {
    res.json({ message: "Hello, World!" });
  }
}
