import { app } from "./app";
import util from "util";
import { exec } from "child_process";
import { Server } from "socket.io";
import * as http from "http";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { s3 } from "./utils/s3";
import { redis } from "./utils/redis";
import { createContainer, getDirectory } from "@/utils/containerUtils"
const lastRequestMap = new Map<string, number>();
const execAsync = util.promisify(exec);
async function stopIdleContainers() {
  const keys = await redis.keys("*");
  if (!keys) return;
  keys.forEach(async (key) => {
    const containerInfo = await redis.get(key);
    const { lastRequest, port } = JSON.parse(containerInfo || "{}");
    if (Date.now() - lastRequest > 60000) {
      console.log(`Stopping container ${key}`)
      try {
        await execAsync(`docker stop ${key}`);
        await execAsync(`docker rm ${key}`);
        await redis.del(key);
      }
      catch (e) {
        console.error(e)
      }
    }
  });
}
setInterval(() => {
  stopIdleContainers();
}, 60000);

function bootstrap() {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const isValid = ClerkExpressWithAuth({
      signInUrl: "/login",
    });
    if (!isValid) {
      return next(new Error("Authentication error"));
    }
    next();
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("getContainer", async (tag: string) => {
      const containerInfo = await redis.get(tag);
      const existingPort = JSON.parse(containerInfo || "{}").port;
      if (existingPort) {
        socket.emit("containerCreated", existingPort);
        const newcontainerInfo = JSON.stringify({ port: existingPort, lastRequest: Date.now() });
        await redis.set(tag, newcontainerInfo);
        return;
      }
      const newPort = await createContainer(tag);
      socket.emit("containerCreated", newPort);
    })

    socket.on("getDirectory", async (tag: string) => {
      const directory = await getDirectory(tag);
      console.log(directory)
      socket.emit("directory", directory);
    })

  });


  server.listen(app.get("port"), () => {
    console.log(
      `Server is running at http://${app.get("host")}:${app.get("port")}`
    );
  });
}

bootstrap();

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
