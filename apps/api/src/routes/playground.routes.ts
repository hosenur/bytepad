import { Router } from "express";
import { PlaygroundController } from "@/controllers";

const router: Router = Router();
const controller: PlaygroundController = new PlaygroundController();

router.get("/", controller.getPlaygrounds);
router.get("/:tag", controller.getPlaygroundStatus);
router.post("/", controller.createPlayground);
router.delete("/:tag", controller.deletePlayground);
router.get("/port/:tag", controller.getPort);
router.post("/add", controller.addUserToPlayground);

export { router as PlaygroundRoutes };
