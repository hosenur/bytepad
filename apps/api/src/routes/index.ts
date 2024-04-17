import { Router } from "express";
import { PlaygroundRoutes } from "./playground.routes";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
const router: Router = Router();
router.use("/playground", PlaygroundRoutes);

export { router as routes };
