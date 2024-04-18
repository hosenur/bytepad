import { Router } from "express";
import { PlaygroundController } from "@/controllers";

const router: Router = Router();
const controller: PlaygroundController = new PlaygroundController();

router.get("/", controller.getPlaygrounds);
router.post("/", controller.createPlayground);

export { router as PlaygroundRoutes };
