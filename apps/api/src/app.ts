import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { routes } from "@/routes";
import { env } from "@/config";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

export const app: Application = express();
app.use(
    cors({
        origin: "*",
    })
);
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(morgan(env.isDev ? "dev" : "combined"));
app.use(
    express.json({
        limit: "5mb",
    })
);    
app.use(routes);
app.all(
    "*",
    ClerkExpressWithAuth({
      signInUrl: "/login",
    }));
app.use("*", (_, res) => {
    res.status(404).json({
        message: "Not Found",
    });
});

app.set("host", env.APP_HOST);
app.set("port", env.APP_PORT);
app.set("json spaces", 2);
