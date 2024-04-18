import { Router } from "express";
import { PlaygroundRoutes } from "./playground.routes";
const router: Router = Router();
router.use("/playgrounds", PlaygroundRoutes);

export { router as routes };
