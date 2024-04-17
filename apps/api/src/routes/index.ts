import { Router } from "express";
import { PlaygroundRoutes } from "./playground.routes";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
const router: Router = Router();
router.use("/playgrounds", ClerkExpressRequireAuth({}), PlaygroundRoutes);

export { router as routes };
